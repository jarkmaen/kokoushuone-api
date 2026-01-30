import { db } from "../database/inMemoryDB.js";
import {
    inOfficeHours,
    isQuarterHour,
    minutesBetween,
    parseISO
} from "../utils/time.js";
import {
    MAX_DURATION_MINUTES,
    MAX_RESERVED_BY_LENGTH,
    MAX_ROOM_LENGTH,
    MAX_TIME_LENGTH,
    MIN_DURATION_MINUTES
} from "../constants.js";
import { NextFunction, Request, Response } from "express";
import { Room } from "../models/reservation.js";

/**
 * Middleware: Tarkistaa löytyykö pyynnössä mainittu huone järjestelmästä.
 */
export const validateRoom = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Tarkistetaan, että valittu huone on järjestelmässä
    const room = (req.body.room || req.params.room) as Room;

    if (!room || !db.getRooms().includes(room)) {
        return res.status(400).json({
            error: "ValidationError: Valitsemanne kokoushuone ei ole olemassa"
        });
    }

    return next();
};

/**
 * Middleware: Suorittaa kattavat validoinnit varauksen tiedoille ja liiketoimintasäännöille.
 */
export const validateReservation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { endTime, reservedBy, room, startTime } = req.body;

    // 1. Sisältääkö body oikeanlaista dataa?
    if (
        typeof endTime !== "string" ||
        typeof reservedBy !== "string" ||
        typeof room !== "string" ||
        typeof startTime !== "string"
    ) {
        return res.status(400).json({
            error: "ValidationError: Kaikki tiedot (room, startTime, endTime, reservedBy) on annettava merkkijonoina"
        });
    }

    // 2. Varmistetaan, että data ei sisällä tyhjiä merkkijonoja
    if (
        !endTime.trim() ||
        !reservedBy.trim() ||
        !room.trim() ||
        !startTime.trim()
    ) {
        return res.status(400).json({
            error: "ValidationError: Kaikki tiedot on täytettävä"
        });
    }

    // 3. Tarkistetaan, että merkkijonot eivät ylitä määritettyjä enimmäispituuksia
    if (
        startTime.length > MAX_TIME_LENGTH ||
        endTime.length > MAX_TIME_LENGTH
    ) {
        return res.status(400).json({
            error: `ValidationError: Aikaleimojen pituus ei saa ylittää ${MAX_TIME_LENGTH} merkkiä`
        });
    }

    if (reservedBy.length > MAX_RESERVED_BY_LENGTH) {
        return res.status(400).json({
            error: `ValidationError: Varaajan nimen pituus ei saa ylittää ${MAX_RESERVED_BY_LENGTH} merkkiä`
        });
    }

    if (room.length > MAX_ROOM_LENGTH) {
        return res.status(400).json({
            error: `ValidationError: Huonekentän pituus ei saa ylittää ${MAX_ROOM_LENGTH} merkkiä`
        });
    }

    // 4. Onko käytetty oikeaa aikamuotoa?
    const startDate = parseISO(startTime);
    const endDate = parseISO(endTime);

    if (!startDate || !endDate) {
        return res.status(400).json({
            error: "ValidationError: Virheellinen aikamuoto. Käytä ISO 8601 -standardia"
        });
    }

    // 5. Varmistetaan, että käyvätkö valitut ajat järkeen
    const now = new Date();

    if (startDate.getTime() < now.getTime()) {
        return res.status(400).json({
            error: "ValidationError: Varaus ei voi olla menneisyydessä"
        });
    }

    if (startDate.getTime() >= endDate.getTime()) {
        return res.status(400).json({
            error: "ValidationError: Alkamisajan on oltava ennen loppumisaikaa"
        });
    }

    // 6. Päteekö 15 minuutin intervallisääntö?
    if (!isQuarterHour(startDate) || !isQuarterHour(endDate)) {
        return res.status(400).json({
            error: "ValidationError: Aikojen on oltava 15 minuutin välein (:00, :15, :30, :45)"
        });
    }

    // 7. Tarkistetaan, että varauksen kesto ei ole liian lyhyt tai pitkä (15min - 8h)
    const minutes = minutesBetween(startDate, endDate);

    if (minutes < MIN_DURATION_MINUTES || minutes > MAX_DURATION_MINUTES) {
        return res.status(400).json({
            error: "ValidationError: Varauksen keston täytyy olla vähintään 15 minuuttia, eikä se saa ylittää 8 tuntia"
        });
    }

    // 8. Onko varaus tehty aukioloaikojen puitteissa?
    if (!inOfficeHours(startDate, endDate)) {
        return res.status(400).json({
            error: "ValidationError: Varaukset on tehtävä aukioloaikojen puitteissa (06:00-20:00 UTC)"
        });
    }

    // 9. Varmistetaan, että onko huone vapaa valittuna aikana
    if (!db.isRoomAvailable(room as Room, startDate, endDate)) {
        return res.status(400).json({
            error: "ValidationError: Kokoushuone on jo varattu valittuna aikana"
        });
    }

    return next();
};

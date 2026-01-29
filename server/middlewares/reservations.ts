import { db } from "../database/inMemoryDB.js";
import {
    inOfficeHours,
    isQuarterHour,
    minutesBetween,
    parseISO
} from "../utils/time.js";
import { NextFunction, Request, Response } from "express";
import { Room } from "../models/reservation.js";

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

    const startDate = parseISO(startTime);
    const endDate = parseISO(endTime);

    // 3. Onko käytetty oikeaa aikamuotoa?
    if (!startDate || !endDate) {
        return res.status(400).json({
            error: "ValidationError: Virheellinen aikamuoto. Käytä ISO 8601 -standardia"
        });
    }

    // 4. Varmistetaan, että käyvätkö valitut ajat järkeen
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

    // 5. Päteekö 15 minuutin intervallisääntö?
    if (!isQuarterHour(startDate) || !isQuarterHour(endDate)) {
        return res.status(400).json({
            error: "ValidationError: Aikojen on oltava 15 minuutin välein (:00, :15, :30, :45)"
        });
    }

    // 6. Tarkistetaan, että varauksen kesto ei ole liian lyhyt tai pitkä (15min - 8h)
    const minutes = minutesBetween(startDate, endDate);

    if (minutes < 15 || minutes > 480) {
        return res.status(400).json({
            error: "ValidationError: Varauksen keston täytyy olla vähintään 15 minuuttia, mutta se ei saa kestää yli 8 tuntia"
        });
    }

    // 7. Onko varaus tehty aukioloaikojen puitteissa?
    if (!inOfficeHours(startDate, endDate)) {
        return res.status(400).json({
            error: "ValidationError: Varaukset on tehtävä aukioloaikojen puitteissa (06:00-20:00 UTC)"
        });
    }

    // 8. Varmistetaan, että onko huone vapaa valittuna aikana
    if (!db.isRoomAvailable(room as Room, startDate, endDate)) {
        return res.status(400).json({
            error: "ValidationError: Kokoushuone on jo varattu valittuna aikana"
        });
    }

    return next();
};

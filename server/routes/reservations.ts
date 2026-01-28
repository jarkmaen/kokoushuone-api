import db from "../database/inMemoryDB.js";
import {
    inOfficeHours,
    isQuarterHour,
    minutesBetween,
    parseISO
} from "../utils/time.js";
import { Reservation, Room } from "../models/reservation.js";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post("/", (req, res) => {
    const { room, start, end, name } = req.body as {
        room: string;
        start: string;
        end: string;
        name: string;
    };
    if (!room || !start || !end || !name)
        return res.status(400).json({ error: "room,start,end,name required" });

    if (!db.getRooms().includes(room as Room))
        return res.status(400).json({ error: "invalid room" });

    const s = parseISO(start);
    const e = parseISO(end);
    if (!s || !e)
        return res.status(400).json({ error: "invalid date format, use ISO" });

    const now = new Date();
    if (s.getTime() < now.getTime())
        return res.status(400).json({ error: "start cannot be in the past" });
    if (s.getTime() >= e.getTime())
        return res.status(400).json({ error: "start must be before end" });

    if (!isQuarterHour(s) || !isQuarterHour(e))
        return res
            .status(400)
            .json({ error: "start and end must be on 15-min boundaries" });

    const minutes = minutesBetween(s, e);
    if (minutes < 15)
        return res
            .status(400)
            .json({ error: "minimum duration is 15 minutes" });
    if (minutes > 8 * 60)
        return res.status(400).json({ error: "maximum duration is 8 hours" });

    if (!inOfficeHours(s, e))
        return res.status(400).json({
            error: "reservations allowed only between 06:00 and 20:00 UTC and must be within same day"
        });

    // Overlap check (use room-specific reservations)
    const overlap = db
        .getAllReservations()
        .find(
            (r) =>
                r.room === room &&
                new Date(r.start).getTime() < e.getTime() &&
                new Date(r.end).getTime() > s.getTime()
        );

    if (overlap)
        return res.status(400).json({ error: "overlaps existing reservation" });

    const resv: Reservation = {
        id: uuidv4(),
        room: room as Room,
        start: s.toISOString(),
        end: e.toISOString(),
        name,
        createdAt: new Date().toISOString()
    };
    db.addReservation(resv);
    return res.status(201).json(resv);
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const ok = db.deleteReservation(id);
    if (!ok) return res.status(404).json({ error: "not found" });
    return res.status(204).send();
});

router.get("/rooms/:room", (req, res) => {
    const room = req.params.room as Room;
    if (!db.getRooms().includes(room))
        return res.status(400).json({ error: "invalid room" });
    const list = db.getReservationsByRoom(room);
    return res.json(list);
});

export default router;

import { db } from "../database/inMemoryDB.js";
import { Reservation, Room } from "../models/reservation.js";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { validateReservation } from "../middlewares/reservations.js";

const router = Router();

router.post("/", validateReservation, (req, res) => {
    const { endTime, reservedBy, room, startTime } = req.body;

    const resv: Reservation = {
        id: uuidv4(),
        room: room as Room,
        startTime,
        endTime,
        reservedBy,
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

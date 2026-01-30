import { db } from "../database/inMemoryDB.js";
import { Request, Response } from "express";
import { Reservation, Room } from "../models/reservation.js";
import { v4 as uuidv4 } from "uuid";

export const createReservation = (req: Request, res: Response) => {
    const { endTime, reservedBy, room, startTime } = req.body;

    const reservation: Reservation = {
        id: uuidv4(),
        room,
        startTime,
        endTime,
        reservedBy,
        createdAt: new Date().toISOString()
    };

    db.addReservation(reservation);

    return res.status(201).json(reservation);
};

export const deleteReservation = (req: Request, res: Response) => {
    const id = req.params.id;

    const deleted = db.deleteReservation(id);

    if (deleted == false) {
        return res.status(404).json({ error: "Varausta ei löytynyt" });
    }

    return res.status(204).send();
};

export const getRoomReservations = (req: Request, res: Response) => {
    const room = req.params.room as Room;

    const list = db.getReservationsByRoom(room);

    return res.json(list);
};

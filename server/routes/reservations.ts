import { Router } from "express";
import {
    validateReservation,
    validateRoom
} from "../middlewares/reservations.js";
import {
    createReservation,
    deleteReservation,
    getRoomReservations
} from "../controllers/reservations.js";

const router = Router();

router.post("/", validateRoom, validateReservation, createReservation);
router.delete("/:id", deleteReservation);
router.get("/rooms/:room", validateRoom, getRoomReservations);

export default router;

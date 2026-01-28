import { Reservation, Room } from "../models/reservation.js";

const data: Reservation[] = [];
const ROOMS: Room[] = ["A1", "A2", "B1", "B2"];

export const db = {
    addReservation(reservation: Reservation): void {
        data.push(reservation);
    },

    clear(): void {
        data.length = 0;
    },

    deleteReservation(id: string): boolean {
        const idx = data.findIndex((r) => r.id === id);
        if (idx === -1) return false;
        data.splice(idx, 1);
        return true;
    },

    getAllReservations(): Reservation[] {
        return [...data];
    },

    getReservationsByRoom(room: Room): Reservation[] {
        return data
            .filter((r) => r.room === room)
            .sort(
                (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
            );
    },

    getRooms(): Room[] {
        return [...ROOMS];
    },

    isRoomAvailable(room: Room, start: Date, end: Date): boolean {
        return !data.some(
            (r) =>
                r.room === room &&
                new Date(r.startTime) < end &&
                new Date(r.endTime) > start
        );
    }
};

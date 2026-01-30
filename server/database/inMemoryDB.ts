import { Reservation, Room } from "../models/reservation.js";
import { ROOMS } from "../constants.js";

const data: Reservation[] = [];

/**
 * Yksinkertainen muistinvarainen "tietokanta" varauksille.
 */
export const db = {
    /** Tallentaa uuden varauksen */
    addReservation(reservation: Reservation): void {
        data.push(reservation);
    },

    /** Poistaa varauksen ID:n perusteella. Palauttaa true, jos poisto onnistui */
    deleteReservation(id: string): boolean {
        const idx = data.findIndex((r) => r.id === id);
        if (idx === -1) return false;
        data.splice(idx, 1);
        return true;
    },

    /** Palauttaa kopion kaikista varauksista */
    getAllReservations(): Reservation[] {
        return [...data];
    },

    /** Palauttaa tietyn huoneen varaukset aikajärjestyksessä (alkamisajan mukaan) */
    getReservationsByRoom(room: Room): Reservation[] {
        return data
            .filter((r) => r.room === room)
            .sort(
                (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
            );
    },

    /** Palauttaa listan kaikista käytettävissä olevista huoneista */
    getRooms(): Room[] {
        return [...ROOMS];
    },

    /**
     * Tarkistaa, onko huone vapaa annetulla aikavälillä.
     * Palauttaa true jos huone vapaa (ei päällekkäisiä varauksia)
     */
    isRoomAvailable(room: Room, start: Date, end: Date): boolean {
        return !data.some(
            (r) =>
                r.room === room &&
                new Date(r.startTime) < end &&
                new Date(r.endTime) > start
        );
    },

    /** Tyhjentää kaikki varaukset (tarkoitettu testeille) */
    clear(): void {
        data.length = 0;
    }
};

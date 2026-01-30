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
        const index = data.findIndex((reservation) => reservation.id === id);

        if (index === -1) {
            return false;
        }

        data.splice(index, 1);

        return true;
    },

    /** Palauttaa kopion kaikista varauksista */
    getAllReservations(): Reservation[] {
        return [...data];
    },

    /** Palauttaa tietyn huoneen varaukset aikajärjestyksessä (alkamisajan mukaan) */
    getReservationsByRoom(room: Room): Reservation[] {
        return data
            .filter((reservation) => reservation.room === room)
            .sort((a, b) => {
                const timeA = new Date(a.startTime).getTime();
                const timeB = new Date(b.startTime).getTime();

                return timeA - timeB;
            });
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
        const hasOverlap = data.some((reservation) => {
            if (reservation.room !== room) {
                return false;
            }

            const existingStart = new Date(reservation.startTime);
            const existingEnd = new Date(reservation.endTime);

            const startsBeforeNewEnds = existingStart < end;
            const endsAfterNewStarts = existingEnd > start;

            return startsBeforeNewEnds && endsAfterNewStarts;
        });

        return !hasOverlap;
    },

    /** Tyhjentää kaikki varaukset (tarkoitettu testeille) */
    clear(): void {
        data.length = 0;
    }
};

/**
 * Yksittäisen varauksen tietomalli.
 */
export interface Reservation {
    id: string;
    room: Room;
    /** Alkamisaika ISO 8601 UTC -muodossa */
    startTime: string;
    /** Päättymisaika ISO 8601 UTC -muodossa */
    endTime: string;
    reservedBy: string;
    createdAt: string;
}

/**
 * Käytettävissä olevat kokoushuoneet.
 */
export type Room = "A1" | "A2" | "B1" | "B2";

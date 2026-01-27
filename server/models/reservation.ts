export type Room = "A1" | "A2" | "B1" | "B2";

export interface Reservation {
    id: string;
    room: Room;
    start: string; // ISO UTC
    end: string; // ISO UTC
    name: string;
    createdAt: string;
}

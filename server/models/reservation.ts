export interface Reservation {
    id: string;
    room: Room;
    startTime: string; // ISO UTC
    endTime: string; // ISO UTC
    reservedBy: string;
    createdAt: string;
}

export type Room = "A1" | "A2" | "B1" | "B2";

import type { Room } from "./models/reservation.js";

export const QUARTERS = [0, 15, 30, 45];
export const ROOMS: Room[] = ["A1", "A2", "B1", "B2"];

export const MIN_DURATION_MINUTES = 15;
export const MAX_DURATION_MINUTES = 480; // 8 tuntia * 60 minuuttia = 480 minuuttia

export const OFFICE_OPEN_HOUR = 6; // 06:00 UTC
export const OFFICE_CLOSE_HOUR = 20; // 20:00 UTC

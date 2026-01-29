import { OFFICE_CLOSE_HOUR, OFFICE_OPEN_HOUR, QUARTERS } from "../constants.js";

export function parseISO(dateStr: string): Date | null {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

export function isQuarterHour(d: Date) {
    return (
        QUARTERS.includes(d.getUTCMinutes()) &&
        d.getUTCSeconds() === 0 &&
        d.getUTCMilliseconds() === 0
    );
}

export function minutesBetween(a: Date, b: Date) {
    return Math.round((b.getTime() - a.getTime()) / 60000);
}

export function inOfficeHours(start: Date, end: Date) {
    // Must be same UTC day and between 06:00 and 20:00
    const sDay =
        start.getUTCFullYear() +
        "-" +
        start.getUTCMonth() +
        "-" +
        start.getUTCDate();
    const eDay =
        end.getUTCFullYear() + "-" + end.getUTCMonth() + "-" + end.getUTCDate();
    if (sDay !== eDay) return false;
    const sH = start.getUTCHours();
    const eH = end.getUTCHours();
    // start >=06:00 and end <=20:00 (end may be exactly 20:00)
    return (
        sH >= OFFICE_OPEN_HOUR &&
        (eH < OFFICE_CLOSE_HOUR ||
            (eH === OFFICE_CLOSE_HOUR &&
                end.getUTCMinutes() === 0 &&
                end.getUTCSeconds() === 0))
    );
}

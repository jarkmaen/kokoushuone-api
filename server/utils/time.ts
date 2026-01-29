import { OFFICE_CLOSE_HOUR, OFFICE_OPEN_HOUR, QUARTERS } from "../constants.js";

/**
 * Muuttaa merkkijonon Date olioksi.
 */
export function parseISO(dateStr: string): Date | null {
    // Varmistetaan, että merkkijono päättyy Z kirjaimeen (UTC)
    if (!dateStr.endsWith("Z")) {
        return null;
    }

    const date = new Date(dateStr);

    // Onko päivämäärä loogisesti validi?
    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
}

/**
 * Varmistaa, että annettu aika on tasan varttitunnin kohdalla (00, 15, 30 tai 45 minuuttia).
 */
export function isQuarterHour(date: Date): boolean {
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    const isValidMinute = QUARTERS.includes(minutes);
    const isExactMinute = seconds === 0 && milliseconds === 0;

    return isValidMinute && isExactMinute;
}

/**
 * Laskee kahden ajan välisen erotuksen minuutteina.
 */
export function minutesBetween(start: Date, end: Date): number {
    const msInMinute = 60000;
    const differenceInMs = end.getTime() - start.getTime();

    // Pyöristetään lähimpään minuuttiin liukulukulaskentavirheiden varalta
    return Math.round(differenceInMs / msInMinute);
}

/**
 * Tarkistaa, että varaus tapahtuu saman vuorokauden sisällä
 * ja sijoittuu aukioloaikojen (06:00-20:00 UTC) sisälle.
 */
export function inOfficeHours(start: Date, end: Date): boolean {
    // 1. Alkaako ja päättyykö varaus samana UTC päivänä?
    const isSameDay =
        start.getUTCFullYear() === end.getUTCFullYear() &&
        start.getUTCMonth() === end.getUTCMonth() &&
        start.getUTCDate() === end.getUTCDate();

    if (!isSameDay) {
        return false;
    }

    const startHour = start.getUTCHours();
    const endHour = end.getUTCHours();
    const endMinutes = end.getUTCMinutes();

    // 2. Alkamisajan tarkistus (aikaisintaan 06:00)
    const isAfterOpening = startHour >= OFFICE_OPEN_HOUR;

    // 3. Päättymisajan tarkistus (viimeistään 20:00:00)
    // Hyväksytään jos:
    // - Tunti on alle 20 (esim. 19:45)
    // - TAI tunti on tasan 20 ja minuutit ovat tasan 0 (tasan 20:00)
    const isBeforeClosing =
        endHour < OFFICE_CLOSE_HOUR ||
        (endHour === OFFICE_CLOSE_HOUR && endMinutes === 0);

    return isAfterOpening && isBeforeClosing;
}

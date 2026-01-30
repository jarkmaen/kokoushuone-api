/**
 * Tulostaa virheilmoitukset konsoliin.
 */
export function error(...params: unknown[]): void {
    console.error(...params);
}

/**
 * Tulostaa yleiset infoviestit konsoliin.
 */
export function info(...params: unknown[]): void {
    console.log(...params);
}

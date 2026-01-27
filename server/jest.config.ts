import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset();

const config: Config = {
    ...presetConfig,
    // Hieman Jest kikkailua tässä. Eli jos on ESM käytössä, niin Node.js vaatii, että import poluissa käytetään .js tiedostopäätettä.
    // Jest ei kuitenkaan osaa suoraan yhdistää näitä .js viittauksia vastaaviin .ts tiedostoihin.
    // Joten tämä moduleNameMapper muuttaa import polut Jestille sopiviksi ajon aikana.
    // RegEx:
    // ^(\.{1,2}/.*) = Etsii polun alun (./ tai ../) sekä tiedoston nimen, ja tallentaa ne muuttujaan $1.
    // \.js$         = Kohdistuu tiedoston lopussa olevaan .js päätteeseen.
    // $1            = Korvaa koko polun muuttujalla $1, eli palauttaa saman polun ilman .js päätettä.
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testEnvironment: "node"
};

export default config;

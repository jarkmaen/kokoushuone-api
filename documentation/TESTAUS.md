# TESTAUS

Sovellusta on testattu Jest testeillä. Testit voi ajaa komennolla `npm run test`. Testauskattavuusraportin voi generoida komennolla `npm run test:cov`.

## Yksikkötestaus

Yksikkötestit kattavat kaikki sovelluksen keskeiset toiminnot ja liiketoimintasäännöt:

- **Perustoiminnot:** Varausten luonti, listaus ja poistaminen.
- **Aikarajoitukset:** Aukioloajat, 15 minuutin intervallisääntö ja varauksen kesto (15min - 8h).
- **Päällekkäisyydet:** Samaa huonetta ei voi varata päällekkäin.
- **Validointi:** Virheelliset aikamuodot, puuttuvat tiedot ja liian pitkät merkkijonot.

## Testauskattavuus

Rivikattavuus on 94.16% ja haarautumakattavuus 93.42%.

<img src="images/test-coverage.png">

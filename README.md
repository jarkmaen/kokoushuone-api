# Kokoushuone-API

Käynnistys:

1. Avaa terminaali kansioon `server`
2. Suorita `npm install`
3. Käynnistä kehitystilassa: `npm run dev` (palvelin kuuntelee porttia 3000)

Päätepisteet:

- POST `/reservations` — luo varaus
- DELETE `/reservations/:id` — poistaa varauksen
- GET `/rooms/:room/reservations` — listaa huoneen varaukset

Huom:

- Kaikki ajat UTC (ISO 8601, esim. `2026-01-28T09:00:00Z`)
- Huoneet: `A1`, `A2`, `B1`, `B2`
- Vaatimukset: 15 min portaat, min 15 min, max 8 tuntia, 06:00–20:00 UTC, ei menneisyyteen.

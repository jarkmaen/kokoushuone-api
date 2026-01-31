# Kokoushuone API

Yksinkertainen kokoushuoneiden varausrajapinta. Toteutettu osana rekrytointiprosessia. Rakennettu Node.js:llä, Expressillä ja TypeScriptillä. Testaus tehty Jestillä.

## Dokumentaatio

[ANALYYSI](ANALYYSI.md)

[PROMPTIT](PROMPTIT.md)

[TESTAUS](documentation/TESTAUS.md)

## Oletukset

- Kokoushuoneita on vain neljä: A1, A2, B1 ja B2.
- UTC (ISO 8601) on ainoa aikaformaatti, jota rajapinta osaa lukea (esim. `2026-01-31T12:00:00Z`).
- Varaukset voivat alkaa ja loppua vain 15 minuutin välein (:00, :15, :30, :45). Esimerkiksi jos kello on 12:02, niin seuraava mahdollinen aloitusaika on joko 12:15, 12:30, 12:45, jne...
- Lyhin varausaika minkä voi tehdä on 15 minuuttia ja pisin 8 tuntia.
- Varauksia voi tehdä vain 06:00–20:00 välille (toimiston aukioloajat).
- Jokaisen varauksen on sisällettävä varaajan nimi.
- Varauksen peruminen tapahtuu viittaamalla varauksen ID-tunnukseen.

## API-endpointit

Sovelluksessa on kolme endpointtia:

- Luo varaus: `POST /api/reservations`
- Peru varaus: `DELETE /api/reservations/:id`
- Listaa kokoushuoneen varaukset: `GET /api/reservations/rooms/:room`

### Esimerkkipyyntöjä:

Luo varaus:

```
POST http://localhost:3001/api/reservations
Content-Type: application/json
{
    "room": "A1",
    "startTime": "2026-01-31T12:00:00Z",
    "endTime": "2026-01-31T14:00:00Z",
    "reservedBy": "Matti"
}
```

Peru varaus:

```
DELETE http://localhost:3001/api/reservations/<id>
```

Listaa kokoushuoneen A1 varaukset:

```
GET http://localhost:3001/api/reservations/rooms/A1
```

## Asennus & Käynnistys

Sovelluksen asentaminen vaatii, että sekä [Git](https://git-scm.com/) että [Node.js](https://nodejs.org/) (jonka mukana tulee [npm](https://www.npmjs.com/)) on asennettu tietokoneellesi. Aja seuraavat komennot:

```
# Kloonaa tämä repositorio ja mene sen juurihakemistoon
$ git clone https://github.com/jarkmaen/kokoushuone-api.git
$ cd kokoushuone-api

# Mene server hakemistoon ja asenna riippuvuudet
$ cd server
$ npm install

# Luo .env tiedosto server hakemistoon ja määritä portti:
PORT=3001

# Käynnistä palvelin
$ npm run dev
```

Palvelimen pitäisi olla nyt käynnissä osoitteessa http://localhost:3001.

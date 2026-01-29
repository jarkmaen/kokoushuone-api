import app from "../app.js";
import request from "supertest";
import { db } from "../database/inMemoryDB.js";

beforeEach(() => {
    db.clear();
});

describe("Reservations API", () => {
    const valid = {
        room: "A1",
        startTime: "2030-01-01T12:00:00Z",
        endTime: "2030-01-01T12:30:00Z",
        reservedBy: "Tester"
    };

    describe("POST /api/reservations", () => {
        test("luo uuden varauksen oikeilla tiedoilla", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send(valid);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(db.getAllReservations().length).toBe(1);
        });

        test("estää päällekkäiset varaukset samaan huoneeseen", async () => {
            await request(app).post("/api/reservations").send(valid);

            const res = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T12:15:00Z",
                endTime: "2030-01-01T12:45:00Z",
                reservedBy: "Overlap"
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Kokoushuone on jo varattu valittuna aikana"
            );
        });

        test("ei anna laittaa varauksia menneisyyteen", async () => {
            const res = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2020-01-01T12:00:00Z",
                endTime: "2020-01-01T12:30:00Z",
                reservedBy: "Past"
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Varaus ei voi olla menneisyydessä"
            );
        });

        test("vaatii, että alkamisaika on ennen päättymisaikaa", async () => {
            const res = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T12:00:00Z",
                endTime: "2030-01-01T11:00:00Z",
                reservedBy: "Bad"
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Alkamisajan on oltava ennen loppumisaikaa"
            );
        });

        test("vaatii, että ajat ovat 15 minuutin välein", async () => {
            const res = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T12:10:00Z",
                endTime: "2030-01-01T12:30:00Z",
                reservedBy: "NotQuarter"
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Aikojen on oltava 15 minuutin välein (:00, :15, :30, :45)"
            );
        });

        test("valvoo varauksen enimmäiskestoa", async () => {
            // 9 tunnin varaus
            const tooLong = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T10:00:00Z",
                endTime: "2030-01-01T19:00:00Z",
                reservedBy: "Long"
            });

            expect(tooLong.status).toBe(400);
            expect(tooLong.body.error).toBe(
                "ValidationError: Varauksen keston täytyy olla vähintään 15 minuuttia, eikä se saa ylittää 8 tuntia"
            );
        });

        test("estää varaukset aukioloaikojen ulkopuolella", async () => {
            // Ennen avaamista (klo 05:00)
            const before = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T05:00:00Z",
                endTime: "2030-01-01T06:00:00Z",
                reservedBy: "EarlyBird"
            });

            expect(before.status).toBe(400);
            expect(before.body.error).toBe(
                "ValidationError: Varaukset on tehtävä aukioloaikojen puitteissa (06:00-20:00 UTC)"
            );

            // Sulkemisen jälkeen (klo 20:15)
            const after = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T19:45:00Z",
                endTime: "2030-01-01T20:15:00Z",
                reservedBy: "LateBird"
            });

            expect(after.status).toBe(400);
            expect(after.body.error).toBe(
                "ValidationError: Varaukset on tehtävä aukioloaikojen puitteissa (06:00-20:00 UTC)"
            );
        });

        test("hylkää aikaleimat ilman Z päätettä", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    startTime: "2030-01-01T12:00:00",
                    endTime: "2030-01-01T12:30:00Z"
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Virheellinen aikamuoto. Käytä ISO 8601 -standardia"
            );
        });

        test("estää varaukset, jotka alkavat ja loppuvat eri päivinä", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    startTime: "2030-01-01T23:00:00Z",
                    endTime: "2030-01-02T01:00:00Z",
                    reservedBy: "Overnight"
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Varaukset on tehtävä aukioloaikojen puitteissa (06:00-20:00 UTC)"
            );
        });

        test("sallii täsmälleen 8 tunnin varauksen", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    startTime: "2030-01-01T08:00:00Z",
                    endTime: "2030-01-01T16:00:00Z"
                });

            expect(res.status).toBe(201);
        });

        test("sallii varaukset samaan aikaan eri huoneisiin", async () => {
            // Varataan huone A1
            await request(app).post("/api/reservations").send(valid);

            // Varataan huone B1 samaan aikaan
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    room: "B1"
                });

            expect(res.status).toBe(201);
        });

        test("hylkää varauksen, jos huonetta ei ole olemassa", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    room: "Z99"
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Valitsemanne kokoushuone ei ole olemassa"
            );
        });

        test("hylkää arvot, jotka eivät ole merkkijonoja", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send({
                    ...valid,
                    startTime: 1234
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Kaikki tiedot (room, startTime, endTime, reservedBy) on annettava merkkijonoina"
            );
        });

        test("hylkää tyhjät merkkijonot", async () => {
            const res = await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T12:00:00Z",
                endTime: "2030-01-01T12:30:00Z",
                reservedBy: " "
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(
                "ValidationError: Kaikki tiedot on täytettävä"
            );
        });
    });

    describe("GET /api/reservations", () => {
        test("listaa kaikki tietyn huoneen varaukset", async () => {
            // Luodaan kaksi varausta huoneeseen A1
            await request(app).post("/api/reservations").send(valid);
            await request(app).post("/api/reservations").send({
                room: "A1",
                startTime: "2030-01-01T13:00:00Z",
                endTime: "2030-01-01T14:00:00Z",
                reservedBy: "Tester"
            });

            // Luodaan yksi varaus huoneeseen B1
            await request(app).post("/api/reservations").send({
                room: "B1",
                startTime: "2030-01-01T12:00:00Z",
                endTime: "2030-01-01T12:30:00Z",
                reservedBy: "Tester"
            });

            // Haetaan vain huoneen A1 varaukset
            const res = await request(app).get("/api/reservations/rooms/A1");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });
    });

    describe("DELETE /api/reservations", () => {
        test("poistaa varauksen ID:n perusteella", async () => {
            const res = await request(app)
                .post("/api/reservations")
                .send(valid);
            const id = res.body.id;

            const del = await request(app).delete(`/api/reservations/${id}`);
            expect(del.status).toBe(204);

            const check = await request(app).get("/api/reservations/rooms/A1");
            expect(check.body.length).toBe(0);
        });

        test("palauttaa 404, jos yritetään poistaa olematonta varausta", async () => {
            const res = await request(app).delete("/api/reservations/nonsense");

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("not found");
        });
    });

    describe("Tuntematon reititys", () => {
        test("palauttaa 404, jos kutsutaan osoitetta, jota ei ole olemassa", async () => {
            const res = await request(app).get("/api/nonsense");

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Unknown endpoint");
        });
    });
});

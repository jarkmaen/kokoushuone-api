import request from "supertest";
import app from "../app.js";
import { reservations } from "../store/inMemoryDB.js";

beforeEach(() => {
    reservations.length = 0;
});

describe("Reservations API", () => {
    const valid = {
        room: "A1",
        start: "2030-01-01T09:00:00Z",
        end: "2030-01-01T09:30:00Z",
        name: "Tester"
    };

    test("creates a valid reservation", async () => {
        const res = await request(app).post("/api/reservations").send(valid);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(reservations.length).toBe(1);
    });

    test("prevents overlapping reservations", async () => {
        await request(app).post("/api/reservations").send(valid);
        const res = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T09:15:00Z",
            end: "2030-01-01T09:45:00Z",
            name: "Overlap"
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/overlaps/);
    });

    test("rejects past reservations", async () => {
        const res = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2020-01-01T09:00:00Z",
            end: "2020-01-01T09:15:00Z",
            name: "Past"
        });
        expect(res.status).toBe(400);
    });

    test("start must be before end", async () => {
        const res = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T10:00:00Z",
            end: "2030-01-01T09:00:00Z",
            name: "Bad"
        });
        expect(res.status).toBe(400);
    });

    test("requires 15-min boundaries", async () => {
        const res = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T09:05:00Z",
            end: "2030-01-01T09:20:00Z",
            name: "NotQuarter"
        });
        expect(res.status).toBe(400);
    });

    test("enforces min and max durations", async () => {
        const tooShort = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T09:00:00Z",
            end: "2030-01-01T09:10:00Z",
            name: "Short"
        });
        expect(tooShort.status).toBe(400);

        const tooLong = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T06:00:00Z",
            end: "2030-01-01T15:00:00Z", // 9 hours
            name: "Long"
        });
        expect(tooLong.status).toBe(400);
    });

    test("enforces office hours and same day", async () => {
        const before = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T05:00:00Z",
            end: "2030-01-01T05:15:00Z",
            name: "Before"
        });
        expect(before.status).toBe(400);

        const crosses = await request(app).post("/api/reservations").send({
            room: "A1",
            start: "2030-01-01T19:30:00Z",
            end: "2030-01-02T00:00:00Z",
            name: "CrossDay"
        });
        expect(crosses.status).toBe(400);
    });

    test("lists and deletes reservations", async () => {
        const create = await request(app).post("/api/reservations").send(valid);
        const id = create.body.id;
        const list = await request(app).get("/api/reservations/rooms/A1");
        expect(list.status).toBe(200);
        expect(Array.isArray(list.body)).toBe(true);
        expect(list.body.length).toBe(1);

        const del = await request(app).delete(`/api/reservations/${id}`);
        expect(del.status).toBe(204);

        const after = await request(app).get("/api/reservations/rooms/A1");
        expect(after.body.length).toBe(0);
    });
});

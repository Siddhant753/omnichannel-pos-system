import request from "supertest";
import app from "../app.js";
import { describe } from "node:test";

describe("Store Controller", () => {
    describe("POST /api/create-store", () => {
        it("should create a new store and return 201 status", async () => {
            const res = await request(app).post("/api/store/create-store")
                .send({
                    name: "Test Store 3",
                    type: "store",
                    address: "789 Test Rd",
                    city: "Test City",
                    state: "Test State",
                    country: "Test Country",
                    contactNumber: "555-555-5555",
                    manager: "user1"
                });
            expect(res.status).toBe(201);
        });
    });

    describe("GET /api/store/get-stores", () => {
        it("should return a list of stores and return 200 status", async () => {
            const res = await request(app).get("/api/store/get-stores");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("PATCH /api/store/:storeId/update-store", () => {
        it("should update the store and return 200 status", async () => {
            const res = await request(app).patch("/api/store/store1/update-store")
                .send({
                    name: "Updated Test Store 1",
                    address: "999 Updated Test St"
                });
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /api/store/:storeId/delete-store", () => {
        it("should delete the store and return 200 status", async () => {
            const res = await request(app).delete("/api/store/store2/delete-store");
            expect(res.status).toBe(200);
        });
    });
});
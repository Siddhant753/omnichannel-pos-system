import request from "supertest";
import app from "../app.js";

describe("Auth Controller", () => {
    const user = {
        fname: "John",
        lname: "Doe",
        email: "john.doe@test.com",
        password: "password123",
        role: "admin"
    };

    let token: string;

    describe("POST /api/auth/signup", () => {
        it("should create a new user and return 201 status", async () => {
            const res = await request(app).post("/api/auth/signup")
                .send(user);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("user");
        });
        it("should fail if user already exists", async () => {
            await request(app).post("/api/auth/signup").send(user);
            const res = await request(app).post("/api/auth/signup").send(user);

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login the user and return 200 status", async () => {
            const res = await request(app).post("/api/auth/login")
                .send({
                    email: user.email,
                    password: user.password
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");

            token = res.body.token;
        });
        it("should fail with wrong password", async () => {
            const res = await request(app).post("/api/auth/login")
                .send({
                    email: user.email,
                    password: "wrongpassword"
                });
            expect(res.status).toBe(401);
        });
    });

    describe("POST /api/auth/logout", () => {
        it("should logout the user and return 200 status", async () => {
            const res = await request(app).post("/api/auth/logout")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
        });
        it("should fail without token", async () => {
            const res = await request(app).post("/api/auth/logout");
            expect(res.status).toBe(401);
        });
    });
});
// Mock Auth Middleware
jest.mock("../middleware/auth.middleware", () => {
    const middleware = (req: any, res: any, next: any) => {
        req.user = { id: "userId", role: "admin" };
        next();
    };

    return {
        __esModule: true,
        default: middleware,
        authMiddleware: middleware
    };
});

// Mock Auth Service
jest.mock("../services/auth.service", () => ({
    verifyUserTokenService: jest.fn(),
    findUserByEmailService: jest.fn(),
    createUserService: jest.fn(),
    generateTokenService: jest.fn()
}));

// Mock User Model
jest.mock("../models/user.model", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn()
    }
}));

// Mock User Token Model
jest.mock("../models/userToken.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findOne: jest.fn(),
        deleteOne: jest.fn()
    }
}));

// Mock Bcrypt
jest.mock("bcryptjs", () => ({
    compare: jest.fn().mockResolvedValue(true)
}));

// Mock JWT
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("fakeToken"),
    verify: jest.fn()
}));

import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import UserTokenModel from "../models/userToken.model";
import { verifyUserTokenService, findUserByEmailService, createUserService, generateTokenService } from "../services/auth.service";

describe("Auth Controller", () => {
    const user = {
        email: "test@test.com",
        password: "123456",
        fname: "John",
        lname: "Doe"
    };
    let token: string;

    beforeAll(() => {
        process.env.FRONTEND_URL = "http://localhost:5173";
        process.env.SECRET_ACCESS_TOKEN_KEY = "testsecret";
        process.env.SECRET_REFRESH_TOKEN_KEY = "refreshsecret";
    });

    describe("Signup", () => {
        it("should create user", async () => {
            (findUserByEmailService as jest.Mock).mockResolvedValue(null);
            (createUserService as jest.Mock).mockResolvedValue({
                user: { _id: "userId" },
                rawToken: "token123"
            });

            const res = await request(app).post("/api/auth/signup").send(user);

            expect(res.status).toBe(201);
        });
    });

    describe("Verify Token", () => {
        it("should verify token successfully", async () => {
            (verifyUserTokenService as jest.Mock).mockResolvedValue({
                _id: "userId",
                email: user.email
            });

            const res = await request(app).post("/api/auth/verify-email/testToken");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");
        });

        it("should fail if token invalid", async () => {
            (verifyUserTokenService as jest.Mock).mockResolvedValue(null);

            const res = await request(app).post("/api/auth/verify-email/testToken");

            expect(res.status).toBe(400);
        });
    });

    describe("Login", () => {
        it("should login user", async () => {
            (findUserByEmailService as jest.Mock).mockResolvedValue({
                _id: "userId",
                hashPassword: "hashed",
                isActive: true
            });

            (generateTokenService as jest.Mock).mockResolvedValue({
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            });

            const res = await request(app).post("/api/auth/login").send({
                email: user.email,
                password: user.password
            });

            token = res.body.accessToken || "fakeToken";

            expect(res.status).toBe(200);
        });
    });

    describe("Verify Access Token", () => {
        it("should verify access token", async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ id: "userId" });

            const res = await request(app).get("/api/auth/verify-token").set("authorization", "Bearer validToken");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");
        });

        it("should fail if token missing", async () => {
            const res = await request(app).get("/api/auth/verify-token");

            expect(res.status).toBe(401);
        });
    });
  
    describe("Refresh Token", () => {
        it("should refresh token successfully", async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ id: "userId" });

            (UserTokenModel.findOne as jest.Mock).mockResolvedValue({
                deleteOne: jest.fn().mockResolvedValue({})
            });

            (UserModel.findById as jest.Mock).mockResolvedValue({
                _id: "userId"
            });

            (generateTokenService as jest.Mock).mockResolvedValue({
                accessToken: "newAccessToken",
                refreshToken: "newRefreshToken"
            });

            const res = await request(app).post("/api/auth/refresh-token").set("Cookie", "refreshToken=fakeRefreshToken");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("accessToken");
        });

        it("should fail if refresh token missing", async () => {
            const res = await request(app).post("/api/auth/refresh-token");

            expect(res.status).toBe(401);
        });
    });

    describe("Logout", () => {
        it("should logout user", async () => {
            const res = await request(app).post("/api/auth/logout").set("Cookie", ["refreshToken=fakeRefreshToken"]);

            expect(res.status).toBe(200);
        });
    });
});
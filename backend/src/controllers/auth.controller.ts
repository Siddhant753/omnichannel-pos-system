import type { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createUserService, findUserByEmailService, verifyUserTokenService, generateTokenService } from "../services/auth.service.js";
import UserModel from "../models/user.model.js";
import UserTokenModel from "../models/userToken.model.js";
import redis from "../config/redisConfig.js";

interface JwtPayload {
    id: string;
}

export const signUpController = async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, password, role } = req.body;

        // check if user already exists
        const existinguser = await findUserByEmailService(email);
        if (existinguser) {
            return res.status(400).json({ message: "User already exists" });
        };

        const { user, rawToken } = await createUserService(fname, lname, email, password, role);

        const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

        // Create Send Email file in configs and import it here to send the email
        console.log(`Verification URL: ${verificationURL}`); // temporary log for verification URL.
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyTokenController = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token || Array.isArray(token)) {
            return res.status(400).json({ message: "Please provide a valid token" });
        }
        
        const user = await verifyUserTokenService(token);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Here also add send Email component for sending welcoming email.

        console.log("User verified successfully"); // temporary log in place of sending email.
        return res.status(200).json({ message: "Token verified successfully", user });
    } catch(error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing required fields"});
        }
        const user = await findUserByEmailService(email);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.isActive === false) return res.status(403).json({ message: "Email not Verified" });

        const compare = await bcryptjs.compare(password, user.hashPassword)
        if (!compare) return res.status(400).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = await generateTokenService(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only on HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 30,}
        );

        return res.json({ success: true, message: "Login successful", accessToken, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyAccessTokenController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined");
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        return res.status(200).json({ success: true, message: "Access token valid", user: decoded });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
};

export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }

        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            if (!REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined");
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const storedToken = await UserTokenModel.findOne({ token: hashedToken, tokenType: "RefreshToken" });

        if (!storedToken) { 
            return res.status(401).json({ message: "Invalid or reused refresh token" });
        }

        await storedToken.deleteOne();
        const user = await UserModel.findById(decoded.id);

        if (!user) { 
            return res.status(401).json({ message: "User not found" });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokenService(user);

        const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        await UserTokenModel.create({ userId: user._id, token: newHashedToken, tokenType: "RefreshToken" });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.status(200).json({ success: true, accessToken });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

export const storeRefreshTokenController = async (userId: string, refreshToken: string) => {
    const key = `refreshToken:${userId}`;

    await redis.set(key, refreshToken, 'EX', 60 * 60 * 24 * 30);
}

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not found" });
    }
    
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await UserTokenModel.deleteOne({ token: hashedToken, tokenType: "RefreshToken" });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    return res.json({ success: true, message: "Logged out successfully" });
}
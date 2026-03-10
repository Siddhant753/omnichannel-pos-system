import type { Request, Response } from "express";
import { createUserService, findUserByEmailService, verifyUserTokenService } from "../services/auth.service.js";

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
import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "../models/user.model.js";
import UserTokenModel from "../models/userToken.model.js";

export const findUserByEmailService = async (email: string) => {
    const user = await UserModel.findOne({ email });
    return user;
}

export const createUserService = async (fname: string, lname: string, email: string, password: string, role: "admin" | "manager" | "cashier") => {
    const salt = await bcrypt.genSalt(10);
    // create hash password using bcrypt and salt
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        fname,
        lname,
        email,
        hashPassword,
        role
    }); 

    if (!user) throw new Error("Failed to create user");

    // raw token will be send to user using verificationlink Email
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // hashed token will be stored in database for verification
    await UserTokenModel.create({
        userId: user._id,
        token: hashedToken,
        tokenType: "Verification",
        expiresAt: new Date(Date.now() +  15 * 60 * 1000) //
    });

    return { user, rawToken };
}

export const verifyUserTokenService = async (token: string) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userToken = await UserTokenModel.findOne({ token: hashedToken, tokenType: "Verification" });
    if (!userToken) throw new Error("Invalid or token");

    // if token expired delete userToken and user data.
    if (userToken.expiresAt < new Date()) {
        await UserTokenModel.deleteOne({ _id: userToken._id });
        await UserModel.deleteOne({ _id: userToken.userId });
        throw new Error("Token expired. Please sign up again.");
    }

    const user = await UserModel.findById(userToken.userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.isActive = true;
    await user.save();
    await UserTokenModel.deleteOne({ _id: userToken._id });

    return user;
}
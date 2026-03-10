import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
    fname: string;
    lname: string;
    email: string;
    hashPassword: string;
    isActive: boolean;
    role: "admin" | "manager" | "cashier";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    hashPassword: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "manager", "cashier"], default: "cashier" },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
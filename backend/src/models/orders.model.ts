import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface IOrders extends Document {
    storeId: mongoose.Types.ObjectId;
    cashierId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    discount: number;
    totalAmount: number;
    paymentMethod: "cash" | "card" | "online";
    status: "pending" | "completed" | "cancelled" | "refunded";
    createdAt: Date;
}

const ordersSchema = new Schema<IOrders>({
    storeId: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    cashierId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    customerId: { type: mongoose.Types.ObjectId, ref: "Customer", required: false },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "online"], required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled", "refunded"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const OrdersModel = mongoose.model<IOrders>("Orders", ordersSchema);
export default OrdersModel;
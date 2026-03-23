import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface IOrderItems extends Document {
    orderId: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

const orderItemsSchema = new Schema<IOrderItems>({
    orderId: { type: mongoose.Types.ObjectId, ref: "Orders", required: true },
    variantId: { type: mongoose.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const OrderItemsModel = mongoose.model<IOrderItems>("OrderItems", orderItemsSchema);
export default OrderItemsModel;
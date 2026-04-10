import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IStores extends Document {
    name: string;
    type: 'store' | 'warehouse';
    address: string;
    city: string;
    state: string;
    country: string;
    contactNumber: string;
    manager: mongoose.Types.ObjectId;
    createdAt: Date;
}

const storesSchema = new Schema<IStores>({
    name: { type: String, required: true },
    type: { type: String, enum: ['store', 'warehouse'], required: true, default: 'store' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    contactNumber: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

storesSchema.index({ name: 1, address: 1, city: 1 }, { unique: true });
const StoresModel = mongoose.model<IStores>('Stores', storesSchema);
export default StoresModel;
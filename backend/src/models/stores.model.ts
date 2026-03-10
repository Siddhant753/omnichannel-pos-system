import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IStores extends Document {
    name: string;
    city: string;
    state: string;
    country: string;
    createdAt: Date;
}

const storesSchema = new Schema<IStores>({
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
}, { timestamps: true });

const StoresModel = mongoose.model<IStores>('Stores', storesSchema);
export default StoresModel;
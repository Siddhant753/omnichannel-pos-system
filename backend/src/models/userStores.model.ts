import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IUserStores extends Document {
    userId: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    assignedAt: Date;
}

const userStoresSchema = new Schema<IUserStores>({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Types.ObjectId, ref: 'Store', required: true },
    assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const UserStoresModel = mongoose.model<IUserStores>('UserStores', userStoresSchema);
export default UserStoresModel;
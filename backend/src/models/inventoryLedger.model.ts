import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IInventoryLedger extends Document {
    storeId: mongoose.Types.ObjectId;
    productVariantId: mongoose.Types.ObjectId;
    changeType: 'sale' | 'purchase' | 'refund' | 'adjustment' | 'transfer' | 'purchaseReceipt';
    quantityChange: number;
    oldQuantity: number;
    newQuantity: number;
    referenceId: mongoose.Types.ObjectId;
    referenceType: 'Order' | 'Purchase' | 'Refund' | 'Adjustment' | 'Transfer' | 'PurchaseReceipt'; 
    issuedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const inventoryLedgerSchema = new Schema<IInventoryLedger>({
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    productVariantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
    changeType: { type: String, enum: ['sale', 'purchase', 'refund', 'adjustment', 'transfer', 'purchaseReceipt'], required: true },
    quantityChange: { type: Number, required: true },
    oldQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    referenceId: { type: Schema.Types.ObjectId },
    referenceType: { type: String, enum: ['Order', 'Purchase', 'Refund', 'Adjustment', 'Transfer', 'PurchaseReceipt'], required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const InventoryLedgerModel = mongoose.model<IInventoryLedger>('InventoryLedger', inventoryLedgerSchema);
export default InventoryLedgerModel;
import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IProductVariants extends Document {
    productId: mongoose.Types.ObjectId;
    sku: string;
    price: number;
    barcode: string;
    createdAt: Date;
}

const productVariantsSchema = new Schema<IProductVariants>({
    productId: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    sku: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true },
    barcode: { type: String, required: true, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ProductVariantsModel = mongoose.model<IProductVariants>('ProductVariants', productVariantsSchema);
export default ProductVariantsModel;
import mongoose from 'mongoose';
import { Schema, type Document } from 'mongoose';

export interface IProducts extends Document {
    name: string;
    description: string;
    category: string;
}

const productsSchema = new Schema<IProducts>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

const ProductsModel = mongoose.model<IProducts>('Products', productsSchema);
export default ProductsModel;
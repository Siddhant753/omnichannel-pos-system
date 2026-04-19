import type { Request, Response } from "express";
import ProductsModel from "../models/products.model";
import ProductVariantsModel from "../models/productVariants.model";
import { generateBarcode, generateSKU } from "../services/product.service";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, category, variants } = req.body;

        if (!variants || !Array.isArray(variants) || variants.length === 0) {
            return res.status(400).json({ message: "Variants are required" });
        }

        const product = await ProductsModel.create({ name, description, category });
        
        // Assuming ProductVariantsModel is defined and imported correctly
        const Productvariants = await Promise.all(
            variants.map(async (v: any) => {

                if (!v.attributeValues || typeof v.attributeValues !== "object") {
                    throw new Error("attributeValues is required for each variant");
                }

                const attributeValues = new Map<string, string>(
                    Object.entries(v.attributeValues)
                );

                const sku = generateSKU(name, attributeValues);
                const barcode = generateBarcode();

                return ProductVariantsModel.create({
                    productId: product._id,
                    attributeValues,
                    sku,
                    price: v.price,
                    barcode,
                    createdAt: new Date()
                });
            })
        );

        return res.status(201).json({ product, variants: Productvariants });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductsModel.find().lean();

        const productsWithVariants = await ProductVariantsModel.find({
            productId: { $in: products.map(p => p._id) }
        });

        return res.status(200).json({ products, variants: productsWithVariants });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getProductsCountController = async (req: Request, res: Response) => {
    try {
        const totalProducts = await ProductsModel.countDocuments();
        return res.status(200).json({ totalProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductVariantsCountController = async (req: Request, res: Response) => {
    try {
        const totalVariants = await ProductVariantsModel.countDocuments();
        return res.status(200).json({ totalVariants });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductsByBarcode = async (req: Request, res: Response) => {
    try {
        const barcode = req.params.barcode as string;
        if (!barcode) {
            return res.status(400).json({ message: "Barcode is required" });
        }

        const variant = await ProductVariantsModel.findOne({ barcode }).populate('productId').lean();
        if (!variant) {
            return res.status(404).json({ message: "Product variant not found" });
        }
    
        return res.status(200).json({ variant });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
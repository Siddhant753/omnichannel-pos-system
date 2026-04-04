import type { Request, Response } from "express";
import mongoose from "mongoose";
import InventoryModel from "../models/inventory.model.js";
import InventoryLedgerModel from "../models/inventoryLedger.model.js";
import redis from "../config/redisConfig.js";

export const createInventory = async (req: Request, res: Response) => {
    try {
        const { productVariantId, storeId, stock, reservedStock, reorderLevel } = req.body;

        const existingInventory = await InventoryModel.findOne({ productVariantId, storeId });
        if (existingInventory) {
            return res.status(400).json({ message: "Inventory for this product variant and store already exists" });
        }

        const inventory = InventoryModel.create({ productVariantId, storeId, stock, reservedStock, reorderLevel });
        return res.status(201).json({ message: "Inventory created successfully", inventory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getInventory = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string ;
        
        const inventory = await InventoryModel.find({ storeId }).populate({ path: "productVariantId", populate: { path: "productId" } });
        return res.status(200).json({ inventory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getInventoryCache = async (key: string) => {
    const cached = await redis.get(key);

    if (cached) {
        return JSON.parse(cached);
    }

    return null;
}

export const getInventoryByProductVariant = async (req: Request, res: Response) => {
    try {
        const variantId = req.params.variantId as string;
        const storeId = req.params.storeId as string;

        const inventory = await InventoryModel.findOne({ productVariantId: variantId, storeId }).populate({ path: "productVariantId", populate: { path: "productId" } });
    
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        return res.status(200).json({ inventory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateInventoryStock = async (req: Request, res: Response) => {
    try {
        const variantId = req.params.variantId as string;
        const storeId = req.params.storeId as string;
        const { quantity } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const inventory = await InventoryModel.findOne({ productVariantId: variantId, storeId });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        const oldQuantity = inventory.stock;
        const newQuantity = oldQuantity + quantity;

        inventory.stock = newQuantity;
        await inventory.save();

        await InventoryLedgerModel.create({
            storeId,
            productVariantId: variantId,
            changeType: 'adjustment',
            quantityChange: quantity,
            oldQuantity,
            newQuantity: oldQuantity + quantity,
            referenceId: new mongoose.Types.ObjectId(),
            referenceType: 'Adjustment',
            issuedBy: req.user.id
        })
        return res.status(200).json({ message: "Inventory updated successfully", inventory: { ...inventory.toObject(), stock: oldQuantity + quantity } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// endpoint to reserve stock when order is placed - this will be called by order service when order is created/placed
export const inventoryReservedStock = async (req: Request, res: Response) => {
    try {
        const variantId = req.params.variantId as string;
        const storeId = req.params.storeId as string;
        const { quantity } = req.body;

        const inventory = await InventoryModel.findOne({ productVariantId: variantId, storeId });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        inventory.stock -= quantity;
        inventory.reservedStock += quantity;

        await inventory.save();
        return res.status(200).json({ message: "Stock reserved successfully", inventory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// endpoint to release reserved stock when order is cancelled or expires
export const inventoryReleaseReservedStock = async (req: Request, res: Response) => {
    try {
        const variantId = req.params.variantId as string;
        const storeId = req.params.storeId as string;
        const { quantity } = req.body;

        const inventory = await InventoryModel.findOne({ productVariantId: variantId, storeId });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        inventory.stock += quantity;
        inventory.reservedStock -= quantity;

        await inventory.save();
        return res.status(200).json({ message: "Reserved stock released successfully", inventory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// endpoint to deduct reserved stock when order is confirmed/fulfilled
export const inventoryDeductReservedStock = async (req: Request, res: Response) => {
    try {
        const variantId = req.params.variantId as string;
        const storeId = req.params.storeId as string;
        const orderId = req.params.orderId as string;
        const { quantity } = req.body;
        const userId = req.user?.id as string;

        const inventory = await InventoryModel.findOne({ productVariantId: variantId, storeId });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        const oldQty = inventory.stock;
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }
        inventory.stock -= quantity;
        await inventory.save();

        await InventoryLedgerModel.create({
            storeId,
            productVariantId: variantId,
            changeType: "sale",
            quantityChange: -quantity,
            oldQuantity: oldQty,
            newQuantity: inventory.stock,
            referenceId: orderId,
            referenceType: "Order",
            issuedBy: userId
        });

        res.json({ message: "Stock deducted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// low stock notification alert endpoint
export const lowStockAlert = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;

        const items = await InventoryModel.find({
            storeId,
            $expr: { $lte: ["$stock", "$reorderLevel"] }
        }).populate({ path: "productVariantId", populate: { path: "productId" } });
        
        res.json({ message: "Low stock items retrieved", items });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//get inventory ledger for a store
export const getInventoryLedger = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;

        const logs = await InventoryLedgerModel.find({ storeId }).populate("productVariantId").sort({ timestamp: -1 });

        res.json({ message: "Inventory ledger retrieved", logs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// barcode scanning endpoint - use of kafka service for integration with barcode scanning devices/system


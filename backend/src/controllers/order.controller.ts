import { Request, Response } from "express";
import OrdersModel from "../models/orders.model";
import OrderItemsModel from "../models/orderItems.model";
import InventoryModel from "../models/inventory.model";
import InventoryLedgerModel from "../models/inventoryLedger.model";
import ProductVariantsModel from "../models/productVariants.model";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { storeId, cashierId, customerId, items, paymentMethod, discount = 0, tax = 0 } = req.body;

        if (!items || items.length === 0) {
            throw new Error("Order items are required");
        }
        let subtotal = 0;

        const orderItemsData: any[] = [];
        const inventoryBulkOps: any[] = [];
        const ledgerEntries: any[] = [];

        for (const item of items) {
            const variant = await ProductVariantsModel.findById(item.variantId);
            if (!variant) throw new Error("Variant not found");

            const inventory = await InventoryModel.findOne({
                productVariantId: item.variantId,
                storeId
            });

            if (!inventory || inventory.stock < item.quantity) {
                throw new Error("Insufficient stock");
            }

            const itemSubtotal = variant.price * item.quantity;
            subtotal += itemSubtotal;

            orderItemsData.push({
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: variant.price,
                subtotal: itemSubtotal
            });

            inventoryBulkOps.push({
                updateOne: {
                    filter: {
                        productVariantId: item.variantId,
                        storeId
                    },
                    update: {
                        $inc: { stock: -item.quantity }
                    }
                }
            });

            ledgerEntries.push({
                storeId,
                productVariantId: item.variantId,
                changeType: "sale",
                quantityChange: -item.quantity,
                oldQuantity: inventory.stock,
                newQuantity: inventory.stock - item.quantity,
                referenceType: "Order",
                issuedBy: cashierId
            });
        }

        const totalAmount = subtotal + tax - discount;

        const orderDoc = new OrdersModel({
            storeId,
            cashierId,
            customerId,
            subtotal,
            tax,
            discount,
            totalAmount,
            paymentMethod,
            status: "completed",
            orderNumber: `ORD-${Date.now()}`
        });

        const savedOrder = await orderDoc.save();

        const orderId = savedOrder._id;
        const itemsWithOrder = orderItemsData.map(item => ({
            ...item,
            orderId
        }));

        await OrderItemsModel.insertMany(itemsWithOrder);

        if (inventoryBulkOps.length) {
            await InventoryModel.bulkWrite(inventoryBulkOps);
        }

        if (ledgerEntries.length) {
            await InventoryLedgerModel.insertMany(ledgerEntries);
        }

        return res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ message: err.message || "Internal Server Error" });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await OrdersModel.find()
            .populate("storeId", "name city")
            .populate("cashierId", "fname lname")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await OrdersModel.countDocuments();

        return res.status(200).json({
            total,
            page: Number(page),
            orders
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid order id" });
        }

        const order = await OrdersModel.findById(id).populate("storeId cashierId customerId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await OrderItemsModel.find({ orderId: id }).populate({ path: "variantId", populate: { path: "productId" } });

        return res.status(200).json({ order, items });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await OrdersModel.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid order id" });
        }

        const orderId = id as string;

        const order = await OrdersModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await OrderItemsModel.find({ orderId });

        for (const item of items) {
            const inventory = await InventoryModel.findOne({
                productVariantId: item.variantId,
                storeId: order.storeId
            });

            if (!inventory) continue;

            const oldQty = inventory.stock;
            inventory.stock += item.quantity;
            await inventory.save();

            await InventoryLedgerModel.create({
                storeId: order.storeId,
                productVariantId: item.variantId,
                changeType: "refund",
                quantityChange: item.quantity,
                oldQuantity: oldQty,
                newQuantity: inventory.stock,
                referenceId: order._id,
                referenceType: "Order",
                issuedBy: order.cashierId
            });
        }

        order.status = "cancelled";
        await order.save();

        await OrderItemsModel.deleteMany({ orderId });

        return res.status(200).json({
            message: "Order cancelled and stock restored"
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};
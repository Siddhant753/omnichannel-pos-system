import type { Request, Response } from "express";
import StoresModel from "../models/stores.model";

export const createStoreController = async (req: Request, res: Response) => {
    try {
        const { name, type, address, city, state, country, contactNumber, manager } = req.body;

        const existingStore = await StoresModel.find({ name, address, city })

        if (existingStore.length > 0) {
            return res.status(400).json({ message: "Store with the same name, address and city already exists" });
        }

        const newStore = await StoresModel.create({ name, type, address, city, state, country, contactNumber, manager });
        return res.status(201).json({ message: "Store created successfully", store: newStore });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getStoresController = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const stores = await StoresModel.find().skip(skip).limit(Number(limit)).populate('manager', 'fname lname email');

        const totalStores = await StoresModel.countDocuments();
        return res.status(200).json({ message: "Stores retrieved successfully", stores, pagination: { total: totalStores, page: Number(page), limit: Number(limit) } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getStoresCountController = async (req: Request, res: Response) => {
    try {
        const totalStores = await StoresModel.countDocuments();
        return res.status(200).json({ totalStores });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateStoreController = async (req: Request, res: Response) => {
    try {
        const { storeId } = req.params;
        const { name, type, address, city, state, country, contactNumber, manager } = req.body;

        const updatedStore = await StoresModel.findByIdAndUpdate(storeId, { name, type, address, city, state, country, contactNumber, manager }, { new: true });

        if (!updatedStore) {
            return res.status(404).json({ message: "Store not found" });
        }

        return res.status(200).json({ message: "Store updated successfully", store: updatedStore });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteStoreController = async (req: Request, res: Response) => {
    try {
        const { storeId } = req.params;

        const deletedStore = await StoresModel.findByIdAndDelete(storeId);
        if (!deletedStore) {
            return res.status(404).json({ message: "Store not found" });
        }
        return res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
import {
    createInventory,
    getInventory,
    getInventoryByProductVariant,
    updateInventoryStock,
    inventoryReservedStock,
    inventoryReleaseReservedStock,
    inventoryDeductReservedStock,
    lowStockAlert,
    getInventoryLedger,
    barcodeScan
} from "../controllers/inventory.controller";
import { sendBarcodeEvent } from "../services/kafka/barcode.producer";

import InventoryModel from "../models/inventory.model";
import InventoryLedgerModel from "../models/inventoryLedger.model";

jest.mock("../models/inventory.model");
jest.mock("../models/inventoryLedger.model");

jest.mock("../services/kafka/barcode.producer", () => ({
    __esModule: true,
    sendBarcodeEvent: jest.fn(),
}));

describe("Inventory Controller", () => {

    describe("CreateInventory", () => {
        it("should create a new inventory item", async () => {
            const req = {
                body: {
                    productVariantId: "v1",
                    storeId: "s1",
                    stock: 10,
                    reservedStock: 0,
                    reorderLevel: 5
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (InventoryModel.findOne as jest.Mock).mockResolvedValue(null);
            (InventoryModel.create as jest.Mock).mockResolvedValue({});

            await createInventory(req, res);

            expect(InventoryModel.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("GetInventory", () => {
        it("should return inventory items", async () => {
            const req = { params: { storeId: "s1" } } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (InventoryModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue([{ id: "1" }])
            });

            await getInventory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
        it("should return 404 if inventory not found", async () => {
            (InventoryModel.findOne as jest.Mock).mockResolvedValue(null);
        });
    });

    describe("GetInventoryByProductVariant", () => {
        it("should return inventory item by product variant", async () => {
            const req = {
                params: { variantId: "v1", storeId: "s1" }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (InventoryModel.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue({ id: "1" })
            });

            await getInventoryByProductVariant(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("updateInventoryStock", () => {
        it("should update inventory stock", async () => {
            const req = {
                params: { variantId: "v1", storeId: "s1" },
                body: { quantity: 5 },
                user: { id: "user1" }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockInventory = {
                stock: 10,
                save: jest.fn(),
                toObject: jest.fn().mockReturnValue({})
            };

            (InventoryModel.findOne as jest.Mock).mockResolvedValue(mockInventory);
            (InventoryLedgerModel.create as jest.Mock).mockResolvedValue({});

            await updateInventoryStock(req, res);

            expect(mockInventory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("inventoryReservedStock", () => {
        it("should reserve stock", async () => {
            const req = {
                params: { variantId: "v1", storeId: "s1" },
                body: { quantity: 2 }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockInventory = {
                stock: 10,
                reservedStock: 0,
                save: jest.fn()
            };

            (InventoryModel.findOne as jest.Mock).mockResolvedValue(mockInventory);

            await inventoryReservedStock(req, res);

            expect(mockInventory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("inventoryReleaseReservedStock", () => {
        it("should release reserved stock", async () => {
            const req = {
                params: { variantId: "v1", storeId: "s1" },
                body: { quantity: 2 }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockInventory = {
                stock: 5,
                reservedStock: 5,
                save: jest.fn()
            };

            (InventoryModel.findOne as jest.Mock).mockResolvedValue(mockInventory);

            await inventoryReleaseReservedStock(req, res);

            expect(mockInventory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("inventoryDeductReservedStock", () => {
        it("should deduct reserved stock", async () => {
            const req = {
                params: { variantId: "v1", storeId: "s1", orderId: "o1" },
                body: { quantity: 2 },
                user: { id: "user1" }
            } as any;

            const res = {
                json: jest.fn()
            } as any;

            const mockInventory = {
                stock: 10,
                save: jest.fn()
            };

            (InventoryModel.findOne as jest.Mock).mockResolvedValue(mockInventory);
            (InventoryLedgerModel.create as jest.Mock).mockResolvedValue({});

            await inventoryDeductReservedStock(req, res);

            expect(mockInventory.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "Stock deducted" });
        });
    });

    describe("lowStockAlert", () => {
        it("should send low stock alert", async () => {
            const req = { params: { storeId: "s1" } } as any;

            const res = {
                json: jest.fn()
            } as any;

            (InventoryModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue([{ id: "1" }])
            });

            await lowStockAlert(req, res);

            expect(res.json).toHaveBeenCalled();
        });
    });

    describe("getInventoryLedger", () => {
        it("should return inventory ledger", async () => {
            const req = { params: { storeId: "s1" } } as any;

            const res = {
                json: jest.fn()
            } as any;

            (InventoryLedgerModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue([{ id: "1" }])
                })
            });

            await getInventoryLedger(req, res);

            expect(res.json).toHaveBeenCalled();
        });
    });

    describe("barcodeScan", () => {
        it("should scan barcode", async () => {
            const req = {
                body: { barcode: "123", storeId: "s1" }
            } as any;

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            } as any;

            (sendBarcodeEvent as jest.Mock).mockResolvedValue({});

            await barcodeScan(req, res);

            expect(sendBarcodeEvent).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "Barcode event sent" });
        });
    });
});
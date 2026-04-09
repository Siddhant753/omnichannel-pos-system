import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from "../controllers/order.controller";

import OrdersModel from "../models/orders.model";
import OrderItemsModel from "../models/orderItems.model";
import InventoryModel from "../models/inventory.model";
import InventoryLedgerModel from "../models/inventoryLedger.model";
import ProductVariantsModel from "../models/productVariants.model";

jest.mock("../models/orders.model");
jest.mock("../models/orderItems.model");
jest.mock("../models/inventory.model");
jest.mock("../models/inventoryLedger.model");
jest.mock("../models/productVariants.model");

describe("Order Controller", () => {

    describe("createOrder", () => {
        it("should create order successfully", async () => {
            const req = {
                body: {
                    storeId: "store1",
                    cashierId: "cashier1",
                    items: [{ variantId: "v1", quantity: 2 }],
                    paymentMethod: "cash",
                    tax: 10,
                    discount: 5
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (ProductVariantsModel.findById as jest.Mock).mockResolvedValue({
                price: 100
            });

            (InventoryModel.findOne as jest.Mock).mockResolvedValue({
                stock: 50
            });

            (OrdersModel.prototype.save as jest.Mock).mockResolvedValue({
                _id: "order1"
            });

            (OrderItemsModel.insertMany as jest.Mock).mockResolvedValue([]);

            (InventoryModel.bulkWrite as jest.Mock).mockResolvedValue({});
            (InventoryLedgerModel.insertMany as jest.Mock).mockResolvedValue({});

            await createOrder(req, res);

            expect(ProductVariantsModel.findById).toHaveBeenCalled();
            expect(OrdersModel.prototype.save).toHaveBeenCalled();
            expect(OrderItemsModel.insertMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("should fail if stock insufficient", async () => {
            const req = {
                body: {
                    storeId: "store1",
                    cashierId: "cashier1",
                    items: [{ variantId: "v1", quantity: 100 }]
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (ProductVariantsModel.findById as jest.Mock).mockResolvedValue({
                price: 100
            });

            (InventoryModel.findOne as jest.Mock).mockResolvedValue({
                stock: 10
            });

            await createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe("getOrders", () => {
        it("should return orders", async () => {
            const req = { query: {} } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (OrdersModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        sort: jest.fn().mockReturnValue({
                            skip: jest.fn().mockReturnValue({
                                limit: jest.fn().mockResolvedValue([{ id: "1" }])
                            })
                        })
                    })
                })
            });

            (OrdersModel.countDocuments as jest.Mock).mockResolvedValue(1);

            await getOrders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("getOrderById", () => {
        it("should return order with items", async () => {
            const req = { params: { id: "order1" } } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (OrdersModel.findById as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue({ _id: "order1" })
            });

            (OrderItemsModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue([{ id: "item1" }])
            });

            await getOrderById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("updateOrderStatus", () => {
        it("should update order status", async () => {
            const req = {
                params: { id: "order1" },
                body: { status: "completed" }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (OrdersModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
                _id: "order1"
            });

            await updateOrderStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("cancelOrder", () => {
        it("should cancel order and restore stock", async () => {
            const req = { params: { id: "order1" } } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            (OrdersModel.findById as jest.Mock).mockResolvedValue({
                _id: "order1",
                storeId: "store1",
                cashierId: "cashier1",
                save: jest.fn()
            });

            (OrderItemsModel.find as jest.Mock).mockResolvedValue([
                { variantId: "v1", quantity: 2 }
            ]);

            (InventoryModel.findOne as jest.Mock).mockResolvedValue({
                stock: 10,
                save: jest.fn()
            });

            (InventoryLedgerModel.create as jest.Mock).mockResolvedValue({});

            await cancelOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
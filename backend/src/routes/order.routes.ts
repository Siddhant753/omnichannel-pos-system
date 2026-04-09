import { Router } from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/create-order", createOrder);
orderRouter.get("/get-orders", getOrders);
orderRouter.get("/order/:id", getOrderById);
orderRouter.patch("/order/:id/status", updateOrderStatus);
orderRouter.patch("/order/:id/cancel", cancelOrder);

export default orderRouter;
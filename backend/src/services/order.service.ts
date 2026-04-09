import OrderItemsModel from "../models/orderItems.model";
import OrdersModel from "../models/orders.model";
import { inventoryReserveStock } from "./inventory.service";

export const createOrderService = async (orderData: any) => {
    try {
        await inventoryReserveStock(orderData.items);
        const order = await OrdersModel.create({
            ...orderData,
            createdAt: new Date(),
        });

        await OrderItemsModel.insertMany(
            orderData.items.map((item: any) => ({
                ...item,
                orderId: order._id
            }))
        );

        return order;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
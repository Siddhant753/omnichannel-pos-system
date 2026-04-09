import { uploadToS3 } from "../services/s3.service";
import OrdersModel from "../models/orders.model";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const createRazorpayOrder = async (amount: number) => {
    return razorpay.orders.create({ amount: amount * 100, currency: 'INR' });
};

export const uploadInvoice = async (data: { orderId: string; storeId: string }) => {
    console.log("Generating invoice for:", data.orderId);
    const order = await OrdersModel.findById(data.orderId);

    if (!order) {
        console.log("Order not found");
        return;
    }
    const pdfBuffer = Buffer.from(`Invoice for order ${order._id}`);
    const fileName = `invoices/${order._id}.pdf` as string;
    const url = await uploadToS3(fileName);

    await OrdersModel.findOneAndUpdate({ _id: data.orderId }, { invoiceUrl: url });
};

export const processCardPayment = async (data: { orderId: string; amount: number; cardToken: string }) => {
    console.log("Processing card payment");

    // Call Payment Gateway and get Payment Result
    // Save Payment and Payment Logs

    await OrdersModel.findOneAndUpdate({ _id: data.orderId }, { amount: data.amount, paymentMethod: "card", status: "completed" });
    // await PaymentLogsModel.create(data); for payment logs table creation
};
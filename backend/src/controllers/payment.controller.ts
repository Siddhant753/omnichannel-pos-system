import type { Request, Response } from "express";
import crypto from "crypto";
import { createRazorpayOrder } from "../services/payment.service";
import { sendInvoiceEvent } from "../services/kafka/invoice.producer";
import { sendPaymentEvent } from "../services/kafka/payment.producer";

export const createOrderPayment = async (req: Request, res: Response) => {
    const order = await createRazorpayOrder(req.body.amount)
    res.json(order);
}

// export const verifyPayment = async (req: Request, res: Response) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string).update(body).digest('hex');

//     if (expected !== razorpay_signature) {
//         return res.status(400).json({ message: 'Invalid signature' });
//     }

//     await sendPaymentEvent({
//         orderId: razorpay_order_id,
//         paymentId: razorpay_payment_id,
//         status: 'PAID'
//     });
//     res.json({ success: true });
// }
export const paymentInitiate = async (req: Request, res: Response) => {
    try {
        const { orderId, amount } = req.body;
        
        if (!orderId || !amount) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        await sendPaymentEvent({
            orderId,
            amount,
            paymentMethod: "card",
            status: "pending"
        });

        res.json({ message: "Payment initiated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const invoiceGenerate = async (req: Request, res: Response) => {
    try {
        const { orderId, storeId } = req.body;

        if (!orderId || !storeId) {
            return res.status(400).json({ message: "orderId and storeId required" });
        }

        await sendInvoiceEvent({ orderId, storeId });
        res.json({ message: "Invoice generation queued" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
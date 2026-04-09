import { producer } from "../../config/kafka";

export const sendPaymentEvent = async (data: { orderId: string, amount: number, paymentMethod: string, status: string }) => {
    await producer.connect();
    await producer.send({
        topic: 'payments.initiate',
        messages: [{ key: data.orderId, value: JSON.stringify(data) }]
    });
};
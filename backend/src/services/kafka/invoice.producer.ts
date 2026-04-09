import { producer } from "../../config/kafka";

export const sendInvoiceEvent = async (data: { orderId: string, storeId: string }) => {
    await producer.connect();
    await producer.send({
        topic: 'invoice.generate',
        messages: [{ key: data.orderId, value: JSON.stringify(data) }]
    });
};
import { consumer } from "../config/kafka";
import { uploadInvoice } from "../services/payment.service";

export const startInvoiceConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: "invoice.generate",
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (!message.value)
                return;

                const data = JSON.parse(message.value.toString());
                console.log("Invoice event received");

                await uploadInvoice(data);
            } catch (err) {
                console.error("Invoice consumer error:", err);
            }
        },
    });
};
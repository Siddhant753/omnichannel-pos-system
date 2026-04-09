import { consumer } from "../config/kafka";
import { processCardPayment } from "../services/payment.service";

export const startPaymentConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: "payment.initiate",
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
               if (!message.value) return;

                const data = JSON.parse(message.value.toString());

                console.log("Payment event received");

                await processCardPayment(data);
            } catch (err) {
                console.error("Payment consumer error:", err);
            }
        },
    });
};
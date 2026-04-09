import { consumer } from "../config/kafka";
import { processInventory } from "../services/inventory.service";

export const startInventoryConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: "barcode.scan",
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (!message.value)
                return;

                const data = JSON.parse(message.value.toString());
                const { barcode } = data;

                console.log("Barcode received:", barcode);
                await processInventory(barcode);
            } catch (err) {
                console.error("Consumer error:", err);
            }
        },
    });
};
import { producer } from "../../config/kafka";

export const sendBarcodeEvent = async (data: { barcode: string }) => {
    await producer.connect();
    await producer.send({
        topic: 'barcode.scan',
        messages: [{ key: data.barcode, value: JSON.stringify(data) }]
    });
};
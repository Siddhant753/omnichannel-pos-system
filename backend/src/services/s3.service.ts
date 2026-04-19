import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws";

const s3 = s3Client;

export const uploadToS3 = async (fileName: string, fileBuffer: Buffer) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: "application/pdf",
    });

    await s3.send(command);
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/invoices/${Date.now()}.pdf`;
};
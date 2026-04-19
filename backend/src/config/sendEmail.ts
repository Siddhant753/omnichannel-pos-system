import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
    sendTo: string | string[];
    subject: string;
    html: string;
};

const sendEmail = async ({ sendTo, subject, html }: SendEmailParams) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Omnichannel POS-System <onboarding@resend.dev>",
            to: sendTo,
            subject,
            html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Email Send Error:", error);
        return null;
    }
};

export default sendEmail;
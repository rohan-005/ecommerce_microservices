import nodemailer from "nodemailer";
import { env } from "./env";

import { Logger } from "../utils/logger";


export const mailTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});



export async function verifyMailConnection(): Promise<void> {
    try {
        await mailTransporter.verify();
        Logger.success("SMTP server connected.");
    } catch (error) {
        Logger.error("SMTP verification failed:", error);
        process.exit(1);
    }
}
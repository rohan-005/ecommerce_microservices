import { mailTransporter } from "../config/mail";
import { env } from "../config/env";
import { otpTemplate } from "../templates/otp.template";
import { Logger } from "../utils/logger";

export class EmailService {

    async sendVerificationEmail(
        email: string,
        name: string,
        otp: string
    ): Promise<void> {

        await mailTransporter.sendMail({

            from: env.EMAIL_FROM,

            to: email,

            subject: "Verify Your Email",

            html: otpTemplate(name, otp)

        });

        Logger.success(`Verification email sent to ${email}`);
    }

}
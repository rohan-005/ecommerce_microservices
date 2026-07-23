import { mailTransporter } from "../config/mail";
import { env } from "../config/env";
import { otpTemplate } from "../templates/otp.template";
import { Logger } from "../utils/logger";
import { passwordResetTemplate } from "../templates/password-reset.template";

export class EmailService {
  async sendVerificationEmail(
    email: string,
    name: string,
    otp: string,
  ): Promise<void> {
    await mailTransporter.sendMail({
      from: env.EMAIL_FROM,

      to: email,

      subject: "Verify Your Email",

      html: otpTemplate(name, otp),
    });

    Logger.success(`Verification email sent to ${email}`);
  }

  async sendPasswordResetEmail(email: string, otp: string) {
    return mailTransporter.sendMail({
      to: email,

      subject: "Reset your password",

      html: passwordResetTemplate(otp),
    });
  }

}

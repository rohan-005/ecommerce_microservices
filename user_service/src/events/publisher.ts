import { redisClient } from "../config/redis";

const EMAIL_STREAM = "email-stream";

export enum EmailEventType {
  SEND_VERIFICATION_EMAIL = "SEND_VERIFICATION_EMAIL",
  SEND_PASSWORD_RESET_EMAIL = "SEND_PASSWORD_RESET_EMAIL",
}

class EventPublisher {
  async publishVerificationEmail(
    email: string,
    name: string,
    otp: string
  ): Promise<void> {
    const id = await redisClient.xAdd(
      EMAIL_STREAM,
      "*",
      {
        data: JSON.stringify({
          type: EmailEventType.SEND_VERIFICATION_EMAIL,
          email,
          name,
          otp,
        }),
      }
    );

    console.log(`Verification email event published. Stream ID: ${id}`);
  }

  async publishPasswordResetEmail(
    email: string,
    name: string,
    otp: string
  ): Promise<void> {
    const id = await redisClient.xAdd(
      EMAIL_STREAM,
      "*",
      {
        data: JSON.stringify({
          type: EmailEventType.SEND_PASSWORD_RESET_EMAIL,
          email,
          name,
          otp,
        }),
      }
    );

    console.log(`Password reset event published. Stream ID: ${id}`);
  }
}

export const eventPublisher = new EventPublisher();
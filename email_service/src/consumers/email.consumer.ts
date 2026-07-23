import { redisClient } from "../config/redis";
import { EmailService } from "../services/email.service";
import { EmailEvent, EmailEventType } from "../types/email-event.interface";
import { Logger } from "../utils/logger";

const STREAM = "email-stream";
const GROUP = "email-group";
const CONSUMER = "email-consumer-1";

const emailService = new EmailService();

export async function createConsumerGroup() {
  try {
    await redisClient.xGroupCreate(STREAM, GROUP, "0", {
      MKSTREAM: true,
    });

    Logger.success("Consumer group created.");
  } catch (error: any) {
    if (error?.message?.includes("BUSYGROUP")) {
      Logger.info("Consumer group already exists.");

      return;
    }

    throw error;
  }
}

export async function startConsumer() {
  while (true) {
    try {
      const response = await redisClient.xReadGroup(
        GROUP,
        CONSUMER,
        [
          {
            key: STREAM,
            id: ">",
          },
        ],
        {
          COUNT: 1,
          BLOCK: 0,
        },
      );

      if (!response) continue;

      for (const stream of response) {
        for (const message of stream.messages) {
          const event: EmailEvent = JSON.parse(message.message.data);

          switch (event.type) {
            case "EMAIL_VERIFICATION":
              await emailService.sendVerificationEmail(
                event.email,
                event.name!, // <-- pass name
                event.otp,
              );
              break;

            case "PASSWORD_RESET":
              await emailService.sendPasswordResetEmail(event.email, event.otp);
              break;

            default:
              console.log("Unknown email event");
          }

          await redisClient.xAck(STREAM, GROUP, message.id);
        }
      }
    } catch (error) {
      Logger.error("Consumer Error", error);
    }
  }
}

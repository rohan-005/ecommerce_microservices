import { redisClient } from "../config/redis";

export class EventPublisher {
  async publish(channel: string, payload: object) {
    await redisClient.publish(
      channel,
      JSON.stringify(payload)
    );
  }
}

export const publisher = new EventPublisher();
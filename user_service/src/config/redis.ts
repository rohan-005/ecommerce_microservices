import { createClient } from "redis";
import { env } from "./env";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis connected successfully.");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
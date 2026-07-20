import { createClient } from "redis";
import { env } from "./env";
import { Logger } from "../utils/logger";

export const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on("connect", () => {
    Logger.info("Connecting to Redis...");
});

redisClient.on("ready", () => {
    Logger.success("Redis connected successfully.");
});

redisClient.on("error", (err) => {
    Logger.error("Redis connection error:", err);
});

redisClient.on("reconnecting", () => {
    Logger.warn("Reconnecting to Redis...");
});

export async function connectRedis(): Promise<void> {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}
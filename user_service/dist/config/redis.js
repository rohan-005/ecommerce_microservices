"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const env_1 = require("./env");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
exports.redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});
exports.redisClient.on("ready", () => {
    console.log("Redis connected successfully.");
});
exports.redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});
exports.redisClient.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});
async function connectRedis() {
    if (!exports.redisClient.isOpen) {
        await exports.redisClient.connect();
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publisher = exports.EventPublisher = void 0;
const redis_1 = require("../config/redis");
class EventPublisher {
    async publish(channel, payload) {
        await redis_1.redisClient.publish(channel, JSON.stringify(payload));
    }
}
exports.EventPublisher = EventPublisher;
exports.publisher = new EventPublisher();

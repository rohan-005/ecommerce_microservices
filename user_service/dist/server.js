"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, redis_1.connectRedis)();
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`User Service running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
startServer();

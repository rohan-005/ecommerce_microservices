"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
dotenv_1.default.config();
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({
        default: "development",
        choices: ["development", "production", "test"],
    }),
    PORT: (0, envalid_1.port)({
        default: 5001,
    }),
    MONGO_URI: (0, envalid_1.str)(),
    JWT_ACCESS_SECRET: (0, envalid_1.str)(),
    JWT_REFRESH_SECRET: (0, envalid_1.str)(),
    REDIS_URL: (0, envalid_1.str)(),
    JWT_ACCESS_EXPIRES: (0, envalid_1.str)(),
    JWT_REFRESH_EXPIRES: (0, envalid_1.str)(),
});

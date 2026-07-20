"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100),
    email: zod_1.z
        .email("Invalid email address")
        .transform((email) => email.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[a-z]/, "Must contain one lowercase letter")
        .regex(/[0-9]/, "Must contain one number")
        .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z
        .string()
        .length(6),
});

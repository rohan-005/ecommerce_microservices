"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const ApiError_1 = require("../utils/ApiError");
const user_repository_1 = require("../repositories/user.repository");
const verification_repository_1 = require("../repositories/verification.repository");
const otp_1 = require("../utils/otp");
const publisher_1 = require("../events/publisher");
class AuthService {
    async register(data) {
        // Check if email already exists
        const existingUser = await user_repository_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ApiError_1.ApiError(409, "Email already registered");
        }
        // Create user
        const user = await user_repository_1.userRepository.create({
            name: data.name,
            email: data.email,
            password: data.password,
        });
        // Generate OTP
        const otp = (0, otp_1.generateOTP)();
        // OTP expires after 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        // Store OTP
        await verification_repository_1.verificationRepository.replaceToken(user._id.toString(), otp, expiresAt);
        // Publish event for Email Service
        await publisher_1.publisher.publish("user.verification.requested", {
            userId: user._id,
            name: user.name,
            email: user.email,
            otp,
        });
        return {
            success: true,
            message: "Registration successful. Please verify your email.",
        };
    }
}
exports.authService = new AuthService();

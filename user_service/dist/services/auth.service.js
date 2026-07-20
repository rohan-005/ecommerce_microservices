"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const ApiError_1 = require("../utils/ApiError");
const user_repository_1 = require("../repositories/user.repository");
const pending_repository_1 = require("../repositories/pending.repository");
const otp_1 = require("../utils/otp");
const publisher_1 = require("../events/publisher");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const PendingRegistration_1 = __importDefault(require("../models/PendingRegistration"));
class AuthService {
    async register(data) {
        const existingUser = await user_repository_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ApiError_1.ApiError(409, "Email already registered");
        }
        const otp = (0, otp_1.generateOTP)();
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await pending_repository_1.pendingRepository.replace({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            otp,
            expiresAt,
        });
        await publisher_1.eventPublisher.publishVerificationEmail(data.email, data.name, otp);
        return {
            success: true,
            message: "Verification OTP sent successfully.",
        };
    }
    async replace(data) {
        await PendingRegistration_1.default.findOneAndDelete({
            email: data.email,
        });
        return PendingRegistration_1.default.create(data);
    }
    async verifyEmail(data) {
        const pending = await pending_repository_1.pendingRepository.findByEmail(data.email);
        if (!pending) {
            throw new ApiError_1.ApiError(404, "Verification request not found.");
        }
        const otpMatched = await pending.compareOTP(data.otp);
        if (!otpMatched) {
            throw new ApiError_1.ApiError(400, "Invalid OTP.");
        }
        const user = await user_repository_1.userRepository.create({
            name: pending.name,
            email: pending.email,
            password: pending.password,
            isVerified: true,
        });
        await pending_repository_1.pendingRepository.deleteByEmail(pending.email);
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            role: user.role,
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
}
exports.authService = new AuthService();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../utils/ApiError");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const otp_1 = require("../utils/otp");
const user_repository_1 = require("../repositories/user.repository");
const pending_repository_1 = require("../repositories/pending.repository");
const publisher_1 = require("../events/publisher");
const session_service_1 = require("./session.service");
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
            email: data.email.toLowerCase(),
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
    async verifyEmail(data, device, ip, userAgent) {
        const pending = await pending_repository_1.pendingRepository.findByEmail(data.email);
        if (!pending) {
            throw new ApiError_1.ApiError(404, "Verification request not found.");
        }
        const otpMatched = await pending.compareOTP(data.otp);
        if (!otpMatched) {
            throw new ApiError_1.ApiError(400, "Invalid OTP.");
        }
        if (pending.expiresAt.getTime() < Date.now()) {
            await pending_repository_1.pendingRepository.deleteByEmail(data.email);
            throw new ApiError_1.ApiError(400, "OTP expired.");
        }
        const user = await user_repository_1.userRepository.create({
            name: pending.name,
            email: pending.email,
            password: pending.password,
            isVerified: true,
        });
        await pending_repository_1.pendingRepository.deleteByEmail(pending.email);
        const sessionId = new mongoose_1.Types.ObjectId().toHexString();
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            sessionId,
        });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session_service_1.sessionService.createSession(sessionId, user.id, refreshToken, expiresAt, device, ip, userAgent);
        return {
            success: true,
            message: "Email verified successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    async login(email, password, device, ip, userAgent) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid email or password");
        }
        const passwordMatched = await (0, password_1.comparePassword)(password, user.password);
        if (!passwordMatched) {
            throw new ApiError_1.ApiError(401, "Invalid email or password");
        }
        if (!user.isVerified) {
            throw new ApiError_1.ApiError(403, "Email is not verified");
        }
        const sessionId = new mongoose_1.Types.ObjectId().toHexString();
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            sessionId,
        });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session_service_1.sessionService.createSession(sessionId, user.id, refreshToken, expiresAt, device, ip, userAgent);
        return {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
}
exports.authService = new AuthService();

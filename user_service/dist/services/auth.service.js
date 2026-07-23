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
const password_reset_repository_1 = require("../repositories/password-reset.repository");
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
    async refreshToken(refreshToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const session = await session_service_1.sessionService.validateSession(payload.sessionId);
        if (!session) {
            throw new ApiError_1.ApiError(401, "Invalid or expired session");
        }
        const isValid = await session_service_1.sessionService.verifyRefreshToken(payload.sessionId, refreshToken);
        if (!isValid) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const user = await user_repository_1.userRepository.findById(payload.userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            role: user.role,
        });
        const newRefreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            sessionId: payload.sessionId,
        });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session_service_1.sessionService.rotateRefreshToken(payload.sessionId, newRefreshToken, expiresAt);
        return {
            success: true,
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const session = await session_service_1.sessionService.validateSession(payload.sessionId);
        if (!session) {
            throw new ApiError_1.ApiError(401, "Session not found or expired");
        }
        const isValid = await session_service_1.sessionService.verifyRefreshToken(payload.sessionId, refreshToken);
        if (!isValid) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        await session_service_1.sessionService.revokeSession(payload.sessionId);
        return {
            success: true,
            message: "Logged out successfully",
        };
    }
    async forgotPassword(email) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const otp = (0, otp_1.generateOTP)();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await password_reset_repository_1.passwordResetRepository.replace({
            email,
            otp,
            expiresAt,
        });
        await publisher_1.eventPublisher.publishPasswordResetEmail(email, otp);
        return {
            success: true,
            message: "Password reset OTP sent successfully.",
        };
    }
    async verifyResetOTP(email, otp) {
        const resetRequest = await password_reset_repository_1.passwordResetRepository.findByEmail(email);
        if (!resetRequest) {
            throw new ApiError_1.ApiError(404, "Password reset request not found or expired.");
        }
        const isValid = await resetRequest.compareOTP(otp);
        if (!isValid) {
            throw new ApiError_1.ApiError(400, "Invalid OTP.");
        }
        return {
            success: true,
            message: "OTP verified successfully.",
        };
    }
}
exports.authService = new AuthService();

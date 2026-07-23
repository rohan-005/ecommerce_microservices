import { Types } from "mongoose";

import { ApiError } from "../utils/ApiError";
import { comparePassword, hashPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { generateOTP } from "../utils/otp";

import { RegisterDto, VerifyEmailDto } from "../validators/auth.validator";

import { userRepository } from "../repositories/user.repository";
import { pendingRepository } from "../repositories/pending.repository";

import { eventPublisher } from "../events/publisher";
import { sessionService } from "./session.service";

class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const otp = generateOTP();

    const hashedPassword = await hashPassword(data.password);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pendingRepository.replace({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      otp,
      expiresAt,
    });

    await eventPublisher.publishVerificationEmail(data.email, data.name, otp);

    return {
      success: true,
      message: "Verification OTP sent successfully.",
    };
  }

  async verifyEmail(
    data: VerifyEmailDto,
    device?: string,
    ip?: string,
    userAgent?: string,
  ) {
    const pending = await pendingRepository.findByEmail(data.email);

    if (!pending) {
      throw new ApiError(404, "Verification request not found.");
    }

    const otpMatched = await pending.compareOTP(data.otp);

    if (!otpMatched) {
      throw new ApiError(400, "Invalid OTP.");
    }

    if (pending.expiresAt.getTime() < Date.now()) {
      await pendingRepository.deleteByEmail(data.email);
      throw new ApiError(400, "OTP expired.");
    }

    const user = await userRepository.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      isVerified: true,
    });

    await pendingRepository.deleteByEmail(pending.email);

    const sessionId = new Types.ObjectId().toHexString();

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionService.createSession(
      sessionId,
      user.id,
      refreshToken,
      expiresAt,
      device,
      ip,
      userAgent,
    );

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

  async login(
    email: string,
    password: string,
    device?: string,
    ip?: string,
    userAgent?: string,
  ) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatched = await comparePassword(password, user.password);

    if (!passwordMatched) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Email is not verified");
    }

    const sessionId = new Types.ObjectId().toHexString();

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionService.createSession(
      sessionId,
      user.id,
      refreshToken,
      expiresAt,
      device,
      ip,
      userAgent,
    );

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

  async refreshToken(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const session = await sessionService.validateSession(payload.sessionId);

    if (!session) {
      throw new ApiError(401, "Invalid or expired session");
    }

    const isValid = await sessionService.verifyRefreshToken(
      payload.sessionId,
      refreshToken,
    );

    if (!isValid) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: payload.sessionId,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionService.rotateRefreshToken(
      payload.sessionId,
      newRefreshToken,
      expiresAt,
    );

    return {
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export const authService = new AuthService();

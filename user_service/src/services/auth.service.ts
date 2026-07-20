import { ApiError } from "../utils/ApiError";
import { RegisterDto, VerifyEmailDto } from "../validators/auth.validator";
import { userRepository } from "../repositories/user.repository";
import { pendingRepository } from "../repositories/pending.repository";
import { generateOTP } from "../utils/otp";
import { eventPublisher } from "../events/publisher";
import { hashPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { IPendingRegistration } from "../interfaces/pending-registration.interface";
import PendingRegistration from "../models/PendingRegistration";

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
      email: data.email,
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
  async replace(data: Partial<IPendingRegistration>) {
    await PendingRegistration.findOneAndDelete({
      email: data.email,
    });

    return PendingRegistration.create(data);
  }

  async verifyEmail(data: VerifyEmailDto) {
    const pending = await pendingRepository.findByEmail(data.email);

    if (!pending) {
      throw new ApiError(404, "Verification request not found.");
    }

    const otpMatched = await pending.compareOTP(data.otp);

    if (!otpMatched) {
      throw new ApiError(400, "Invalid OTP.");
    }

    const user = await userRepository.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      isVerified: true,
    });

    await pendingRepository.deleteByEmail(pending.email);

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
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

export const authService = new AuthService();

import { ApiError } from "../utils/ApiError";
import { userRepository } from "../repositories/user.repository";
import { verificationRepository } from "../repositories/verification.repository";
import { generateOTP } from "../utils/otp";
import { publisher } from "../events/publisher";
import { RegisterDto } from "../validators/auth.validator";

class AuthService {
  async register(data: RegisterDto) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    // Create user
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Generate OTP
    const otp = generateOTP();

    // OTP expires after 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP
    await verificationRepository.replaceToken(
      user._id.toString(),
      otp,
      expiresAt
    );

    // Publish event for Email Service
    await publisher.publish("user.verification.requested", {
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

export const authService = new AuthService();
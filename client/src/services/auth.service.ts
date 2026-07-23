import { 
  registerUser, 
  verifyEmailOTP, 
  loginUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  refreshToken
} from '../api/auth.api';
import type { 
  RegisterRequest, 
  VerifyEmailRequest, 
  LoginRequest,
  ForgotPasswordRequest,
  VerifyResetOTPRequest,
  ResetPasswordRequest,
  RefreshTokenRequest
} from '../types/auth';

export const AuthService = {
  register: async (data: RegisterRequest) => {
    return await registerUser(data);
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    return await verifyEmailOTP(data);
  },

  login: async (data: LoginRequest) => {
    return await loginUser(data);
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    return await forgotPassword(data);
  },

  verifyResetOTP: async (data: VerifyResetOTPRequest) => {
    return await verifyResetOTP(data);
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    return await resetPassword(data);
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    return await refreshToken(data);
  },
};

import { Document } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  compareOTP(candidateOTP: string): Promise<boolean>;
}
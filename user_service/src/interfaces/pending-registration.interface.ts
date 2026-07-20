import { Document } from "mongoose";

export interface IPendingRegistration extends Document {
  name: string;
  email: string;
  password: string;

  otp: string;

  expiresAt: Date;

  compareOTP(candidateOTP: string): Promise<boolean>;

  createdAt: Date;
}
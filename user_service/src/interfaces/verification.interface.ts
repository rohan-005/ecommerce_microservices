import { Document, Types } from "mongoose";

export interface IVerificationToken extends Document {
  userId: Types.ObjectId;

  otp: string;

  expiresAt: Date;

  attempts: number;

  createdAt: Date;
}
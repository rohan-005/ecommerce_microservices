import { Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;

  refreshTokenHash: string;

  device?: string;

  ip?: string;

  userAgent?: string;

  isRevoked: boolean;

  expiresAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
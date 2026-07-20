import mongoose, { Schema } from "mongoose";
import { IVerificationToken } from "../interfaces/verification.interface";

const verificationSchema = new Schema<IVerificationToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    index: {
      expires: 0,
    },
  },

  attempts: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<IVerificationToken>(
  "VerificationToken",
  verificationSchema
);
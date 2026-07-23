import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import { IPasswordReset } from "../interfaces/password-reset.interface";

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
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
  },
  {
    timestamps: true,
  },
);

passwordResetSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;

  this.otp = await bcrypt.hash(this.otp, 10);
});
passwordResetSchema.methods.compareOTP = async function (candidateOTP: string) {
  return bcrypt.compare(candidateOTP, this.otp);
};

export default model<IPasswordReset>("PasswordReset", passwordResetSchema);

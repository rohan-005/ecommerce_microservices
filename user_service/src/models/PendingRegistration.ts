import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IPendingRegistration } from "../interfaces/pending-registration.interface";

const pendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    otp: {
      type: String,
      required: true,
      select: false,
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
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
    collection: "pending_registrations",
  }
);

/**
 * Password is ALREADY hashed in AuthService.register().
 * Only hash the OTP here.
 */
pendingRegistrationSchema.pre("save", async function () {
  if (!this.isModified("otp")) {
    return;
  }

  this.otp = await bcrypt.hash(this.otp, 10);
});

pendingRegistrationSchema.methods.compareOTP = async function (
  candidateOTP: string
): Promise<boolean> {
  return bcrypt.compare(candidateOTP, this.otp);
};

pendingRegistrationSchema.index(
  { email: 1 },
  { unique: true }
);

const PendingRegistration = mongoose.model<IPendingRegistration>(
  "PendingRegistration",
  pendingRegistrationSchema
);

export default PendingRegistration;
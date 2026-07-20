import VerificationToken from "../models/VerificationToken";

export class VerificationRepository {
  async create(data: {
    userId: string;
    otp: string;
    expiresAt: Date;
  }) {
    return VerificationToken.create(data);
  }

  async findByUserId(userId: string) {
    return VerificationToken.findOne({ userId });
  }

  async deleteByUserId(userId: string) {
    return VerificationToken.deleteOne({ userId });
  }

  async replaceToken(
    userId: string,
    otp: string,
    expiresAt: Date
  ) {
    await VerificationToken.findOneAndDelete({
      userId,
    });

    return VerificationToken.create({
      userId,
      otp,
      expiresAt,
    });
  }
}

export const verificationRepository =
  new VerificationRepository();
import VerificationToken from "../models/VerificationToken";

export class VerificationRepository {
  async create(data: {
    userId: string;
    otp: string;
    expiresAt: Date;
  }) {
    return VerificationToken.create(data);
  }

  async findByUser(userId: string) {
    return VerificationToken.findOne({ userId });
  }

  async delete(userId: string) {
    return VerificationToken.deleteOne({ userId });
  }
}
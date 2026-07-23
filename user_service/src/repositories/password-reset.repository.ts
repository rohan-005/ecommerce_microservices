import PasswordReset from "../models/PasswordReset";


class PasswordResetRepository {
  async create(data: {
    email: string;
    otp: string;
    expiresAt: Date;
  }) {
    return PasswordReset.create(data);
  }

  async findByEmail(email: string) {
    return PasswordReset.findOne({
      email: email.toLowerCase(),
    });
  }

  async replace(data: {
    email: string;
    otp: string;
    expiresAt: Date;
  }) {
    await PasswordReset.deleteOne({
      email: data.email.toLowerCase(),
    });

    return PasswordReset.create(data);
  }

  async deleteByEmail(email: string) {
    return PasswordReset.deleteOne({
      email: email.toLowerCase(),
    });
  }
}

export const passwordResetRepository =
  new PasswordResetRepository();
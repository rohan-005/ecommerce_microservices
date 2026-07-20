import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export class UserRepository {
  async create(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async updateVerificationStatus(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );
  }

  async delete(userId: string) {
    return User.findByIdAndDelete(userId);
  }
}

export const userRepository = new UserRepository();
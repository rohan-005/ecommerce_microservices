import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export class UserRepository {
  async create(user: Partial<IUser>) {
    return User.create(user);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async verifyUser(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );
  }
}
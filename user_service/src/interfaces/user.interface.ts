import { Document } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;

  comparePassword(password: string): Promise<boolean>;

  createdAt: Date;
  updatedAt: Date;
}
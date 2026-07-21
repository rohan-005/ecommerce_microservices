import PendingRegistration from "../models/PendingRegistration";
import { IPendingRegistration } from "../interfaces/pending-registration.interface";

export class PendingRepository {
  async create(data: Partial<IPendingRegistration>) {
    return PendingRegistration.create(data);
  }

  async findByEmail(email: string) {
    return PendingRegistration.findOne({
      email: email.toLowerCase(),
    }).select("+password +otp");
  }

  async deleteByEmail(email: string) {
    return PendingRegistration.deleteOne({
      email: email.toLowerCase(),
    });
  }

  async replace(data: Partial<IPendingRegistration>) {
    await PendingRegistration.deleteOne({
      email: data.email?.toLowerCase(),
    });

    return PendingRegistration.create({
      ...data,
      email: data.email?.toLowerCase(),
    });
  }
}

export const pendingRepository = new PendingRepository();
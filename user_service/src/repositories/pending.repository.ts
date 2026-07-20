import PendingRegistration from "../models/PendingRegistration";
import { IPendingRegistration } from "../interfaces/pending-registration.interface";

export class PendingRepository {
  async create(data: Partial<IPendingRegistration>) {
    return PendingRegistration.create(data);
  }

  async findByEmail(email: string) {
    return PendingRegistration.findOne({ email }).select("+password");
  }

  async deleteByEmail(email: string) {
    return PendingRegistration.deleteOne({ email });
  }

  async replace(data: Partial<IPendingRegistration>) {
    await PendingRegistration.deleteOne({
      email: data.email,
    });

    return PendingRegistration.create(data);
  }
}

export const pendingRepository = new PendingRepository();
import Session from "../models/Session";
import { ISession } from "../interfaces/session.interface";

class SessionRepository {
  async create(data: Partial<ISession>) {
    return Session.create(data);
  }

  async findById(id: string) {
    return Session.findById(id);
  }

  async findByUser(userId: string) {
    return Session.find({
      userId,
      isRevoked: false,
    });
  }

  async revoke(id: string) {
    return Session.findByIdAndUpdate(
      id,
      {
        isRevoked: true,
      },
      {
        new: true,
      }
    );
  }

  async delete(id: string) {
    return Session.findByIdAndDelete(id);
  }

  async deleteAllForUser(userId: string) {
    return Session.deleteMany({
      userId,
    });
  }
}

export const sessionRepository =
  new SessionRepository();
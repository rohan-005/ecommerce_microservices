import { Types } from "mongoose";
import Session from "../models/Session";
import { ISession } from "../interfaces/session.interface";

class SessionRepository {
  async create(sessionId: string, data: Partial<ISession>) {
    return Session.create({
      _id: new Types.ObjectId(sessionId),
      ...data,
    });
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
      },
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

  async updateRefreshToken(
    sessionId: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ) {
    return Session.findByIdAndUpdate(
      sessionId,
      {
        refreshTokenHash,
        expiresAt,
      },
      {
        new: true,
      },
    );
  }
}

export const sessionRepository = new SessionRepository();

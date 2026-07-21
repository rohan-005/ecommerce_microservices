import { Types } from "mongoose";
import { compareHash, hashValue } from "../utils/hash";
import { redisClient } from "../config/redis";
import { sessionRepository } from "../repositories/session.repository";

export class SessionService {
  private readonly SESSION_PREFIX = "session:";

  async createSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    device?: string,
    ip?: string,
    userAgent?: string
  ) {
    const refreshTokenHash =
      await hashValue(refreshToken);

    const session =
      await sessionRepository.create(
        sessionId,
        {
          userId: new Types.ObjectId(userId),
          refreshTokenHash,
          expiresAt,
          device,
          ip,
          userAgent,
          isRevoked: false,
        }
      );

    const ttl = Math.max(
      1,
      Math.floor(
        (expiresAt.getTime() - Date.now()) /
          1000
      )
    );

    await redisClient.set(
      `${this.SESSION_PREFIX}${sessionId}`,
      JSON.stringify({
        userId,
        revoked: false,
      }),
      {
        EX: ttl,
      }
    );

    return session;
  }

  async validateSession(sessionId: string) {
    const key =
      `${this.SESSION_PREFIX}${sessionId}`;

    const cached =
      await redisClient.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const session =
      await sessionRepository.findById(
        sessionId
      );

    if (!session) return null;

    if (session.isRevoked) return null;

    if (
      session.expiresAt.getTime() <
      Date.now()
    )
      return null;

    const ttl = Math.max(
      1,
      Math.floor(
        (session.expiresAt.getTime() -
          Date.now()) /
          1000
      )
    );

    await redisClient.set(
      key,
      JSON.stringify({
        userId:
          session.userId.toString(),
        revoked: false,
      }),
      {
        EX: ttl,
      }
    );

    return session;
  }

  async verifyRefreshToken(
    sessionId: string,
    refreshToken: string
  ) {
    const session =
      await sessionRepository.findById(
        sessionId
      );

    if (!session) return false;

    if (session.isRevoked)
      return false;

    return compareHash(
      refreshToken,
      session.refreshTokenHash
    );
  }

  async revokeSession(
    sessionId: string
  ) {
    await redisClient.del(
      `${this.SESSION_PREFIX}${sessionId}`
    );

    return sessionRepository.revoke(
      sessionId
    );
  }

  async revokeAllSessions(
    userId: string
  ) {
    const sessions =
      await sessionRepository.findByUser(
        userId
      );

    for (const session of sessions) {
      await redisClient.del(
        `${this.SESSION_PREFIX}${session.id}`
      );

      await sessionRepository.revoke(
        session.id
      );
    }
  }

  async deleteSession(
    sessionId: string
  ) {
    await redisClient.del(
      `${this.SESSION_PREFIX}${sessionId}`
    );

    return sessionRepository.delete(
      sessionId
    );
  }
}

export const sessionService =
  new SessionService();
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET as Secret,
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET as Secret,
  ) as RefreshTokenPayload;
}

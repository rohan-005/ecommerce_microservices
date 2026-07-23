import { Request, Response, NextFunction } from "express";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  verifyEmailSchema,
} from "../validators/auth.validator";

import { authService } from "../services/auth.service";

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);

      const response = await authService.register(validatedData);

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = verifyEmailSchema.parse(req.body);

      const response = await authService.verifyEmail(
        validatedData,
        req.headers["x-device"] as string,
        req.ip,
        req.headers["user-agent"],
      );

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const response = await authService.login(
        validatedData.email,
        validatedData.password,
        req.headers["x-device"] as string,
        req.ip,
        req.headers["user-agent"],
      );

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        // success: true,
        // message: "Token refreshed successfully",
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();

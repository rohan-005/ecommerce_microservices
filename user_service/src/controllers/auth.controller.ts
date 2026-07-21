import { Request, Response, NextFunction } from "express";
import { registerSchema, verifyEmailSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const response = await authService.register(validatedData);

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validatedData = verifyEmailSchema.parse(req.body);

      const result = await authService.verifyEmail(validatedData);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
import { Request, Response, NextFunction } from "express";
import { registerSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const response = await authService.register(validatedData);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
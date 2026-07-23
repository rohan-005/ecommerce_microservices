import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { forgotPasswordSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", authController.register.bind(authController));

router.post("/verify-email", authController.verifyEmail.bind(authController));

router.post("/login", authController.login.bind(authController));

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-reset-otp", authController.verifyResetOTP);
export default router;

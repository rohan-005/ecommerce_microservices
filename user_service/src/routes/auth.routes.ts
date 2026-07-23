import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register.bind(authController));

router.post("/verify-email", authController.verifyEmail.bind(authController));

router.post("/login", authController.login.bind(authController));

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

export default router;

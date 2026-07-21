"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.authController.register);
router.post("/verify-email", auth_controller_1.authController.verifyEmail);
exports.default = router;

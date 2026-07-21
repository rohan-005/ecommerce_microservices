"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const validatedData = auth_validator_1.registerSchema.parse(req.body);
            const response = await auth_service_1.authService.register(validatedData);
            return res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const validatedData = auth_validator_1.verifyEmailSchema.parse(req.body);
            const result = await auth_service_1.authService.verifyEmail(validatedData);
            return res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.authController = new AuthController();

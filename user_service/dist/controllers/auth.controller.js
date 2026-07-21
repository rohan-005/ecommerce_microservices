"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    register = async (req, res, next) => {
        try {
            const validatedData = auth_validator_1.registerSchema.parse(req.body);
            const response = await auth_service_1.authService.register(validatedData);
            return res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    verifyEmail = async (req, res, next) => {
        try {
            const validatedData = auth_validator_1.verifyEmailSchema.parse(req.body);
            const response = await auth_service_1.authService.verifyEmail(validatedData, req.headers["x-device"], req.ip, req.headers["user-agent"]);
            return res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const validatedData = auth_validator_1.loginSchema.parse(req.body);
            const response = await auth_service_1.authService.login(validatedData.email, validatedData.password, req.headers["x-device"], req.ip, req.headers["user-agent"]);
            return res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.authController = new AuthController();

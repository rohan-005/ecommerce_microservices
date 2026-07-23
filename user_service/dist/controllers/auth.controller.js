"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const auth_service_1 = require("../services/auth.service");
const ApiResponse_1 = require("../utils/ApiResponse");
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
    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = auth_validator_1.refreshTokenSchema.parse(req.body);
            const tokens = await auth_service_1.authService.refreshToken(refreshToken);
            res.status(200).json({
                // success: true,
                // message: "Token refreshed successfully",
                ...tokens,
            });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const { refreshToken } = auth_validator_1.logoutSchema.parse(req.body);
            const result = await auth_service_1.authService.logout(refreshToken);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await auth_service_1.authService.forgotPassword(email);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, result.message));
        }
        catch (error) {
            next(error);
        }
    };
    verifyResetOTP = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await auth_service_1.authService.verifyResetOTP(email, otp);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, result.message));
        }
        catch (error) {
            next(error);
        }
    };
}
exports.authController = new AuthController();

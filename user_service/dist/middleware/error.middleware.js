"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues,
        });
    }
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors ?? null,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;

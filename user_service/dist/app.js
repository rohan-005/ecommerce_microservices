"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // React frontend
    credentials: true,
}));
// Logging
app.use((0, morgan_1.default)("dev"));
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookies
app.use((0, cookie_parser_1.default)());
// Health Check
app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "User Service is running",
    });
});
// TODO: Routes
// app.use("/api/v1/auth", authRoutes);
// 404 Handler
app.use(notFound_middleware_1.notFoundHandler);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;

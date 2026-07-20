"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRepository = exports.VerificationRepository = void 0;
const VerificationToken_1 = __importDefault(require("../models/VerificationToken"));
class VerificationRepository {
    async create(data) {
        return VerificationToken_1.default.create(data);
    }
    async findByUserId(userId) {
        return VerificationToken_1.default.findOne({ userId });
    }
    async deleteByUserId(userId) {
        return VerificationToken_1.default.deleteOne({ userId });
    }
    async replaceToken(userId, otp, expiresAt) {
        await VerificationToken_1.default.findOneAndDelete({
            userId,
        });
        return VerificationToken_1.default.create({
            userId,
            otp,
            expiresAt,
        });
    }
}
exports.VerificationRepository = VerificationRepository;
exports.verificationRepository = new VerificationRepository();

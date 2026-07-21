"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingRepository = exports.PendingRepository = void 0;
const PendingRegistration_1 = __importDefault(require("../models/PendingRegistration"));
class PendingRepository {
    async create(data) {
        return PendingRegistration_1.default.create(data);
    }
    async findByEmail(email) {
        return PendingRegistration_1.default.findOne({
            email: email.toLowerCase(),
        }).select("+password +otp");
    }
    async deleteByEmail(email) {
        return PendingRegistration_1.default.deleteOne({
            email: email.toLowerCase(),
        });
    }
    async replace(data) {
        await PendingRegistration_1.default.deleteOne({
            email: data.email?.toLowerCase(),
        });
        return PendingRegistration_1.default.create({
            ...data,
            email: data.email?.toLowerCase(),
        });
    }
}
exports.PendingRepository = PendingRepository;
exports.pendingRepository = new PendingRepository();

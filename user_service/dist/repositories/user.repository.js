"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserRepository {
    async create(userData) {
        return User_1.default.create(userData);
    }
    async findByEmail(email) {
        return User_1.default.findOne({ email });
    }
    async findById(id) {
        return User_1.default.findById(id);
    }
    async updateVerificationStatus(userId) {
        return User_1.default.findByIdAndUpdate(userId, {
            isVerified: true,
        }, {
            new: true,
        });
    }
    async delete(userId) {
        return User_1.default.findByIdAndDelete(userId);
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();

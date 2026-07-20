"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventPublisher = exports.EmailEventType = void 0;
const redis_1 = require("../config/redis");
const EMAIL_STREAM = "email-stream";
var EmailEventType;
(function (EmailEventType) {
    EmailEventType["SEND_VERIFICATION_EMAIL"] = "SEND_VERIFICATION_EMAIL";
    EmailEventType["SEND_PASSWORD_RESET_EMAIL"] = "SEND_PASSWORD_RESET_EMAIL";
})(EmailEventType || (exports.EmailEventType = EmailEventType = {}));
class EventPublisher {
    async publishVerificationEmail(email, name, otp) {
        const id = await redis_1.redisClient.xAdd(EMAIL_STREAM, "*", {
            data: JSON.stringify({
                type: EmailEventType.SEND_VERIFICATION_EMAIL,
                email,
                name,
                otp,
            }),
        });
        console.log(`Verification email event published. Stream ID: ${id}`);
    }
    async publishPasswordResetEmail(email, name, otp) {
        const id = await redis_1.redisClient.xAdd(EMAIL_STREAM, "*", {
            data: JSON.stringify({
                type: EmailEventType.SEND_PASSWORD_RESET_EMAIL,
                email,
                name,
                otp,
            }),
        });
        console.log(`Password reset event published. Stream ID: ${id}`);
    }
}
exports.eventPublisher = new EventPublisher();

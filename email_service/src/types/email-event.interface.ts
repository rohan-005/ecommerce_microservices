export enum EmailEventType {
    SEND_VERIFICATION_EMAIL = "SEND_VERIFICATION_EMAIL",
    SEND_PASSWORD_RESET_EMAIL = "SEND_PASSWORD_RESET_EMAIL",
}

export interface EmailEvent {
    type: EmailEventType;
    email: string;
    name: string;
    otp: string;
}
export type EmailEventType =
  | "EMAIL_VERIFICATION"
  | "PASSWORD_RESET";

export interface EmailEvent {
  type: EmailEventType;

  email: string;

  otp: string;

  name?: string;
}
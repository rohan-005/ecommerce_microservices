export const passwordResetTemplate = (
  otp: string,
) => `
<div style="font-family: Arial, sans-serif; padding:20px;">
    <h2>Password Reset</h2>

    <p>
        We received a request to reset your password.
    </p>

    <p>
        Use the following OTP:
    </p>

    <h1
        style="
            letter-spacing:6px;
            color:#2563eb;
        "
    >
        ${otp}
    </h1>

    <p>
        This OTP expires in 10 minutes.
    </p>

    <p>
        If you didn't request a password reset,
        you can safely ignore this email.
    </p>
</div>
`;
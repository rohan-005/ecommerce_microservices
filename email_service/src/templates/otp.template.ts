export function otpTemplate(name: string, otp: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>

<body style="margin:0;padding:40px;background:#f5f5f5;font-family:Arial,sans-serif;">

<table
    align="center"
    width="600"
    cellpadding="0"
    cellspacing="0"
    style="background:white;border-radius:10px;padding:40px;"
>

<tr>
<td>

<h2>Hello ${name},</h2>

<p>
Thank you for registering.
</p>

<p>
Use the following OTP to verify your account.
</p>

<div
style="
font-size:36px;
font-weight:bold;
letter-spacing:8px;
text-align:center;
padding:25px;
background:#f4f4f4;
margin:30px 0;
border-radius:8px;
"
>
${otp}
</div>

<p>
This OTP expires in 10 minutes.
</p>

<p>
If you didn't request this email, you can safely ignore it.
</p>

<p>
Regards,<br/>
E-Commerce Team
</p>

</td>
</tr>

</table>

</body>
</html>
`;
}
const resetPasswordTemplate = ({
    name,
    resetUrl,
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f5f7fb;
        font-family:Arial,Helvetica,sans-serif;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 0;"
>
<tr>
<td align="center">

<table
    width="600"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 6px 18px rgba(0,0,0,0.08);
    "
>

<tr>
<td
    style="
        background:#2563eb;
        color:white;
        padding:28px;
        text-align:center;
    "
>
<h1 style="margin:0;">
StudentOS
</h1>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello ${name},</h2>

<p>
We received a request to reset the password for your StudentOS account.
</p>

<p>
Click the button below to create a new password.
</p>

<p
    style="
        text-align:center;
        margin:35px 0;
    "
>

<a
    href="${resetUrl}"
    style="
        background:#2563eb;
        color:white;
        text-decoration:none;
        padding:14px 28px;
        border-radius:8px;
        display:inline-block;
        font-weight:bold;
    "
>
Reset Password
</a>

</p>

<p>
This link will expire in
<strong>15 minutes</strong>.
</p>

<p>
If you didn't request a password reset, you can safely ignore this email.
Your password will remain unchanged.
</p>

<hr
    style="
        margin:32px 0;
        border:none;
        border-top:1px solid #eeeeee;
    "
>

<p
    style="
        color:#777;
        font-size:14px;
    "
>
StudentOS Security Team
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

export default resetPasswordTemplate;
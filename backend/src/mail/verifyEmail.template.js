const verifyEmailTemplate = ({ name, verificationUrl }) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Verify your StudentOS Account</title>
</head>

<body style="margin:0;padding:40px;background:#f4f6f8;font-family:Arial,sans-serif;">

    <div style="max-width:600px;margin:auto;background:#ffffff;padding:40px;border-radius:12px;">

        <h1 style="color:#2563eb;">
            Welcome to StudentOS 🚀
        </h1>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
            Thanks for creating your StudentOS account.
            Please verify your institute email to activate your account.
        </p>

        <div style="margin:40px 0;text-align:center;">

            <a
                href="${verificationUrl}"
                style="
                    background:#2563eb;
                    color:white;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                    display:inline-block;
                "
            >
                Verify Email
            </a>

        </div>

        <p>
            This verification link expires in
            <strong>1 hour</strong>.
        </p>

        <hr>

        <p style="font-size:14px;color:#666;">
            If you didn't create this account, you can safely ignore this email.
        </p>

    </div>

</body>

</html>
`;
};

export default verifyEmailTemplate;
import { sendEmail } from "./src/services/email.service.js";

await sendEmail({
    to: "aayush.gupta.che24@itbhu.ac.in",
    subject: "StudentOS Test Email",

    html: `
        <h1>🚀 StudentOS</h1>

        <p>If you're reading this, our email service works!</p>
    `,
});

console.log("Email sent successfully!");
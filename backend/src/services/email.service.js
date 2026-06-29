import axios from "axios";
import env from "../config/env.js";

export const sendEmail = async ({
    to,
    subject,
    html,
}) => {
    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: env.BREVO_SENDER_NAME,
                email: env.BREVO_SENDER_EMAIL,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject,

            htmlContent: html,
        },
        {
            headers: {
                accept: "application/json",
                "api-key": env.BREVO_API_KEY,
                "content-type": "application/json",
            },
        }
    );
};
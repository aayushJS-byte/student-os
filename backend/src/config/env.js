import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,

    MONGODB_URI: process.env.MONGODB_URI,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,


    BREVO_API_KEY: process.env.BREVO_API_KEY,

    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,

    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,

    JWT_ACCESS_EXPIRES_IN:
        process.env.JWT_ACCESS_EXPIRES_IN,

    JWT_REFRESH_EXPIRES_IN:
        process.env.JWT_REFRESH_EXPIRES_IN,

    CLIENT_URL: process.env.CLIENT_URL,

    ALLOWED_EMAIL_DOMAINS:
        process.env.ALLOWED_EMAIL_DOMAINS?.split(",") || [],
};

export default env;
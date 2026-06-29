import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,

    MONGODB_URI: process.env.MONGODB_URI,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,

    CLIENT_URL: process.env.CLIENT_URL,

    ALLOWED_EMAIL_DOMAINS:
        process.env.ALLOWED_EMAIL_DOMAINS?.split(",") || [],
};

export default env;
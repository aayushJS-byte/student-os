import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import env from "./config/env.js";
import ApiResponse from "./utils/ApiResponse.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";
import prepRoutes from "./modules/prep/question.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
    return ApiResponse.success(res, null, "StudentOS API is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/prep", prepRoutes);

app.use(errorHandler);

export default app;

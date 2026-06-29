import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import ApiResponse from "./utils/ApiResponse.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
    return ApiResponse.success(
        res,
        null,
        "StudentOS API is running"
    );
});

export default app;
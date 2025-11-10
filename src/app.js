import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [process.env.ALLOWED_SITE],
    credentials: true
};

app.use(cors(corsOptions));

// ✅ ADD ONLY THE ESSENTIAL ROOT ROUTE
app.get("/", (req, res) => {
    res.json({ 
        message: "Resume Builder Backend API is running!",
        status: "OK",
        timestamp: new Date(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

// ✅ ADD CATCH-ALL 404 HANDLER
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        availableRoutes: ["/", "/api/users", "/api/resumes"]
    });
});

export default app;

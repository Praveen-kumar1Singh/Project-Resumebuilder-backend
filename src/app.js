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

// ✅ FIXED CORS CONFIGURATION
const corsOptions = {
    origin: [
        "https://project-resumebuilder-frontend.vercel.app", // Your frontend URL
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000"  // CRA dev server
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Root route
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

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        availableRoutes: ["/", "/api/users", "/api/resumes"]
    });
});

export default app;

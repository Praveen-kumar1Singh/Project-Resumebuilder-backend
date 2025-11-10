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

// ✅ UPDATED CORS - Handle both with and without trailing slash
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://project-resumebuilder-frontend.vercel.app",
            "https://project-resumebuilder-frontend.vercel.app/", // with slash
            "http://localhost:5173",
            "http://localhost:3000"
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked for origin:', origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
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

export default app;

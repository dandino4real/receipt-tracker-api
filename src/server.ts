import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { connectDB } from "./config/db";

const app = express();

// Load environment variables FIRST
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

// Middleware setup
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// const corsOrigins = process.env.CORS_ORIGINS
//   ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
//   : ["https://receipt-tracker-web.vercel.app"];

// console.log("origins", corsOrigins);

// app.use(
//   cors({
//     // origin: corsOrigins,
//     origin: "https://receipt-tracker-web.vercel.app",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Set-Cookie"],
//     preflightContinue: true,
//   })
// );

// app.options("*", cors()); // Handle preflight

app.use(
  cors({
    origin: "https://receipt-tracker-web.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const initializeApp = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    return true;
  } catch (error) {
    console.error("❌❌❌ Initialization failed:", error);
    throw error;
  }
};

// Start initialization
initializeApp().catch((err) => {
  console.error("Initialization error:", err);
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "successfully",
  });
});

export default app;

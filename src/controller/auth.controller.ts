import { Request, Response } from "express";
import { AdminModel } from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const AuthController = {
  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const admin = await AdminModel.findOne({ email });

      if (!admin) throw new Error("Invalid email or password");

       const payload = { id: admin._id, email: admin.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === "production" ? "telegram-api-k5mk.vercel.app" : undefined,
      });

      return res.status(200).json({
        message: "Login successful",
        accessToken,
      });


    } catch (error: any) {
             console.error("Login error:", error);
      return res.status(401).json({
        message: error.message || "Authentication failed",
      });
    }
  },
};

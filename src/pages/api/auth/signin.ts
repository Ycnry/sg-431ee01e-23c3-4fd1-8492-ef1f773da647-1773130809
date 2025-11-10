
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const mockUser: User = {
      id: "user-" + Date.now(),
      name: "John Doe",
      email: email,
      phone: "+255712345678",
      createdAt: new Date().toISOString(),
    };

    const token = "mock-jwt-token-" + Math.random().toString(36);

    return res.status(200).json({
      success: true,
      user: mockUser,
      token: token,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({ error: "Sign in failed" });
  }
}


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
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["customer", "fundi", "shop"].includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    const mockUser: User = {
      id: "user-" + Date.now(),
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    };

    const token = "mock-jwt-token-" + Math.random().toString(36);

    return res.status(201).json({
      success: true,
      user: mockUser,
      token: token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ error: "Sign up failed" });
  }
}


import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const magicToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/verify-magic-link?token=${magicToken}&email=${encodeURIComponent(email)}`;

    console.log("Magic link generated:", magicLink);
    console.log("Expires at:", expiresAt);

    return res.status(200).json({
      success: true,
      message: "Magic link sent to your email",
      magicLink: magicLink,
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return res.status(500).json({ error: "Failed to send magic link" });
  }
}

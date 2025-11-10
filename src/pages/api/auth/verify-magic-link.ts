
import type { NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ error: "Invalid magic link" });
    }

    const mockUser = {
      id: "magic-" + Date.now(),
      name: "User",
      email: email as string,
      createdAt: new Date().toISOString(),
    };

    const authToken = "mock-jwt-token-" + Math.random().toString(36);

    return res.status(200).json({
      success: true,
      user: mockUser,
      token: authToken,
      message: "Magic link verified successfully",
    });
  } catch (error) {
    console.error("Magic link verification error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
}

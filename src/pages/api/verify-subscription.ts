
import type { NextApiRequest, NextApiResponse } from "next";
import { subscriptionDb } from "@/lib/subscriptionDb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const isActive = subscriptionDb.isUserActiveAndValid(userId);
    const isPromoted = subscriptionDb.isUserPromoted(userId);
    const subscriptionStatus = subscriptionDb.getSubscriptionStatus(userId);

    return res.status(200).json({
      isActive,
      isPromoted,
      subscriptionStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Subscription verification error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
}

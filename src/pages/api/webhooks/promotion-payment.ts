
import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentWebhookPayload, SubscriptionStatus, PROMOTION_DAILY_FEE } from "@/types/payments";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookSecret = process.env.PROMOTION_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("PROMOTION_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const payload: PaymentWebhookPayload = req.body;

    const durationDays = Math.floor(payload.amount / PROMOTION_DAILY_FEE);

    if (durationDays < 1) {
      return res.status(400).json({ error: "Invalid promotion payment amount" });
    }

    if (payload.status === "success") {
      const promotionExpiry = calculateExpiryDate(durationDays);

      const subscriptionStatus: SubscriptionStatus = {
        userId: payload.userId,
        userType: payload.userType,
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isPromoted: true,
        promotionExpiry,
        lastPaymentDate: payload.timestamp,
        paymentMethod: payload.paymentMethod,
        transactionId: payload.transactionId
      };

      console.log(`Promotion webhook: Activating promotion for user ${payload.userId} for ${durationDays} days`);

      return res.status(200).json({
        success: true,
        message: `Promotion activated for ${durationDays} days`,
        subscriptionStatus,
        promotionExpiry
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Promotion payment failed or canceled"
      });
    }
  } catch (error) {
    console.error("Promotion webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

function calculateExpiryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

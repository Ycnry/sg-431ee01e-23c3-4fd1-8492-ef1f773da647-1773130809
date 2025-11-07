
import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentWebhookPayload, SubscriptionStatus, SUBSCRIPTION_FEES } from "@/types/payments";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const payload: PaymentWebhookPayload = req.body;

    if (payload.status === "success") {
      const subscriptionStatus: SubscriptionStatus = {
        userId: payload.userId,
        userType: payload.userType,
        isActive: true,
        expiryDate: calculateExpiryDate(30),
        isPromoted: false,
        lastPaymentDate: payload.timestamp,
        paymentMethod: "stripe",
        transactionId: payload.transactionId
      };

      console.log("Stripe webhook: Activating subscription for user", payload.userId);
      
      return res.status(200).json({
        success: true,
        message: "Subscription activated",
        subscriptionStatus
      });
    } else {
      const subscriptionStatus: SubscriptionStatus = {
        userId: payload.userId,
        userType: payload.userType,
        isActive: false,
        expiryDate: new Date().toISOString(),
        isPromoted: false,
        lastPaymentDate: payload.timestamp,
        paymentMethod: "stripe",
        transactionId: payload.transactionId
      };

      console.log("Stripe webhook: Deactivating subscription for user", payload.userId);

      return res.status(200).json({
        success: true,
        message: "Subscription deactivated",
        subscriptionStatus
      });
    }
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

function calculateExpiryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

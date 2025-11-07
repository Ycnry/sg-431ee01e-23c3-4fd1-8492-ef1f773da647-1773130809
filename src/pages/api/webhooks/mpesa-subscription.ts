
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
    const webhookSecret = process.env.MPESA_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("MPESA_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const payload: PaymentWebhookPayload = req.body;

    const expectedAmount = payload.userType === "fundi" 
      ? SUBSCRIPTION_FEES.fundi 
      : SUBSCRIPTION_FEES.shop;

    if (payload.amount !== expectedAmount) {
      console.error(`M-Pesa payment amount mismatch: expected ${expectedAmount}, got ${payload.amount}`);
      return res.status(400).json({ error: "Payment amount mismatch" });
    }

    if (payload.status === "success") {
      const subscriptionStatus: SubscriptionStatus = {
        userId: payload.userId,
        userType: payload.userType,
        isActive: true,
        expiryDate: calculateExpiryDate(30),
        isPromoted: false,
        lastPaymentDate: payload.timestamp,
        paymentMethod: "mpesa",
        transactionId: payload.transactionId
      };

      console.log("M-Pesa webhook: Activating subscription for user", payload.userId);

      return res.status(200).json({
        success: true,
        message: "Subscription activated via M-Pesa",
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
        paymentMethod: "mpesa",
        transactionId: payload.transactionId
      };

      console.log("M-Pesa webhook: Deactivating subscription for user", payload.userId);

      return res.status(200).json({
        success: true,
        message: "Subscription deactivated",
        subscriptionStatus
      });
    }
  } catch (error) {
    console.error("M-Pesa webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

function calculateExpiryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

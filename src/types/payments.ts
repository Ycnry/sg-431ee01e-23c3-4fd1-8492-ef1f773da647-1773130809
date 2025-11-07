
export interface SubscriptionStatus {
  userId: string;
  userType: "fundi" | "shop";
  isActive: boolean;
  expiryDate: string;
  isPromoted: boolean;
  promotionExpiry?: string;
  lastPaymentDate?: string;
  paymentMethod?: "mpesa" | "stripe";
  transactionId?: string;
}

export interface PaymentWebhookPayload {
  userId: string;
  userType: "fundi" | "shop";
  amount: number;
  currency: "TZS" | "USD";
  paymentMethod: "mpesa" | "stripe";
  transactionId: string;
  status: "success" | "failed" | "canceled";
  timestamp: string;
}

export interface PromotionPayment {
  userId: string;
  userType: "fundi" | "shop";
  durationDays: number;
  amount: number;
  transactionId: string;
  paymentMethod: "mpesa" | "stripe";
}

export interface SubscriptionPayment {
  userId: string;
  userType: "fundi" | "shop";
  monthlyFee: number;
  transactionId: string;
  paymentMethod: "mpesa" | "stripe";
}

export const SUBSCRIPTION_FEES = {
  fundi: 5000,
  shop: 15000
} as const;

export const PROMOTION_DAILY_FEE = 1500;

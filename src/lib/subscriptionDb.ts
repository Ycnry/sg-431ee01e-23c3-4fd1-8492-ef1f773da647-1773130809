
import { SubscriptionStatus } from "@/types/payments";

const STORAGE_KEY = "smartfundi_subscriptions";

export const subscriptionDb = {
  getSubscriptionStatus: (userId: string): SubscriptionStatus | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const subscriptions: SubscriptionStatus[] = JSON.parse(data);
      return subscriptions.find(sub => sub.userId === userId) || null;
    } catch {
      return null;
    }
  },

  updateSubscriptionStatus: (status: SubscriptionStatus): boolean => {
    if (typeof window === "undefined") return false;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const subscriptions: SubscriptionStatus[] = data ? JSON.parse(data) : [];
      
      const existingIndex = subscriptions.findIndex(sub => sub.userId === status.userId);
      
      if (existingIndex >= 0) {
        subscriptions[existingIndex] = status;
      } else {
        subscriptions.push(status);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      return true;
    } catch {
      return false;
    }
  },

  isUserActiveAndValid: (userId: string): boolean => {
    const status = subscriptionDb.getSubscriptionStatus(userId);
    if (!status) return false;
    
    const now = new Date();
    const expiryDate = new Date(status.expiryDate);
    
    return status.isActive && expiryDate > now;
  },

  isUserPromoted: (userId: string): boolean => {
    const status = subscriptionDb.getSubscriptionStatus(userId);
    if (!status || !status.isPromoted || !status.promotionExpiry) return false;
    
    const now = new Date();
    const promotionExpiry = new Date(status.promotionExpiry);
    
    return promotionExpiry > now;
  },

  getAllActiveSubscriptions: (): SubscriptionStatus[] => {
    if (typeof window === "undefined") return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const subscriptions: SubscriptionStatus[] = JSON.parse(data);
      const now = new Date();
      
      return subscriptions.filter(sub => {
        const expiryDate = new Date(sub.expiryDate);
        return sub.isActive && expiryDate > now;
      });
    } catch {
      return [];
    }
  }
};

export function cannotModifyOwnSubscription(): string {
  return "ERROR: Users cannot modify their own subscription status. Only system webhooks can update subscription data.";
}

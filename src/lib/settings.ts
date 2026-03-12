// =====================================================
// SMART FUNDI - APPLICATION SETTINGS
// =====================================================

/**
 * Environment variable access with type safety
 * All sensitive keys must be in .env.local and never committed
 */

// Database
export const DATABASE_URL = process.env.DATABASE_URL || "";

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || "smart-fundi-jwt-secret-change-in-production";
export const JWT_EXPIRES_IN = "7d";
export const REFRESH_TOKEN_EXPIRES_IN = "30d";

// Supabase (auto-configured)
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Payment APIs
export const VODACOM_API_KEY = process.env.VODACOM_API_KEY || "";
export const VODACOM_API_SECRET = process.env.VODACOM_API_SECRET || "";
export const VODACOM_SHORTCODE = process.env.VODACOM_SHORTCODE || "";
export const VODACOM_PASSKEY = process.env.VODACOM_PASSKEY || "";

// Support
export const SUPPORT_PHONE = process.env.SUPPORT_PHONE || "+255123456789";
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@smartfundi.co.tz";

// Rate Limiting Configuration (requests per window)
export const RATE_LIMITS = {
  // Auth endpoints
  "auth/login": { maxRequests: 5, windowSeconds: 900 }, // 5 per 15 min
  "auth/register": { maxRequests: 5, windowSeconds: 900 }, // 5 per 15 min
  "auth/password-reset": { maxRequests: 3, windowSeconds: 3600 }, // 3 per hour
  "auth/verify": { maxRequests: 10, windowSeconds: 900 }, // 10 per 15 min
  
  // Payment endpoints
  "payments/mpesa": { maxRequests: 10, windowSeconds: 3600 }, // 10 per hour
  "payments/subscription": { maxRequests: 5, windowSeconds: 3600 }, // 5 per hour
  
  // Search endpoints
  "search/providers": { maxRequests: 30, windowSeconds: 60 }, // 30 per minute
  "search/shops": { maxRequests: 30, windowSeconds: 60 }, // 30 per minute
  
  // Chat/messaging
  "chat/messages": { maxRequests: 20, windowSeconds: 60 }, // 20 per minute
  "chat/conversations": { maxRequests: 30, windowSeconds: 60 }, // 30 per minute
  
  // Admin endpoints
  "admin/dashboard": { maxRequests: 100, windowSeconds: 3600 }, // 100 per hour
  "admin/users": { maxRequests: 50, windowSeconds: 3600 }, // 50 per hour
  "admin/reports": { maxRequests: 20, windowSeconds: 3600 }, // 20 per hour
  
  // General API
  "api/general": { maxRequests: 60, windowSeconds: 60 }, // 60 per minute
} as const;

// Password hashing configuration
export const BCRYPT_ROUNDS = 12;

// Session configuration
export const SESSION_COOKIE_NAME = "smart_fundi_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
export const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Validation settings
export const VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  password: {
    minLength: 8,
    maxLength: 128,
  },
  bio: {
    maxLength: 500,
  },
  nationalId: {
    minLength: 16,
  },
  phone: {
    pattern: /^\+255[67]\d{8}$/,
  },
};

// Subscription prices (in TZS)
export const SUBSCRIPTION_PRICES = {
  fundi: {
    monthly: 5000,
    trial_days: 30,
  },
  shop: {
    monthly: 15000,
    trial_days: 14,
  },
  promotion: {
    daily: 1500,
    max_slots: 3,
  },
  event: {
    per_event: 25000,
  },
} as const;

// File upload limits
export const FILE_LIMITS = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
} as const;

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
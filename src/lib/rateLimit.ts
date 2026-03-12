import { supabase } from "@/integrations/supabase/client";

// =====================================================
// RATE LIMITING CONFIGURATION
// =====================================================

export interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
}

// Rate limit configurations per endpoint
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints
  "auth/login": { maxRequests: 5, windowMinutes: 15 },
  "auth/register": { maxRequests: 5, windowMinutes: 15 },
  "auth/password-reset": { maxRequests: 3, windowMinutes: 60 },
  "auth/verify": { maxRequests: 10, windowMinutes: 15 },
  
  // Payment endpoints
  "payments/mpesa": { maxRequests: 10, windowMinutes: 60 },
  "payments/subscribe": { maxRequests: 5, windowMinutes: 60 },
  "payments/promote": { maxRequests: 10, windowMinutes: 60 },
  
  // Search endpoints
  "search/providers": { maxRequests: 30, windowMinutes: 1 },
  "search/shops": { maxRequests: 30, windowMinutes: 1 },
  
  // Messaging endpoints
  "messages/send": { maxRequests: 20, windowMinutes: 1 },
  "messages/list": { maxRequests: 60, windowMinutes: 1 },
  
  // Admin endpoints
  "admin/users": { maxRequests: 100, windowMinutes: 60 },
  "admin/verify": { maxRequests: 100, windowMinutes: 60 },
  "admin/reports": { maxRequests: 100, windowMinutes: 60 },
  
  // General API endpoints
  "api/profile": { maxRequests: 30, windowMinutes: 1 },
  "api/reviews": { maxRequests: 10, windowMinutes: 1 },
  
  // Default fallback
  "default": { maxRequests: 60, windowMinutes: 1 },
};

// =====================================================
// RATE LIMIT RESULT INTERFACE
// =====================================================

export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  maxRequests: number;
  remaining?: number;
  retryAfterSeconds?: number;
}

// =====================================================
// ERROR MESSAGES (Bilingual)
// =====================================================

export const RATE_LIMIT_MESSAGES = {
  exceeded: {
    en: "You have reached the request limit. Please try again after {minutes} minutes.",
    sw: "Umefikia kiwango cha maombi. Tafadhali jaribu tena baada ya dakika {minutes}.",
  },
  login: {
    en: "Too many login attempts. Please try again after {minutes} minutes.",
    sw: "Majaribio mengi ya kuingia. Tafadhali jaribu tena baada ya dakika {minutes}.",
  },
  payment: {
    en: "Too many payment requests. Please try again after {minutes} minutes.",
    sw: "Maombi mengi ya malipo. Tafadhali jaribu tena baada ya dakika {minutes}.",
  },
  message: {
    en: "You are sending messages too quickly. Please slow down.",
    sw: "Unatuma ujumbe haraka sana. Tafadhali punguza kasi.",
  },
};

// =====================================================
// RATE LIMITER CLASS
// =====================================================

export class RateLimiter {
  private endpoint: string;
  private config: RateLimitConfig;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.config = RATE_LIMITS[endpoint] || RATE_LIMITS["default"];
  }

  /**
   * Check if a request is allowed based on rate limits
   * Uses database-backed counters via Supabase RPC
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    try {
      const { data, error } = await supabase.rpc("check_rate_limit", {
        p_identifier: identifier,
        p_endpoint: this.endpoint,
        p_max_requests: this.config.maxRequests,
        p_window_minutes: this.config.windowMinutes,
      });

      if (error) {
        console.error("Rate limit check error:", error);
        // Fail open - allow request if rate limit check fails
        return {
          allowed: true,
          currentCount: 0,
          maxRequests: this.config.maxRequests,
          remaining: this.config.maxRequests,
        };
      }

      const result = data as {
        allowed: boolean;
        current_count: number;
        max_requests: number;
        remaining?: number;
        retry_after_seconds?: number;
      };

      return {
        allowed: result.allowed,
        currentCount: result.current_count,
        maxRequests: result.max_requests,
        remaining: result.remaining,
        retryAfterSeconds: result.retry_after_seconds,
      };
    } catch (err) {
      console.error("Rate limit check exception:", err);
      // Fail open
      return {
        allowed: true,
        currentCount: 0,
        maxRequests: this.config.maxRequests,
        remaining: this.config.maxRequests,
      };
    }
  }

  /**
   * Log a rate limit violation for admin review
   */
  async logViolation(
    identifier: string,
    ipAddress: string,
    userId?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await supabase.rpc("log_rate_limit_violation", {
        p_identifier: identifier,
        p_endpoint: this.endpoint,
        p_limit_exceeded: this.config.maxRequests,
        p_window_minutes: this.config.windowMinutes,
        p_ip_address: ipAddress,
        p_user_id: userId || null,
        p_user_agent: userAgent || null,
      });
    } catch (err) {
      console.error("Failed to log rate limit violation:", err);
    }
  }

  /**
   * Get rate limit error message
   */
  getErrorMessage(language: "en" | "sw" = "en", retryAfterSeconds?: number): string {
    const minutes = retryAfterSeconds ? Math.ceil(retryAfterSeconds / 60) : this.config.windowMinutes;
    
    let messageKey: keyof typeof RATE_LIMIT_MESSAGES = "exceeded";
    if (this.endpoint.startsWith("auth/login")) {
      messageKey = "login";
    } else if (this.endpoint.startsWith("payments/")) {
      messageKey = "payment";
    } else if (this.endpoint.startsWith("messages/")) {
      messageKey = "message";
    }

    return RATE_LIMIT_MESSAGES[messageKey][language].replace("{minutes}", minutes.toString());
  }

  /**
   * Get rate limit headers for response
   */
  getHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
      "X-RateLimit-Limit": this.config.maxRequests.toString(),
      "X-RateLimit-Remaining": (result.remaining || 0).toString(),
      "X-RateLimit-Reset": Math.ceil(Date.now() / 1000 + (this.config.windowMinutes * 60)).toString(),
    };

    if (result.retryAfterSeconds) {
      headers["Retry-After"] = result.retryAfterSeconds.toString();
    }

    return headers;
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Create a rate limiter for an endpoint
 */
export function createRateLimiter(endpoint: string): RateLimiter {
  return new RateLimiter(endpoint);
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

/**
 * Create rate limit identifier from IP and optional user ID
 */
export function createIdentifier(ip: string, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  return `ip:${ip}`;
}
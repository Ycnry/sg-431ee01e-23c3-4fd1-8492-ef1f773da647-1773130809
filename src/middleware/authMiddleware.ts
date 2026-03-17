import { NextApiRequest, NextApiResponse } from "next";
import { verifyAccessToken, type AuthUser } from "@/lib/auth";
import { createRateLimiter, getClientIp, createIdentifier } from "@/lib/rateLimit";
import { supabase } from "@/integrations/supabase/client";

// =====================================================
// EXTENDED REQUEST TYPE
// =====================================================

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthUser;
  clientIp: string;
}

// =====================================================
// MIDDLEWARE TYPES
// =====================================================

type NextApiHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void;

type MiddlewareOptions = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireVerified?: boolean;
  roles?: Array<"customer" | "fundi" | "shop" | "admin">;
  rateLimit?: string; // endpoint key for rate limiting
};

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

export function withAuth(handler: NextApiHandler, options: MiddlewareOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authReq = req as AuthenticatedRequest;
    authReq.clientIp = getClientIp(new Headers(req.headers as Record<string, string>));

    // Apply rate limiting if configured
    if (options.rateLimit) {
      const rateLimiter = createRateLimiter(options.rateLimit);
      const identifier = createIdentifier(authReq.clientIp, authReq.user?.id);
      const result = await rateLimiter.checkLimit(identifier);

      // Set rate limit headers
      const headers = rateLimiter.getHeaders(result);
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      if (!result.allowed) {
        // Log violation
        await rateLimiter.logViolation(
          identifier,
          authReq.clientIp,
          authReq.user?.id,
          req.headers["user-agent"] as string
        );

        const language = (req.headers["accept-language"]?.includes("sw") ? "sw" : "en") as "en" | "sw";
        return res.status(429).json({
          error: rateLimiter.getErrorMessage(language, result.retryAfterSeconds),
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: result.retryAfterSeconds,
        });
      }
    }

    // Extract token from cookies or Authorization header
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.access_token;
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.slice(7) 
      : cookieToken;

    if (token) {
      authReq.user = (await verifyAccessToken(token)) || undefined;
    }

    // Check if authentication is required
    if (options.requireAuth && !authReq.user) {
      return res.status(401).json({
        error: "Unahitaji kuingia / Authentication required",
        code: "UNAUTHORIZED",
      });
    }

    // Check admin role
    if (options.requireAdmin && authReq.user?.role !== "admin") {
      // Log unauthorized admin access attempt
      await logSecurityEvent(
        authReq.clientIp,
        authReq.user?.id,
        req.url || "",
        "admin_access_denied",
        "role",
        { attempted_role: authReq.user?.role }
      );

      return res.status(403).json({
        error: "Hauruhusiwi kufikia / Access forbidden",
        code: "FORBIDDEN",
      });
    }

    // Check role restrictions
    if (options.roles && authReq.user && !options.roles.includes(authReq.user.role)) {
      return res.status(403).json({
        error: "Hauruhusiwi kufikia / Access forbidden for your role",
        code: "ROLE_FORBIDDEN",
      });
    }

    // Check verification status
    if (options.requireVerified && authReq.user && !authReq.user.is_verified) {
      return res.status(403).json({
        error: "Akaunti yako haijathibitishwa / Account not verified",
        code: "UNVERIFIED",
      });
    }

    return handler(authReq, res);
  };
}

// =====================================================
// SECURITY EVENT LOGGING
// =====================================================

async function logSecurityEvent(
  ipAddress: string,
  userId: string | undefined,
  endpoint: string,
  errorType: string,
  fieldName: string,
  requestData?: Record<string, unknown>
): Promise<void> {
  try {
    await supabase.rpc("log_validation_failure", {
      p_user_id: userId || null,
      p_endpoint: endpoint,
      p_field_name: fieldName,
      p_error_type: errorType,
      p_ip_address: ipAddress,
      p_request_data: requestData || null,
    });
  } catch (err) {
    console.error("Failed to log security event:", err);
  }
}

// =====================================================
// VALIDATION MIDDLEWARE
// =====================================================

export function withValidation<T>(
  handler: NextApiHandler,
  schema: { parse: (data: unknown) => T },
  options: { bodyKey?: "body" | "query" } = { bodyKey: "body" }
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const dataToValidate = options.bodyKey === "query" ? req.query : req.body;
      schema.parse(dataToValidate);
      return handler(req, res);
    } catch (err) {
      const validationError = err as { errors?: Array<{ path: string[]; message: string }> };
      
      // Log validation failure
      await logSecurityEvent(
        req.headers["x-forwarded-for"]?.toString() || "unknown",
        (req as AuthenticatedRequest).user?.id,
        req.url || "",
        "validation_failure",
        validationError.errors?.[0]?.path.join(".") || "unknown",
        { errors: validationError.errors }
      );

      return res.status(400).json({
        error: "Data si sahihi / Invalid input data",
        code: "VALIDATION_ERROR",
        details: validationError.errors?.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
}

// =====================================================
// COMBINED MIDDLEWARE
// =====================================================

export function withSecureApi(
  handler: NextApiHandler,
  options: MiddlewareOptions & { 
    schema?: { parse: (data: unknown) => unknown };
    bodyKey?: "body" | "query";
  } = {}
) {
  let wrappedHandler = handler;

  // Apply validation if schema provided
  if (options.schema) {
    wrappedHandler = withValidation(wrappedHandler, options.schema, { 
      bodyKey: options.bodyKey 
    }) as NextApiHandler;
  }

  // Apply auth middleware
  return withAuth(wrappedHandler, options);
}

// =====================================================
// CORS MIDDLEWARE
// =====================================================

export function withCors(handler: NextApiHandler, allowedOrigins: string[] = []) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const origin = req.headers.origin;
    
    // Set CORS headers
    if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    return handler(req, res);
  };
}
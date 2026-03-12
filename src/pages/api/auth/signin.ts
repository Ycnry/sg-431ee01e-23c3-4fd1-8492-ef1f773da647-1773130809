import type { NextApiResponse } from "next";
import { withSecureApi, type AuthenticatedRequest } from "@/middleware/authMiddleware";
import { loginSchema, sanitize } from "@/lib/validation";
import { loginUser } from "@/lib/auth";
import { getClientIp } from "@/lib/rateLimit";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Sanitize input
    const sanitizedBody = sanitize.object(req.body);
    
    // Validate input
    const validationResult = loginSchema.safeParse(sanitizedBody);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Data si sahihi / Invalid input data",
        code: "VALIDATION_ERROR",
        details: validationResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const data = validationResult.data;
    const ipAddress = getClientIp(new Headers(req.headers as Record<string, string>));

    // Login user
    const result = await loginUser(data, ipAddress);

    if (!result.success) {
      const statusCode = result.errorCode === "ACCOUNT_LOCKED" ? 423 : 401;
      return res.status(statusCode).json({
        error: result.error,
        code: result.errorCode,
      });
    }

    // Calculate cookie max age based on remember_me
    const accessMaxAge = 15 * 60; // 15 minutes
    const refreshMaxAge = data.remember_me 
      ? 30 * 24 * 60 * 60 // 30 days
      : 7 * 24 * 60 * 60; // 7 days

    // Set HttpOnly cookies for tokens
    const cookieOptions = [
      `access_token=${result.tokens?.accessToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/",
      `Max-Age=${accessMaxAge}`,
    ].join("; ");

    const refreshCookieOptions = [
      `refresh_token=${result.tokens?.refreshToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/api/auth",
      `Max-Age=${refreshMaxAge}`,
    ].join("; ");

    res.setHeader("Set-Cookie", [cookieOptions, refreshCookieOptions]);

    return res.status(200).json({
      success: true,
      user: result.user,
      message: "Umeingia kikamilifu / Login successful",
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      error: "Hitilafu ya ndani / Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export default withSecureApi(handler, {
  rateLimit: "auth/login",
});
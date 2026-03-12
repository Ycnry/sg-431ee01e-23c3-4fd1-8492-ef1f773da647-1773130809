import type { NextApiRequest, NextApiResponse } from "next";
import { withSecureApi, type AuthenticatedRequest } from "@/middleware/authMiddleware";
import { registrationSchema, sanitize } from "@/lib/validation";
import { registerUser } from "@/lib/auth";
import { getClientIp } from "@/lib/rateLimit";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Sanitize input
    const sanitizedBody = sanitize.object(req.body);
    
    // Validate input
    const validationResult = registrationSchema.safeParse(sanitizedBody);
    
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

    // Register user
    const result = await registerUser(data);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        code: result.errorCode,
      });
    }

    // Set HttpOnly cookies for tokens
    const cookieOptions = [
      `access_token=${result.tokens?.accessToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/",
      `Max-Age=${15 * 60}`, // 15 minutes
    ].join("; ");

    const refreshCookieOptions = [
      `refresh_token=${result.tokens?.refreshToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/api/auth",
      `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
    ].join("; ");

    res.setHeader("Set-Cookie", [cookieOptions, refreshCookieOptions]);

    return res.status(201).json({
      success: true,
      user: result.user,
      message: "Usajili umefanikiwa / Registration successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Hitilafu ya ndani / Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export default withSecureApi(handler, {
  rateLimit: "auth/register",
});
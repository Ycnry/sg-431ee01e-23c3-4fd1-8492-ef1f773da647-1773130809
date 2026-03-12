import type { NextApiResponse } from "next";
import { withSecureApi, type AuthenticatedRequest } from "@/middleware/authMiddleware";
import { supabase } from "@/integrations/supabase/client";
import { generateAccessToken, generateRefreshToken, hashRefreshToken, type AuthUser } from "@/lib/auth";
import type { EmailOtpType } from "@supabase/supabase-js";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, type = "magiclink" } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Tokeni inahitajika / Token required",
        code: "MISSING_TOKEN",
      });
    }

    // Validate OTP type
    const validEmailTypes: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];
    const otpType = validEmailTypes.includes(type as EmailOtpType) ? (type as EmailOtpType) : "magiclink";

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: otpType,
    });

    if (error || !data.user) {
      return res.status(400).json({
        error: "Tokeni si sahihi au imekwisha / Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("smart_fundi_users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      return res.status(404).json({
        error: "Wasifu haujapatikana / Profile not found",
        code: "PROFILE_NOT_FOUND",
      });
    }

    // Generate tokens
    const authUser: AuthUser = {
      id: profile.id,
      email: profile.email || undefined,
      phone: profile.phone || undefined,
      full_name: profile.full_name,
      role: profile.role as AuthUser["role"],
      verification_status: profile.verification_status as AuthUser["verification_status"],
      is_verified: profile.is_verified || false,
      avatar_url: profile.avatar_url || undefined,
      city: profile.city || undefined,
    };

    const accessToken = await generateAccessToken(authUser);
    const refreshToken = await generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabase.from("auth_sessions").insert({
      user_id: data.user.id,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt.toISOString(),
    });

    // Set cookies
    const cookieOptions = [
      `access_token=${accessToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/",
      `Max-Age=${15 * 60}`,
    ].join("; ");

    const refreshCookieOptions = [
      `refresh_token=${refreshToken}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/api/auth",
      `Max-Age=${7 * 24 * 60 * 60}`,
    ].join("; ");

    res.setHeader("Set-Cookie", [cookieOptions, refreshCookieOptions]);

    return res.status(200).json({
      success: true,
      user: authUser,
      message: "Uthibitisho umefanikiwa / Verification successful",
    });
  } catch (error) {
    console.error("Verify magic link error:", error);
    return res.status(500).json({
      error: "Hitilafu ya ndani / Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export default withSecureApi(handler, {
  rateLimit: "auth/verify",
});
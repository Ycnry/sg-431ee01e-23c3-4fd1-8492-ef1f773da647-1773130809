import type { NextApiResponse } from "next";
import { withSecureApi, type AuthenticatedRequest } from "@/middleware/authMiddleware";
import { emailSchema, phoneSchema, sanitize } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, phone } = sanitize.object(req.body) as { email?: string; phone?: string };

    if (email) {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        return res.status(400).json({
          error: "Barua pepe si sahihi / Invalid email format",
          code: "INVALID_EMAIL",
        });
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: emailResult.data,
      });

      if (error) {
        return res.status(400).json({
          error: error.message,
          code: "OTP_ERROR",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Kiungo kimetumwa kwa barua pepe / Magic link sent to email",
      });
    }

    if (phone) {
      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        return res.status(400).json({
          error: "Nambari ya simu si sahihi / Invalid phone format",
          code: "INVALID_PHONE",
        });
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneResult.data,
      });

      if (error) {
        return res.status(400).json({
          error: error.message,
          code: "OTP_ERROR",
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP imetumwa kwa simu / OTP sent to phone",
      });
    }

    return res.status(400).json({
      error: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone",
      code: "MISSING_IDENTIFIER",
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return res.status(500).json({
      error: "Hitilafu ya ndani / Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export default withSecureApi(handler, {
  rateLimit: "auth/password-reset",
});
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

    if (!email && !phone) {
      return res.status(400).json({
        error: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone",
        code: "MISSING_IDENTIFIER",
      });
    }

    // Check for existing user
    let query = supabase.from("smart_fundi_users").select("id, email, phone");

    if (email) {
      // Validate email format
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        return res.status(400).json({
          error: "Barua pepe si sahihi / Invalid email format",
          code: "INVALID_EMAIL",
        });
      }
      query = query.eq("email", emailResult.data);
    }

    if (phone) {
      // Validate phone format
      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        return res.status(400).json({
          error: "Nambari ya simu si sahihi / Invalid phone format",
          code: "INVALID_PHONE",
        });
      }
      query = query.eq("phone", phoneResult.data);
    }

    const { data: existingUsers, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Hitilafu ya hifadhidata / Database error",
        code: "DATABASE_ERROR",
      });
    }

    const isDuplicate = existingUsers && existingUsers.length > 0;
    const duplicateField = isDuplicate
      ? existingUsers[0].email === email
        ? "email"
        : "phone"
      : null;

    return res.status(200).json({
      isDuplicate,
      duplicateField,
      message: isDuplicate
        ? `${duplicateField === "email" ? "Barua pepe" : "Nambari ya simu"} tayari inatumika / ${duplicateField === "email" ? "Email" : "Phone"} already in use`
        : "Haipatikani / Not found",
    });
  } catch (error) {
    console.error("Check duplicate error:", error);
    return res.status(500).json({
      error: "Hitilafu ya ndani / Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export default withSecureApi(handler, {
  rateLimit: "auth/verify",
});
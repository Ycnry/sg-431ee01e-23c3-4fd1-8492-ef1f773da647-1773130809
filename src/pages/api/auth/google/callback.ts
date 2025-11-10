
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect("/auth/signin?error=oauth_failed");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return res.redirect("/auth/signin?error=oauth_not_configured");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return res.redirect("/auth/signin?error=token_exchange_failed");
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return res.redirect("/auth/signin?error=user_info_failed");
    }

    const userInfo = await userInfoResponse.json();

    const mockUser = {
      id: "google-" + userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      photo: userInfo.picture,
      createdAt: new Date().toISOString(),
    };

    const token = "mock-jwt-token-" + Math.random().toString(36);

    res.setHeader("Set-Cookie", [
      `smartfundi_user=${JSON.stringify(mockUser)}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `smartfundi_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    ]);

    return res.redirect("/?auth=success");
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return res.redirect("/auth/signin?error=oauth_error");
  }
}

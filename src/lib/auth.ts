import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import type { Registration, Login } from "./validation";
import type { Tables } from "@/integrations/supabase/types";

// =====================================================
// AUTHENTICATION CONFIGURATION
// =====================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smart-fundi-jwt-secret-key-change-in-production"
);
const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REMEMBER_ME_EXPIRY_DAYS = 30;

// =====================================================
// TYPES
// =====================================================

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  role: "customer" | "fundi" | "shop" | "admin";
  verification_status: "pending" | "verified" | "rejected";
  is_verified: boolean;
  avatar_url?: string;
  city?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
  error?: string;
  errorCode?: string;
}

type SmartFundiUser = Tables<"smart_fundi_users">;

// =====================================================
// PASSWORD HASHING
// =====================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =====================================================
// JWT TOKEN GENERATION
// =====================================================

export async function generateAccessToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    name: user.full_name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuer("smart-fundi")
    .setAudience("smart-fundi-app")
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(): Promise<string> {
  return uuidv4();
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

// =====================================================
// JWT TOKEN VERIFICATION
// =====================================================

export async function verifyAccessToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "smart-fundi",
      audience: "smart-fundi-app",
    });

    return {
      id: payload.sub as string,
      email: payload.email as string | undefined,
      phone: payload.phone as string | undefined,
      full_name: payload.name as string,
      role: payload.role as AuthUser["role"],
      verification_status: "verified",
      is_verified: true,
    };
  } catch {
    return null;
  }
}

// =====================================================
// USER REGISTRATION
// =====================================================

export async function registerUser(data: Registration): Promise<AuthResult> {
  try {
    // Check for existing user
    const { data: existingUser } = await supabase
      .from("smart_fundi_users")
      .select("id")
      .or(`email.eq.${data.email},phone.eq.${data.phone}`)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "Mtumiaji tayari yuko / User already exists",
        errorCode: "USER_EXISTS",
      };
    }

    // Create user in Supabase Auth
    const authData = data.email
      ? { email: data.email, password: data.password }
      : { phone: data.phone, password: data.password };

    const { data: authUser, error: authError } = await supabase.auth.signUp(authData);

    if (authError || !authUser.user) {
      return {
        success: false,
        error: authError?.message || "Imeshindwa kujiandikisha / Registration failed",
        errorCode: "AUTH_ERROR",
      };
    }

    // Hash password for our custom storage
    const passwordHash = await hashPassword(data.password);

    // Prepare base user data
    const baseUserData: Partial<SmartFundiUser> = {
      id: authUser.user.id,
      email: data.email || null,
      phone: data.phone || null,
      full_name: data.full_name,
      role: data.role,
      city: data.city,
      ward: data.ward || null,
      password_hash: passwordHash,
      verification_status: data.role === "customer" ? "verified" : "pending",
      is_verified: data.role === "customer",
    };

    // Add role-specific fields
    if (data.role === "fundi") {
      baseUserData.specialty = data.specialty;
      baseUserData.bio = data.bio || null;
      baseUserData.whatsapp = data.whatsapp || null;
      baseUserData.national_id = data.national_id || null;
    } else if (data.role === "shop") {
      baseUserData.shop_name = data.shop_name;
      baseUserData.shop_categories = data.shop_categories;
      baseUserData.opening_hours = data.opening_hours || null;
      baseUserData.whatsapp = data.whatsapp || null;
    }

    // Insert into smart_fundi_users table
    const { error: insertError } = await supabase
      .from("smart_fundi_users")
      .insert({
        id: baseUserData.id!,
        full_name: baseUserData.full_name!,
        email: baseUserData.email,
        phone: baseUserData.phone,
        role: baseUserData.role,
        city: baseUserData.city,
        ward: baseUserData.ward,
        password_hash: baseUserData.password_hash,
        verification_status: baseUserData.verification_status,
        is_verified: baseUserData.is_verified,
        specialty: baseUserData.specialty,
        bio: baseUserData.bio,
        whatsapp: baseUserData.whatsapp,
        national_id: baseUserData.national_id,
        shop_name: baseUserData.shop_name,
        shop_categories: baseUserData.shop_categories,
        opening_hours: baseUserData.opening_hours,
      });

    if (insertError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return {
        success: false,
        error: "Imeshindwa kuunda wasifu / Failed to create profile",
        errorCode: "PROFILE_ERROR",
      };
    }

    // Generate tokens
    const user: AuthUser = {
      id: authUser.user.id,
      email: data.email,
      phone: data.phone,
      full_name: data.full_name,
      role: data.role,
      verification_status: data.role === "customer" ? "verified" : "pending",
      is_verified: data.role === "customer",
      city: data.city,
    };

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await supabase.from("auth_sessions").insert({
      user_id: authUser.user.id,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt.toISOString(),
    });

    return {
      success: true,
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt.getTime(),
      },
    };
  } catch (err) {
    console.error("Registration error:", err);
    return {
      success: false,
      error: "Hitilafu ya ndani / Internal error",
      errorCode: "INTERNAL_ERROR",
    };
  }
}

// =====================================================
// USER LOGIN
// =====================================================

export async function loginUser(data: Login, ipAddress?: string): Promise<AuthResult> {
  try {
    // Determine if identifier is email or phone
    const isEmail = data.identifier.includes("@");
    
    // Fetch user from database
    const { data: user, error: fetchError } = await supabase
      .from("smart_fundi_users")
      .select("*")
      .eq(isEmail ? "email" : "phone", isEmail ? data.identifier.toLowerCase() : data.identifier)
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        error: "Mtumiaji hajapatikana / User not found",
        errorCode: "USER_NOT_FOUND",
      };
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const lockedMinutes = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / 60000
      );
      return {
        success: false,
        error: `Akaunti imefungwa. Jaribu tena baada ya dakika ${lockedMinutes} / Account locked. Try again in ${lockedMinutes} minutes`,
        errorCode: "ACCOUNT_LOCKED",
      };
    }

    // Check if account is active
    if (!user.is_active) {
      return {
        success: false,
        error: "Akaunti imezimwa / Account is disabled",
        errorCode: "ACCOUNT_DISABLED",
      };
    }

    // Verify password
    if (!user.password_hash) {
      return {
        success: false,
        error: "Akaunti haina nenosiri / Account has no password set",
        errorCode: "NO_PASSWORD",
      };
    }

    const isValidPassword = await verifyPassword(data.password, user.password_hash);

    if (!isValidPassword) {
      // Increment failed login attempts
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      const updateData: Partial<SmartFundiUser> = {
        failed_login_attempts: newAttempts,
      };

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        updateData.locked_until = lockUntil.toISOString();
      }

      await supabase
        .from("smart_fundi_users")
        .update(updateData)
        .eq("id", user.id);

      return {
        success: false,
        error: "Nenosiri si sahihi / Invalid password",
        errorCode: "INVALID_PASSWORD",
      };
    }

    // Reset failed login attempts and update last login
    await supabase
      .from("smart_fundi_users")
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString(),
        last_login_ip: ipAddress || null,
      })
      .eq("id", user.id);

    // Generate tokens
    const authUser: AuthUser = {
      id: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      full_name: user.full_name,
      role: user.role as AuthUser["role"],
      verification_status: user.verification_status as AuthUser["verification_status"],
      is_verified: user.is_verified || false,
      avatar_url: user.avatar_url || undefined,
      city: user.city || undefined,
    };

    const accessToken = await generateAccessToken(authUser);
    const refreshToken = await generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    // Calculate expiry based on remember_me
    const expiresAt = new Date();
    if (data.remember_me) {
      expiresAt.setDate(expiresAt.getDate() + REMEMBER_ME_EXPIRY_DAYS);
    } else {
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    }

    // Store refresh token
    await supabase.from("auth_sessions").insert({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      remember_me: data.remember_me || false,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress || null,
    });

    return {
      success: true,
      user: authUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt.getTime(),
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      error: "Hitilafu ya ndani / Internal error",
      errorCode: "INTERNAL_ERROR",
    };
  }
}

// =====================================================
// REFRESH TOKEN
// =====================================================

export async function refreshAccessToken(refreshToken: string): Promise<AuthResult> {
  try {
    // Find all valid sessions for this user (we need to check the hash)
    const { data: sessions } = await supabase
      .from("auth_sessions")
      .select("*, smart_fundi_users(*)")
      .eq("is_valid", true)
      .gte("expires_at", new Date().toISOString());

    if (!sessions || sessions.length === 0) {
      return {
        success: false,
        error: "Kipindi kimekwisha / Session expired",
        errorCode: "SESSION_EXPIRED",
      };
    }

    // Find matching session
    let matchedSession: (typeof sessions)[0] | null = null;
    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.refresh_token_hash);
      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      return {
        success: false,
        error: "Tokeni si sahihi / Invalid token",
        errorCode: "INVALID_TOKEN",
      };
    }

    const userData = matchedSession.smart_fundi_users as SmartFundiUser | null;
    if (!userData || !userData.is_active) {
      return {
        success: false,
        error: "Akaunti imezimwa / Account is disabled",
        errorCode: "ACCOUNT_DISABLED",
      };
    }

    // Generate new access token
    const authUser: AuthUser = {
      id: userData.id,
      email: userData.email || undefined,
      phone: userData.phone || undefined,
      full_name: userData.full_name,
      role: userData.role as AuthUser["role"],
      verification_status: userData.verification_status as AuthUser["verification_status"],
      is_verified: userData.is_verified || false,
      avatar_url: userData.avatar_url || undefined,
      city: userData.city || undefined,
    };

    const accessToken = await generateAccessToken(authUser);

    // Update last_used_at
    await supabase
      .from("auth_sessions")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", matchedSession.id);

    return {
      success: true,
      user: authUser,
      tokens: {
        accessToken,
        refreshToken, // Return same refresh token
        expiresAt: new Date(matchedSession.expires_at).getTime(),
      },
    };
  } catch (err) {
    console.error("Refresh token error:", err);
    return {
      success: false,
      error: "Hitilafu ya ndani / Internal error",
      errorCode: "INTERNAL_ERROR",
    };
  }
}

// =====================================================
// LOGOUT
// =====================================================

export async function logoutUser(refreshToken: string): Promise<boolean> {
  try {
    const { data: sessions } = await supabase
      .from("auth_sessions")
      .select("id, refresh_token_hash")
      .eq("is_valid", true);

    if (!sessions) return true;

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.refresh_token_hash);
      if (isMatch) {
        await supabase
          .from("auth_sessions")
          .update({ is_valid: false })
          .eq("id", session.id);
        break;
      }
    }

    return true;
  } catch {
    return false;
  }
}

// =====================================================
// LOGOUT ALL SESSIONS
// =====================================================

export async function logoutAllSessions(userId: string): Promise<boolean> {
  try {
    await supabase
      .from("auth_sessions")
      .update({ is_valid: false })
      .eq("user_id", userId);
    return true;
  } catch {
    return false;
  }
}

// =====================================================
// CHECK ADMIN ROLE
// =====================================================

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

export function requireAdmin(user: AuthUser | null): void {
  if (!isAdmin(user)) {
    throw new Error("FORBIDDEN: Admin access required");
  }
}
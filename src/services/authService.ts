import { supabase } from "@/integrations/supabase/client";

// =====================================================
// AUTH SERVICE - CLIENT SIDE INTEGRATION
// =====================================================

export interface SignUpData {
  email?: string;
  phone?: string;
  password: string;
  full_name: string;
  role: "customer" | "fundi" | "shop";
  city: string;
  ward?: string;
  specialty?: string[];
  bio?: string;
  whatsapp?: string;
  national_id?: string;
  shop_name?: string;
  shop_categories?: string[];
  opening_hours?: Record<string, { open: string; close: string; closed?: boolean }>;
}

export interface SignInData {
  identifier: string; // email or phone
  password: string;
  remember_me?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    phone?: string;
    full_name: string;
    role: string;
    verification_status: string;
    is_verified: boolean;
    avatar_url?: string;
    city?: string;
  };
  error?: string;
  errorCode?: string;
}

/**
 * Get the current redirect URL for OAuth/magic links
 * Works for both localhost and deployed environments
 */
export function getRedirectUrl(path: string = "/auth/callback"): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  // Fallback for server-side
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${path}`;
}

/**
 * Sign up a new user via our secure API
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Include cookies
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Registration failed",
        errorCode: result.code,
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
      errorCode: "NETWORK_ERROR",
    };
  }
}

/**
 * Sign in an existing user via our secure API
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Include cookies
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Login failed",
        errorCode: result.code,
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
      errorCode: "NETWORK_ERROR",
    };
  }
}

/**
 * Check if email or phone is already registered
 */
export async function checkDuplicate(email?: string, phone?: string): Promise<{
  isDuplicate: boolean;
  duplicateField?: "email" | "phone";
  message?: string;
}> {
  try {
    const response = await fetch("/api/auth/check-duplicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone }),
    });

    const result = await response.json();

    return {
      isDuplicate: result.isDuplicate || false,
      duplicateField: result.duplicateField,
      message: result.message,
    };
  } catch (error) {
    console.error("Check duplicate error:", error);
    return {
      isDuplicate: false,
    };
  }
}

/**
 * Send a magic link or OTP for passwordless login
 */
export async function sendMagicLink(email?: string, phone?: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Magic link error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear our custom cookies by calling a logout endpoint
    // The cookies will be cleared server-side
    document.cookie = "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "refresh_token=; Path=/api/auth; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

/**
 * Get the current authenticated user from session
 */
export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    // Fetch user profile from our custom table
    const { data: profile } = await supabase
      .from("smart_fundi_users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email || undefined,
      phone: profile.phone || undefined,
      full_name: profile.full_name,
      role: profile.role,
      verification_status: profile.verification_status,
      is_verified: profile.is_verified || false,
      avatar_url: profile.avatar_url || undefined,
      city: profile.city || undefined,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthResponse["user"] | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}
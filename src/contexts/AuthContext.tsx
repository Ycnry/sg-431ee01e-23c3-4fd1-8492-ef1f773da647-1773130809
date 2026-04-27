import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, userType: "customer" | "fundi" | "shop" | "super_agent") => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function buildUserFromSupabase(authUserId: string, fallbackEmail: string): Promise<User> {
  const { data: profile, error } = await supabase
    .from("smart_fundi_users")
    .select("*")
    .eq("id", authUserId)
    .maybeSingle();

  if (error) {
    console.warn("[Auth] Profile fetch warning:", error.message);
  }

  const role = (profile?.role as User["user_type"]) || "customer";

  return {
    id: authUserId,
    email: profile?.email || fallbackEmail,
    name: profile?.full_name || fallbackEmail.split("@")[0],
    user_type: role,
    createdAt: profile?.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] State change:", event);
      if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem("smartfundi_user");
        localStorage.removeItem("smartfundi_token");
      } else if (session?.user && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        const userData = await buildUserFromSupabase(session.user.id, session.user.email || "");
        setUser(userData);
        localStorage.setItem("smartfundi_user", JSON.stringify(userData));
        localStorage.setItem("smartfundi_token", session.access_token);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData = await buildUserFromSupabase(session.user.id, session.user.email || "");
        setUser(userData);
        localStorage.setItem("smartfundi_user", JSON.stringify(userData));
        localStorage.setItem("smartfundi_token", session.access_token);
      } else {
        const storedUser = localStorage.getItem("smartfundi_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("[Auth] Status check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("[Auth] Sign in attempt for:", email);

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      console.error("[Auth] Supabase sign in failed:", {
        message: error.message,
        status: error.status,
        code: error.code,
        timestamp: new Date().toISOString(),
      });
      throw new Error(error.message || "Invalid credentials");
    }

    if (!data.user || !data.session) {
      throw new Error("Sign in failed - no user data returned");
    }

    console.log("[Auth] Supabase auth successful for user:", data.user.id);

    const userData = await buildUserFromSupabase(data.user.id, data.user.email || cleanEmail);
    setUser(userData);
    localStorage.setItem("smartfundi_user", JSON.stringify(userData));
    localStorage.setItem("smartfundi_token", data.session.access_token);

    console.log("[Auth] Sign in complete:", userData.email);
  };

  const signUp = async (name: string, email: string, password: string, userType: "customer" | "fundi" | "shop" | "super_agent") => {
    console.log("[Auth] Sign up attempt for:", email);

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: name,
          role: userType,
        },
      },
    });

    if (error) {
      console.error("[Auth] Supabase sign up failed:", error);
      throw new Error(error.message || "Sign up failed");
    }

    if (!data.user) {
      throw new Error("Sign up failed - no user data");
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from("smart_fundi_users")
      .insert({
        id: data.user.id,
        email: cleanEmail,
        full_name: name,
        role: userType,
        is_active: true,
        is_verified: false,
        verification_status: "pending",
      });

    if (profileError) {
      console.warn("[Auth] Profile creation warning:", profileError.message);
    }

    if (data.session) {
      const userData = await buildUserFromSupabase(data.user.id, cleanEmail);
      setUser(userData);
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      localStorage.setItem("smartfundi_token", data.session.access_token);
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error("[Auth] Google sign in error:", error);
      throw new Error(error.message);
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error("[Auth] Magic link error:", error);
      throw new Error(error.message);
    }

    console.log("[Auth] Magic link sent to:", email);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("smartfundi_user");
      localStorage.removeItem("smartfundi_token");
      window.location.href = "/";
    } catch (error) {
      console.error("[Auth] Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        sendMagicLink,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
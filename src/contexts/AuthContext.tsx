
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem("smartfundi_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[Auth] Attempting sign in for:", email);
      
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[Auth] Sign in response status:", response.status, response.statusText);

      // Parse response body (try JSON first, fall back to text)
      let responseData;
      const contentType = response.headers.get("content-type");
      
      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = { message: await response.text() };
        }
      } catch (parseError) {
        console.error("[Auth] Failed to parse response:", parseError);
        responseData = { message: "Invalid server response" };
      }

      console.log("[Auth] Sign in response body:", responseData);

      if (!response.ok) {
        // Detailed error logging
        console.error("[Auth] Sign in failed with details:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseData,
          errorCode: responseData.code || "UNKNOWN",
          errorMessage: responseData.error || responseData.message || "Unknown error",
          validationDetails: responseData.details || null,
          timestamp: new Date().toISOString(),
        });

        // Throw error with the most informative message available
        const errorMessage = 
          responseData.error || 
          responseData.message || 
          `Sign in failed (HTTP ${response.status}: ${response.statusText})`;
        
        throw new Error(errorMessage);
      }

      console.log("[Auth] Sign in successful for:", email);
      setUser(responseData.user);
      localStorage.setItem("smartfundi_user", JSON.stringify(responseData.user));
      localStorage.setItem("smartfundi_token", responseData.token);
    } catch (error) {
      console.error("[Auth] Sign in error caught:", {
        error,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string, userType: "customer" | "fundi" | "shop" | "super_agent") => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, userType }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Sign up failed");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("smartfundi_user", JSON.stringify(data.user));
      localStorage.setItem("smartfundi_token", data.token);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error("Google OAuth not configured");
      }

      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const scope = "openid profile email";
      const responseType = "code";
      const state = Math.random().toString(36).substring(7);

      localStorage.setItem("oauth_state", state);

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send magic link");
      }

      return await response.json();
    } catch (error) {
      console.error("Magic link error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem("smartfundi_user");
      localStorage.removeItem("smartfundi_token");
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
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


import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignInPage() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in attempt:", { email, password });
  };

  const metaTitle = language === "en" ? "Sign In - Smart Fundi" : "Ingia - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  {t("auth.signin.title") || "Sign In"}
                </CardTitle>
                <CardDescription className="text-center">
                  {t("auth.signin.subtitle") || "Enter your credentials to access your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t("auth.password") || "Password"}</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                        {t("auth.forgotPassword") || "Forgot password?"}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {t("auth.signin.button") || "Sign In"}
                  </Button>
                </form>
                
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    {t("auth.noAccount") || "Don't have an account?"}{" "}
                  </span>
                  <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                    {t("auth.signup.link") || "Sign Up"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

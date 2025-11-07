
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignUpPage() {
  const { t, language } = useLanguage();
  const [userType, setUserType] = useState<"customer" | "fundi" | "shop">("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt:", { ...formData, userType });
  };

  const metaTitle = language === "en" ? "Sign Up - Smart Fundi" : "Jisajili - Smart Fundi";

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
                  {t("auth.signup.title") || "Create Account"}
                </CardTitle>
                <CardDescription className="text-center">
                  {t("auth.signup.subtitle") || "Choose your account type and get started"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Label>{t("auth.accountType") || "I am a"}</Label>
                    <RadioGroup value={userType} onValueChange={(value: any) => setUserType(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="customer" id="customer" />
                        <Label htmlFor="customer" className="font-normal cursor-pointer">
                          {t("auth.customer") || "Customer (looking for services)"}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fundi" id="fundi" />
                        <Label htmlFor="fundi" className="font-normal cursor-pointer">
                          {t("auth.fundi") || "Fundi (technician)"}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shop" id="shop" />
                        <Label htmlFor="shop" className="font-normal cursor-pointer">
                          {t("auth.shop") || "Shop Owner"}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("auth.name") || "Full Name"}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phone") || "Phone Number"}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255712345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password") || "Password"}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("auth.confirmPassword") || "Confirm Password"}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {t("auth.signup.button") || "Create Account"}
                  </Button>
                </form>
                
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    {t("auth.hasAccount") || "Already have an account?"}{" "}
                  </span>
                  <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                    {t("auth.signin.link") || "Sign In"}
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


import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Chrome, Facebook } from "lucide-react";

export default function SignInPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement actual authentication when Firebase/Supabase is connected
    // For now, simulate with localStorage
    setTimeout(() => {
      const userData = {
        email,
        name: email.split("@")[0],
        phone: "",
        signInMethod: "email",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    // TODO: Implement Google OAuth when Firebase/Supabase is connected
    // Will extract: name, email, profile picture
    setTimeout(() => {
      const userData = {
        email: "demo@gmail.com",
        name: "Demo User",
        phone: "",
        signInMethod: "google",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleFacebookSignIn = () => {
    setLoading(true);
    // TODO: Implement Facebook OAuth when Firebase/Supabase is connected
    // Will extract: name, email, phone (if granted)
    setTimeout(() => {
      const userData = {
        email: "demo@facebook.com",
        name: "Facebook User",
        phone: "",
        signInMethod: "facebook",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const metaTitle = language === "en" ? "Sign In - Smart Fundi" : "Ingia - Smart Fundi";
  const metaDescription = language === "en" 
    ? "Sign in to Smart Fundi to connect with verified technicians across Tanzania"
    : "Ingia Smart Fundi kuwasiliana na mafundi halali kote Tanzania";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                  {language === "en" ? "Welcome Back" : "Karibu Tena"}
                </CardTitle>
                <CardDescription className="text-center">
                  {language === "en" 
                    ? "Sign in to access your Smart Fundi account" 
                    : "Ingia kufikia akaunti yako ya Smart Fundi"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Sign In Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 relative hover:bg-accent"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Chrome className="absolute left-4 h-5 w-5 text-red-500" />
                    <span className="font-medium">
                      {language === "en" ? "Continue with Google" : "Endelea na Google"}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 relative hover:bg-accent"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <Facebook className="absolute left-4 h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {language === "en" ? "Continue with Facebook" : "Endelea na Facebook"}
                    </span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {language === "en" ? "Or continue with email" : "Au endelea na barua pepe"}
                    </span>
                  </div>
                </div>

                {/* Email Sign In Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === "en" ? "Email Address" : "Barua Pepe"}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={language === "en" ? "you@example.com" : "wewe@mfano.com"}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">
                        {language === "en" ? "Password" : "Nenosiri"}
                      </Label>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {language === "en" ? "Forgot?" : "Umesahau?"}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                    disabled={loading}
                  >
                    {loading 
                      ? (language === "en" ? "Signing in..." : "Inaingia...") 
                      : (language === "en" ? "Sign In" : "Ingia")}
                  </Button>
                </form>
                
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Don't have an account?" : "Huna akaunti?"}{" "}
                  </span>
                  <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                    {language === "en" ? "Sign Up" : "Jisajili"}
                  </Link>
                </div>

                <div className="pt-4 text-xs text-center text-muted-foreground">
                  {language === "en" 
                    ? "By continuing, you agree to our Terms of Service and Privacy Policy" 
                    : "Kwa kuendelea, unakubali Masharti ya Huduma na Sera ya Faragha"}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

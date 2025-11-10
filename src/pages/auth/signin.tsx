
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, Wrench } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { signIn, signInWithGoogle, sendMagicLink } = useAuth();

  const [emailPassword, setEmailPassword] = useState({ email: "", password: "" });
  const [magicEmail, setMagicEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(emailPassword.email, emailPassword.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google sign in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setMagicLinkSent(false);

    try {
      await sendMagicLink(magicEmail);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const metaTitle = language === "en" ? "Sign In - Smart Fundi" : "Ingia - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl">
                <span className="text-blue-600">SMART</span>{" "}
                <span className="text-orange-500">FUNDI</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold mt-4">
              {language === "en" ? "Welcome Back" : "Karibu Tena"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "en" ? "Sign in to your account" : "Ingia kwenye akaunti yako"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Sign In" : "Ingia"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Choose your preferred sign in method" 
                  : "Chagua njia unayopendelea ya kuingia"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="email" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">
                    {language === "en" ? "Email" : "Barua pepe"}
                  </TabsTrigger>
                  <TabsTrigger value="magic">
                    {language === "en" ? "Magic Link" : "Kiungo cha Ajabu"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "en" ? "Email" : "Barua pepe"}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={language === "en" ? "your@email.com" : "email@yako.com"}
                          value={emailPassword.email}
                          onChange={(e) => setEmailPassword({ ...emailPassword, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {language === "en" ? "Password" : "Nywila"}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={language === "en" ? "Enter your password" : "Weka nywila yako"}
                          value={emailPassword.password}
                          onChange={(e) => setEmailPassword({ ...emailPassword, password: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {language === "en" ? "Sign In" : "Ingia"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        {language === "en" ? "Or continue with" : "Au endelea na"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {language === "en" ? "Sign in with Google" : "Ingia na Google"}
                  </Button>
                </TabsContent>

                <TabsContent value="magic" className="space-y-4">
                  {magicLinkSent ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {language === "en"
                          ? "Magic link sent! Check your email and click the link to sign in."
                          : "Kiungo cha ajabu kimetumwa! Angalia barua pepe yako na bonyeza kiungo ili kuingia."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="magic-email">
                          {language === "en" ? "Email Address" : "Barua pepe"}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="magic-email"
                            type="email"
                            placeholder={language === "en" ? "your@email.com" : "email@yako.com"}
                            value={magicEmail}
                            onChange={(e) => setMagicEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {language === "en"
                            ? "We'll send you a magic link to sign in without a password"
                            : "Tutakutumia kiungo cha ajabu cha kuingia bila nywila"}
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {language === "en" ? "Send Magic Link" : "Tuma Kiungo cha Ajabu"}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {language === "en" ? "Don't have an account? " : "Huna akaunti? "}
                </span>
                <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  {language === "en" ? "Sign up" : "Jisajili"}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

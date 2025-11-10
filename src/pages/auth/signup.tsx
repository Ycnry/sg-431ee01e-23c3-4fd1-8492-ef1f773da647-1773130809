
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, Wrench, UserCircle, Store } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { signUp, signInWithGoogle, sendMagicLink } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer" as "customer" | "fundi" | "shop",
  });
  const [magicEmail, setMagicEmail] = useState("");
  const [magicUserType, setMagicUserType] = useState<"customer" | "fundi" | "shop">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "Nywila hazifanani");
      return;
    }

    if (formData.password.length < 6) {
      setError(language === "en" ? "Password must be at least 6 characters" : "Nywila lazima iwe angalau herufi 6");
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.name, formData.email, formData.password, formData.userType);
      router.push("/");
    } catch (err: any) {
      setError(err.message || (language === "en" ? "Sign up failed. Please try again." : "Kujisajili kumeshindikana. Tafadhali jaribu tena."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || (language === "en" ? "Google sign up failed. Please try again." : "Kujisajili kwa Google kumeshindikana. Tafadhali jaribu tena."));
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
      setError(err.message || (language === "en" ? "Failed to send magic link. Please try again." : "Imeshindikana kutuma kiungo cha ajabu. Tafadhali jaribu tena."));
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      value: "customer",
      label: language === "en" ? "Customer" : "Mteja",
      description: language === "en" ? "Looking for services" : "Unatafuta huduma",
      icon: UserCircle,
    },
    {
      value: "fundi",
      label: language === "en" ? "Fundi / Technician" : "Fundi / Mtaalamu",
      description: language === "en" ? "Provide skilled services" : "Toa huduma za ujuzi",
      icon: Wrench,
    },
    {
      value: "shop",
      label: language === "en" ? "Shop Owner" : "Mmiliki wa Duka",
      description: language === "en" ? "Hardware & tools supplier" : "Muuzaji wa vifaa na zana",
      icon: Store,
    },
  ];

  const metaTitle = language === "en" ? "Sign Up - Smart Fundi" : "Jisajili - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
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
              {language === "en" ? "Create Your Account" : "Fungua Akaunti Yako"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "en" ? "Join Smart Fundi community today" : "Jiunge na jamii ya Smart Fundi leo"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Sign Up" : "Jisajili"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Choose your preferred sign up method" 
                  : "Chagua njia unayopendelea ya kujisajili"}
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
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        {language === "en" ? "I am a..." : "Mimi ni..."}
                      </Label>
                      <RadioGroup
                        value={formData.userType}
                        onValueChange={(value: "customer" | "fundi" | "shop") =>
                          setFormData({ ...formData, userType: value })
                        }
                        className="grid gap-3"
                      >
                        {userTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div key={type.value} className="relative">
                              <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={type.value}
                                className="flex items-center gap-4 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer transition-all"
                              >
                                <Icon className="h-6 w-6 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium">{type.label}</p>
                                  <p className="text-sm text-muted-foreground">{type.description}</p>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === "en" ? "Full Name" : "Jina Kamili"}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder={language === "en" ? "John Doe" : "Jina Lako"}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">
                        {language === "en" ? "Email" : "Barua pepe"}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder={language === "en" ? "your@email.com" : "email@yako.com"}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">
                        {language === "en" ? "Password" : "Nywila"}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder={language === "en" ? "Create a password" : "Unda nywila"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        {language === "en" ? "Confirm Password" : "Thibitisha Nywila"}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder={language === "en" ? "Confirm your password" : "Thibitisha nywila yako"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {language === "en" ? "Create Account" : "Fungua Akaunti"}
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
                    onClick={handleGoogleSignUp}
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
                    {language === "en" ? "Sign up with Google" : "Jisajili na Google"}
                  </Button>
                </TabsContent>

                <TabsContent value="magic" className="space-y-4">
                  {magicLinkSent ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {language === "en"
                          ? "Magic link sent! Check your email and click the link to complete registration."
                          : "Kiungo cha ajabu kimetumwa! Angalia barua pepe yako na bonyeza kiungo ili kukamilisha usajili."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          {language === "en" ? "I am a..." : "Mimi ni..."}
                        </Label>
                        <RadioGroup
                          value={magicUserType}
                          onValueChange={(value: "customer" | "fundi" | "shop") => setMagicUserType(value)}
                          className="grid gap-3"
                        >
                          {userTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <div key={type.value} className="relative">
                                <RadioGroupItem
                                  value={type.value}
                                  id={`magic-${type.value}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`magic-${type.value}`}
                                  className="flex items-center gap-4 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer transition-all"
                                >
                                  <Icon className="h-6 w-6 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium">{type.label}</p>
                                    <p className="text-sm text-muted-foreground">{type.description}</p>
                                  </div>
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="magic-signup-email">
                          {language === "en" ? "Email Address" : "Barua pepe"}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="magic-signup-email"
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
                            ? "We'll send you a magic link to create your account without a password"
                            : "Tutakutumia kiungo cha ajabu cha kuunda akaunti bila nywila"}
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
                  {language === "en" ? "Already have an account? " : "Tayari una akaunti? "}
                </span>
                <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                  {language === "en" ? "Sign in" : "Ingia"}
                </Link>
              </div>

              {(formData.userType === "fundi" || formData.userType === "shop") && (
                <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                    {language === "en"
                      ? `${formData.userType === "fundi" ? "Fundi" : "Shop"} accounts require admin verification before appearing in search results. You'll receive an email once verified.`
                      : `Akaunti za ${formData.userType === "fundi" ? "mafundi" : "maduka"} zinahitaji kuthibitishwa na msimamizi kabla ya kuonekana katika matokeo ya utafutaji. Utapokea barua pepe baada ya kuthibitishwa.`}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

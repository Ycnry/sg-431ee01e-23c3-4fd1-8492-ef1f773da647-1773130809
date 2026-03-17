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
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, Wrench, UserCircle, Store, Upload, FileText } from "lucide-react";

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
    nationalIdNumber: "",
    idDocument: null as File | null,
    businessRegistrationNumber: "",
    physicalAddress: "",
    storefrontPhoto: null as File | null,
    businessLicense: null as File | null,
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

    if (formData.userType === "fundi") {
      if (!formData.nationalIdNumber && !formData.idDocument) {
        setError(language === "en" 
          ? "Please provide either a National ID Number or upload an identification document" 
          : "Tafadhali toa Nambari ya Kitambulisho cha Taifa au pakia hati ya kitambulisho");
        return;
      }

      try {
        const duplicateCheckResponse = await fetch("/api/auth/check-duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nationalIdNumber: formData.nationalIdNumber,
            phone: formData.email,
            idDocumentHash: formData.idDocument ? await generateFileHash(formData.idDocument) : null,
          }),
        });

        const duplicateResult = await duplicateCheckResponse.json();

        if (duplicateResult.isDuplicate) {
          setError(language === "en"
            ? "An account with this ID or phone number already exists. Please log in or contact support."
            : "Akaunti yenye kitambulisho hiki au nambari ya simu tayari ipo. Tafadhali ingia au wasiliana na msaada.");
          return;
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      }
    }

    if (formData.userType === "shop") {
      if (!formData.businessRegistrationNumber && !formData.storefrontPhoto) {
        setError(language === "en" 
          ? "Please provide either a Business Registration Number or upload a storefront photo" 
          : "Tafadhali toa Nambari ya Usajili wa Biashara au pakia picha ya duka");
        return;
      }

      try {
        const duplicateCheckResponse = await fetch("/api/auth/check-duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userType: "shop",
            businessName: formData.name,
            city: formData.email.split("@")[0],
            phone: formData.email,
            businessRegistrationNumber: formData.businessRegistrationNumber,
            storefrontPhotoHash: formData.storefrontPhoto ? await generateFileHash(formData.storefrontPhoto) : null,
          }),
        });

        const duplicateResult = await duplicateCheckResponse.json();

        if (duplicateResult.isDuplicate) {
          setError(language === "en"
            ? "A shop with this info already exists. Contact support if this is an error."
            : "Duka lenye taarifa hizi tayari lipo. Wasiliana na msaada ikiwa hii ni hitilafu.");
          return;
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      }
    }

    setLoading(true);

    try {
      await signUp(formData.name, formData.email, formData.password, formData.userType);
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (language === "en" ? "Sign up failed. Please try again." : "Kujisajili kumeshindikana. Tafadhali jaribu tena.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(language === "en" ? "File size must be less than 5MB" : "Ukubwa wa faili lazima uwe chini ya 5MB");
        return;
      }
      setFormData({ ...formData, idDocument: file });
    }
  };

  const handleStorefrontPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(language === "en" ? "File size must be less than 5MB" : "Ukubwa wa faili lazima uwe chini ya 5MB");
        return;
      }
      setFormData({ ...formData, storefrontPhoto: file });
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (language === "en" ? "Google sign up failed. Please try again." : "Kujisajili kwa Google kumeshindikana. Tafadhali jaribu tena.");
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (language === "en" ? "Failed to send magic link. Please try again." : "Imeshindikana kutuma kiungo cha ajabu. Tafadhali jaribu tena.");
      setError(errorMessage);
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
      label: language === "en" ? "Fundi" : "Fundi",
      description: language === "en" ? "Provide skilled services" : "Toa huduma za ujuzi",
      icon: Wrench,
    },
    {
      value: "shop",
      label: language === "en" ? "Shop" : "Duka",
      description: language === "en" ? "Sell tools & supplies" : "Uza zana na vifaa",
      icon: Store,
    },
  ];

  const metaTitle = language === "en" ? "Sign Up - Smart Fundi" : "Jisajili - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4 py-6 sm:py-12">
        <div className="w-full max-w-lg">
          {/* Logo Section - Mobile Optimized */}
          <div className="text-center mb-4 sm:mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-2 sm:mb-4">
              <div className="bg-blue-600 p-2 sm:p-3 rounded-lg">
                <Wrench className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-2xl">
                <span className="text-blue-600">SMART</span>{" "}
                <span className="text-orange-500">FUNDI</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-3xl font-bold mt-2 sm:mt-4">
              {language === "en" ? "Create Account" : "Fungua Akaunti"}
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground mt-1 sm:mt-2">
              {language === "en" ? "Join Smart Fundi today" : "Jiunge na Smart Fundi leo"}
            </p>
          </div>

          <Card className="shadow-lg border-0 sm:border">
            <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-xl">
                {language === "en" ? "Sign Up" : "Jisajili"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {language === "en" 
                  ? "Choose your sign up method" 
                  : "Chagua njia ya kujisajili"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              {error && (
                <Alert variant="destructive" className="mb-3 sm:mb-4">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <AlertDescription className="text-xs sm:text-sm ml-2">{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="email" className="space-y-3 sm:space-y-4">
                <TabsList className="grid w-full grid-cols-2 h-9 sm:h-11">
                  <TabsTrigger value="email" className="text-xs sm:text-sm">
                    {language === "en" ? "Email" : "Barua pepe"}
                  </TabsTrigger>
                  <TabsTrigger value="magic" className="text-xs sm:text-sm">
                    {language === "en" ? "Magic Link" : "Kiungo"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                    {/* User Type Selection - Mobile Optimized */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold">
                        {language === "en" ? "I am a..." : "Mimi ni..."}
                      </Label>
                      <RadioGroup
                        value={formData.userType}
                        onValueChange={(value: "customer" | "fundi" | "shop") =>
                          setFormData({ ...formData, userType: value })
                        }
                        className="grid grid-cols-3 gap-2"
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
                                className="flex flex-col items-center gap-1 rounded-lg border-2 border-muted bg-background p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer transition-all text-center"
                              >
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs sm:text-sm">
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
                          className="pl-10 h-9 sm:h-11 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-xs sm:text-sm">
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
                          className="pl-10 h-9 sm:h-11 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-password" className="text-xs sm:text-sm">
                          {language === "en" ? "Password" : "Nywila"}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10 h-9 sm:h-11 text-sm"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-password" className="text-xs sm:text-sm">
                          {language === "en" ? "Confirm" : "Thibitisha"}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="pl-10 h-9 sm:h-11 text-sm"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fundi Verification Section - Mobile Optimized */}
                    {formData.userType === "fundi" && (
                      <div className="space-y-3 p-3 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100">
                            {language === "en" ? "ID Verification" : "Uthibitisho wa Kitambulisho"}
                          </h3>
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label htmlFor="national-id" className="text-xs sm:text-sm">
                            {language === "en" ? "National ID (NIDA)" : "NIDA"}
                          </Label>
                          <Input
                            id="national-id"
                            type="text"
                            placeholder={language === "en" ? "NIDA number" : "Nambari ya NIDA"}
                            value={formData.nationalIdNumber}
                            onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                          {language === "en" ? "— OR —" : "— AU —"}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs sm:text-sm">
                            {language === "en" ? "Upload ID Document" : "Pakia Kitambulisho"}
                          </Label>
                          <div className="border-2 border-dashed rounded-lg p-3 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="id-document-upload"
                            />
                            <Label htmlFor="id-document-upload" className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild className="text-xs">
                                <span>
                                  {formData.idDocument 
                                    ? formData.idDocument.name.substring(0, 20) + "..."
                                    : (language === "en" ? "Choose File" : "Chagua Faili")}
                                </span>
                              </Button>
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shop Verification Section - Mobile Optimized */}
                    {formData.userType === "shop" && (
                      <div className="space-y-3 p-3 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-950">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <h3 className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-100">
                            {language === "en" ? "Shop Verification" : "Uthibitisho wa Duka"}
                          </h3>
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label htmlFor="business-registration" className="text-xs sm:text-sm">
                            {language === "en" ? "BRELA Number" : "Nambari ya BRELA"}
                          </Label>
                          <Input
                            id="business-registration"
                            type="text"
                            placeholder={language === "en" ? "Business registration" : "Usajili wa biashara"}
                            value={formData.businessRegistrationNumber || ""}
                            onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="physical-address" className="text-xs sm:text-sm">
                            {language === "en" ? "Address" : "Anwani"}
                          </Label>
                          <Input
                            id="physical-address"
                            type="text"
                            placeholder={language === "en" ? "Shop location" : "Mahali pa duka"}
                            value={formData.physicalAddress || ""}
                            onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs sm:text-sm">
                            {language === "en" ? "Storefront Photo" : "Picha ya Duka"}
                          </Label>
                          <div className="border-2 border-dashed rounded-lg p-3 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleStorefrontPhotoUpload}
                              className="hidden"
                              id="storefront-photo-upload"
                            />
                            <Label htmlFor="storefront-photo-upload" className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild className="text-xs">
                                <span>
                                  {formData.storefrontPhoto 
                                    ? formData.storefrontPhoto.name.substring(0, 20) + "..."
                                    : (language === "en" ? "Choose Photo" : "Chagua Picha")}
                                </span>
                              </Button>
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs sm:text-sm">
                            {language === "en" ? "Business License (Optional)" : "Leseni (Si lazima)"}
                          </Label>
                          <div className="border-2 border-dashed rounded-lg p-3 text-center">
                            <FileText className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    setError(language === "en" ? "File size must be less than 5MB" : "Ukubwa wa faili lazima uwe chini ya 5MB");
                                    return;
                                  }
                                  setFormData({ ...formData, businessLicense: file });
                                }
                              }}
                              className="hidden"
                              id="business-license-upload"
                            />
                            <Label htmlFor="business-license-upload" className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild className="text-xs">
                                <span>
                                  {formData.businessLicense 
                                    ? formData.businessLicense.name.substring(0, 20) + "..."
                                    : (language === "en" ? "Choose File" : "Chagua Faili")}
                                </span>
                              </Button>
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {language === "en" ? "Create Account" : "Fungua Akaunti"}
                    </Button>
                  </form>

                  <div className="relative my-3 sm:my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        {language === "en" ? "Or" : "Au"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 text-sm"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {language === "en" ? "Google" : "Google"}
                  </Button>
                </TabsContent>

                <TabsContent value="magic" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  {magicLinkSent ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <AlertDescription className="text-xs sm:text-sm text-green-800 dark:text-green-200 ml-2">
                        {language === "en"
                          ? "Magic link sent! Check your email."
                          : "Kiungo kimetumwa! Angalia barua pepe."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-3 sm:space-y-4">
                      {/* User Type for Magic Link */}
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-semibold">
                          {language === "en" ? "I am a..." : "Mimi ni..."}
                        </Label>
                        <RadioGroup
                          value={magicUserType}
                          onValueChange={(value: "customer" | "fundi" | "shop") => setMagicUserType(value)}
                          className="grid grid-cols-3 gap-2"
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
                                  className="flex flex-col items-center gap-1 rounded-lg border-2 border-muted bg-background p-2 sm:p-3 hover:bg-accent peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer transition-all text-center"
                                >
                                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                  <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="magic-signup-email" className="text-xs sm:text-sm">
                          {language === "en" ? "Email" : "Barua pepe"}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="magic-signup-email"
                            type="email"
                            placeholder={language === "en" ? "your@email.com" : "email@yako.com"}
                            value={magicEmail}
                            onChange={(e) => setMagicEmail(e.target.value)}
                            className="pl-10 h-9 sm:h-11 text-sm"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {language === "en"
                            ? "We'll send a magic link to create your account"
                            : "Tutakutumia kiungo cha kuunda akaunti"}
                        </p>
                      </div>

                      <Button type="submit" className="w-full h-10 sm:h-11 text-sm" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {language === "en" ? "Send Magic Link" : "Tuma Kiungo"}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  {language === "en" ? "Have an account? " : "Una akaunti? "}
                </span>
                <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                  {language === "en" ? "Sign in" : "Ingia"}
                </Link>
              </div>

              {(formData.userType === "fundi" || formData.userType === "shop") && (
                <Alert className="mt-3 sm:mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <AlertDescription className="text-xs text-blue-800 dark:text-blue-200 ml-2">
                    {language === "en"
                      ? `${formData.userType === "fundi" ? "Fundi" : "Shop"} accounts need admin verification.`
                      : `Akaunti za ${formData.userType === "fundi" ? "mafundi" : "maduka"} zinahitaji uthibitisho.`}
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
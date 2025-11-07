
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, User, Chrome, Facebook, Lock } from "lucide-react";

export default function SignUpPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [userType, setUserType] = useState<"customer" | "fundi" | "shop">("customer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(language === "en" ? "Passwords do not match" : "Nenosiri hazifanani");
      return;
    }

    setLoading(true);
    
    // TODO: Implement actual authentication when Firebase/Supabase is connected
    // For now, simulate with localStorage
    setTimeout(() => {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType,
        signInMethod: "email",
        createdAt: new Date().toISOString(),
        verified: false
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    setLoading(true);
    // TODO: Implement Google OAuth when Firebase/Supabase is connected
    // Will automatically extract: name, email, profile picture
    // Additional info (phone, user type) will be collected in a follow-up form
    setTimeout(() => {
      const userData = {
        name: "Demo Google User",
        email: "demo@gmail.com",
        phone: "",
        userType: "customer",
        signInMethod: "google",
        createdAt: new Date().toISOString(),
        verified: true
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleFacebookSignUp = () => {
    setLoading(true);
    // TODO: Implement Facebook OAuth when Firebase/Supabase is connected
    // Will extract: name, email, phone (if user grants permission)
    setTimeout(() => {
      const userData = {
        name: "Demo Facebook User",
        email: "demo@facebook.com",
        phone: "",
        userType: "customer",
        signInMethod: "facebook",
        createdAt: new Date().toISOString(),
        verified: true
      };
      localStorage.setItem("smartfundi_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const metaTitle = language === "en" ? "Sign Up - Smart Fundi" : "Jisajili - Smart Fundi";
  const metaDescription = language === "en" 
    ? "Create your Smart Fundi account and connect with verified technicians across Tanzania"
    : "Fungua akaunti yako ya Smart Fundi na wasiliana na mafundi halali kote Tanzania";

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
                  {language === "en" ? "Join Smart Fundi" : "Jiunge na Smart Fundi"}
                </CardTitle>
                <CardDescription className="text-center">
                  {language === "en" 
                    ? "Create your account to get started" 
                    : "Fungua akaunti yako kuanza"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Sign Up Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 relative hover:bg-accent"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    <Chrome className="absolute left-4 h-5 w-5 text-red-500" />
                    <span className="font-medium">
                      {language === "en" ? "Sign up with Google" : "Jisajili na Google"}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 relative hover:bg-accent"
                    onClick={handleFacebookSignUp}
                    disabled={loading}
                  >
                    <Facebook className="absolute left-4 h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {language === "en" ? "Sign up with Facebook" : "Jisajili na Facebook"}
                    </span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {language === "en" ? "Or sign up with email" : "Au jisajili na barua pepe"}
                    </span>
                  </div>
                </div>

                {/* Email Sign Up Form */}
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {language === "en" ? "I am a..." : "Mimi ni..."}
                    </Label>
                    <RadioGroup value={userType} onValueChange={(value: any) => setUserType(value)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="customer" id="customer" />
                        <Label htmlFor="customer" className="font-normal cursor-pointer flex-1">
                          {language === "en" ? "Customer (looking for services)" : "Mteja (anatafuta huduma)"}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="fundi" id="fundi" />
                        <Label htmlFor="fundi" className="font-normal cursor-pointer flex-1">
                          {language === "en" ? "Fundi (technician)" : "Fundi (mtaalamu)"}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="shop" id="shop" />
                        <Label htmlFor="shop" className="font-normal cursor-pointer flex-1">
                          {language === "en" ? "Shop Owner" : "Mmiliki wa Duka"}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {language === "en" ? "Full Name" : "Jina Kamili"}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={language === "en" ? "John Doe" : "Jina Lako"}
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === "en" ? "Phone Number" : "Namba ya Simu"}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 712 345 678"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {language === "en" ? "Password" : "Nenosiri"}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={language === "en" ? "Min. 8 characters" : "Angalau herufi 8"}
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={8}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {language === "en" ? "Confirm Password" : "Thibitisha Nenosiri"}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={language === "en" ? "Re-enter password" : "Ingiza tena nenosiri"}
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                    disabled={loading}
                  >
                    {loading 
                      ? (language === "en" ? "Creating account..." : "Inafungua akaunti...") 
                      : (language === "en" ? "Create Account" : "Fungua Akaunti")}
                  </Button>
                </form>
                
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Already have an account?" : "Tayari una akaunti?"}{" "}
                  </span>
                  <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                    {language === "en" ? "Sign In" : "Ingia"}
                  </Link>
                </div>

                <div className="pt-4 text-xs text-center text-muted-foreground">
                  {language === "en" 
                    ? "By signing up, you agree to our Terms of Service and Privacy Policy" 
                    : "Kwa kujisajili, unakubali Masharti ya Huduma na Sera ya Faragha"}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

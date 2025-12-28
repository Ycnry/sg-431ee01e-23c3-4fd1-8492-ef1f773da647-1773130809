import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { HelpSupport } from "@/components/HelpSupport";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, HelpCircle, Building2, Phone } from "lucide-react";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";

export default function HelpPage() {
  const { language } = useLanguage();
  const [hotline, setHotline] = useState("+255796381261");

  // Load hotline on mount
  useEffect(() => {
    setHotline(getSupportHotline());
  }, []);

  const metaTitle = language === "en" 
    ? "Help & Support - Smart Fundi" 
    : "Msaada na Usaidizi - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={language === "en" 
          ? "Get help with Smart Fundi - AI assistant and support hotline" 
          : "Pata msaada na Smart Fundi - Msaidizi wa AI na hotline ya msaada"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {language === "en" ? "Help & Support" : "Msaada na Usaidizi"}
            </h1>
            <p className="text-muted-foreground">
              {language === "en" 
                ? "Get instant help from our AI assistant or contact support directly" 
                : "Pata msaada wa haraka kutoka kwa msaidizi wetu wa AI au wasiliana na msaada moja kwa moja"}
            </p>
          </div>

          {/* Call Support Hotline */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-6 w-6 text-green-600" />
                {language === "en" ? "Need Human Support?" : "Unahitaji Msaada wa Mtu?"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Call our customer support hotline for immediate assistance"
                  : "Piga simu kwa hotline yetu ya huduma kwa wateja kupata msaada wa haraka"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "en" ? "Customer Support Hotline" : "Hotline ya Huduma kwa Wateja"}
                </p>
                <p className="text-3xl font-bold text-green-600 mb-4">
                  {formatPhoneNumber(hotline)}
                </p>
                <Button 
                  size="lg" 
                  onClick={callSupportHotline}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <Phone className="h-5 w-5 animate-pulse" />
                  {language === "en" ? "Call Support Now" : "Piga Simu Sasa"}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {language === "en"
                  ? "Available during business hours (Mon-Sat, 8AM-6PM EAT)"
                  : "Inapatikana wakati wa biashara (Jumatatu-Jumamosi, 8AM-6PM EAT)"}
              </p>
            </CardContent>
          </Card>

          {/* How to Pay Quick Link */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Wallet className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                <span className="break-words leading-tight">
                  {language === "en" ? "Need Help with Payments?" : "Unahitaji Msaada na Malipo?"}
                </span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm break-words leading-relaxed">
                {language === "en"
                  ? "Learn how to pay fundis and shops using mobile money or bank SIM banking"
                  : "Jifunze jinsi ya kulipa mafundi na maduka kwa kutumia pesa ya simu au SIM banking ya benki"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-3 md:px-6">
              <Link href="/how-to-pay" className="block">
                <Button size="lg" className="w-full gap-2 h-auto py-3 md:py-4 text-xs sm:text-sm md:text-base">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="break-words whitespace-normal leading-tight text-left flex-1">
                    {language === "en" 
                      ? "Mobile Money Guide (M-Pesa, Airtel, Tigo, Halotel)" 
                      : "Mwongozo wa Pesa ya Simu (M-Pesa, Airtel, Tigo, Halotel)"}
                  </span>
                </Button>
              </Link>
              <Link href="/how-to-pay-bank" className="block">
                <Button size="lg" variant="outline" className="w-full gap-2 h-auto py-3 md:py-4 text-xs sm:text-sm md:text-base">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="break-words whitespace-normal leading-tight text-left flex-1">
                    {language === "en" 
                      ? "Bank SIM Banking Guide (CRDB, NMB, NBC, TPB)" 
                      : "Mwongozo wa SIM Banking (CRDB, NMB, NBC, TPB)"}
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <HelpSupport />
        </main>

        <LiveChatWidget position="bottom-right" />
      </div>
    </>
  );
}

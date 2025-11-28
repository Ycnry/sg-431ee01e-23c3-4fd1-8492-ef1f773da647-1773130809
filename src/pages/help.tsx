import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { HelpSupport } from "@/components/HelpSupport";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, HelpCircle } from "lucide-react";

export default function HelpPage() {
  const { language } = useLanguage();

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

          {/* How to Pay Quick Link */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-blue-600" />
                {language === "en" ? "Need Help with Payments?" : "Unahitaji Msaada na Malipo?"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Learn how to pay fundis and shops using M-Pesa, Airtel Money, or Mixx by Yas"
                  : "Jifunze jinsi ya kulipa mafundi na maduka kwa kutumia M-Pesa, Airtel Money, au Mixx by Yas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/how-to-pay">
                <Button size="lg" className="w-full gap-2">
                  <Wallet className="h-5 w-5" />
                  {language === "en" ? "View Payment Guide" : "Angalia Mwongozo wa Malipo"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <HelpSupport />
        </main>
      </div>
    </>
  );
}

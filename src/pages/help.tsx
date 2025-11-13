
import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { HelpSupport } from "@/components/HelpSupport";
import { useLanguage } from "@/contexts/LanguageContext";

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

          <HelpSupport />
        </main>
      </div>
    </>
  );
}

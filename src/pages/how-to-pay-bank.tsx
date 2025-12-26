import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Building2, CreditCard, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Smartphone } from "lucide-react";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";

export default function HowToPayBankPage() {
  const { t } = useLanguage();
  const [expandedBank, setExpandedBank] = useState<string>("");
  const [supportHotline, setSupportHotline] = useState("");

  useEffect(() => {
    setSupportHotline(getSupportHotline());
  }, []);

  const banks = [
    {
      id: "crdb",
      name: "CRDB Bank - SimBanking",
      ussd: "*133#",
      icon: Building2,
      color: "bg-green-500",
      steps: [
        { key: "howToPayBank.crdb.step1", icon: Phone },
        { key: "howToPayBank.crdb.step2", icon: CreditCard },
        { key: "howToPayBank.crdb.step3", icon: ArrowRight },
        { key: "howToPayBank.crdb.step4", icon: ArrowRight },
        { key: "howToPayBank.crdb.step5", icon: Building2 },
        { key: "howToPayBank.crdb.step6", icon: CreditCard },
        { key: "howToPayBank.crdb.step7", icon: CreditCard },
        { key: "howToPayBank.crdb.step8", icon: CheckCircle2 },
        { key: "howToPayBank.crdb.step9", icon: CheckCircle2 },
      ],
    },
    {
      id: "nmb",
      name: "NMB Bank - Mkononi",
      ussd: "*131#",
      icon: Building2,
      color: "bg-blue-600",
      steps: [
        { key: "howToPayBank.nmb.step1", icon: Phone },
        { key: "howToPayBank.nmb.step2", icon: CreditCard },
        { key: "howToPayBank.nmb.step3", icon: ArrowRight },
        { key: "howToPayBank.nmb.step4", icon: ArrowRight },
        { key: "howToPayBank.nmb.step5", icon: Building2 },
        { key: "howToPayBank.nmb.step6", icon: CreditCard },
        { key: "howToPayBank.nmb.step7", icon: CreditCard },
        { key: "howToPayBank.nmb.step8", icon: CheckCircle2 },
        { key: "howToPayBank.nmb.step9", icon: CheckCircle2 },
      ],
    },
    {
      id: "nbc",
      name: "NBC - M-Benki",
      ussd: "*135#",
      icon: Building2,
      color: "bg-red-600",
      steps: [
        { key: "howToPayBank.nbc.step1", icon: Phone },
        { key: "howToPayBank.nbc.step2", icon: CreditCard },
        { key: "howToPayBank.nbc.step3", icon: ArrowRight },
        { key: "howToPayBank.nbc.step4", icon: ArrowRight },
        { key: "howToPayBank.nbc.step5", icon: Building2 },
        { key: "howToPayBank.nbc.step6", icon: CreditCard },
        { key: "howToPayBank.nbc.step7", icon: CreditCard },
        { key: "howToPayBank.nbc.step8", icon: CheckCircle2 },
        { key: "howToPayBank.nbc.step9", icon: CheckCircle2 },
      ],
    },
    {
      id: "tpb",
      name: "TPB Bank - Yote Bando",
      ussd: "*165#",
      icon: Building2,
      color: "bg-purple-600",
      steps: [
        { key: "howToPayBank.tpb.step1", icon: Phone },
        { key: "howToPayBank.tpb.step2", icon: CreditCard },
        { key: "howToPayBank.tpb.step3", icon: ArrowRight },
        { key: "howToPayBank.tpb.step4", icon: ArrowRight },
        { key: "howToPayBank.tpb.step5", icon: Building2 },
        { key: "howToPayBank.tpb.step6", icon: CreditCard },
        { key: "howToPayBank.tpb.step7", icon: CreditCard },
        { key: "howToPayBank.tpb.step8", icon: CheckCircle2 },
        { key: "howToPayBank.tpb.step9", icon: CheckCircle2 },
      ],
    },
  ];

  const tips = [
    { key: "howToPayBank.tips.tip1", icon: Phone },
    { key: "howToPayBank.tips.tip2", icon: AlertCircle },
    { key: "howToPayBank.tips.tip3", icon: CheckCircle2 },
    { key: "howToPayBank.tips.tip4", icon: AlertCircle },
    { key: "howToPayBank.tips.tip5", icon: Phone },
    { key: "howToPayBank.tips.tip6", icon: AlertCircle },
  ];

  return (
    <>
      <Head>
        <title>{t("howToPayBank.title")} | Smart Fundi</title>
        <meta name="description" content={t("howToPayBank.subtitle")} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("howToPayBank.common.businessNumber")}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
              {t("howToPayBank.title")}
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t("howToPayBank.subtitle")}
            </p>

            <Alert className="text-left bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-slate-700 dark:text-slate-300">
                {t("howToPayBank.intro")}
              </AlertDescription>
            </Alert>
          </div>

          {/* Bank Payment Methods */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {t("howToPayBank.common.businessNumber")}
            </h2>

            <Accordion type="single" collapsible value={expandedBank} onValueChange={setExpandedBank}>
              {banks.map((bank) => {
                const BankIcon = bank.icon;
                return (
                  <AccordionItem key={bank.id} value={bank.id} className="border rounded-xl mb-4 bg-white dark:bg-slate-800 shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <div className={`p-3 rounded-full ${bank.color}`}>
                          <BankIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-lg text-slate-800 dark:text-white">
                            {bank.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="font-mono">
                              {bank.ussd}
                            </Badge>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {t("howToPayBank.common.businessNumber")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-6 mt-4">
                        {/* Step-by-step instructions */}
                        <div className="space-y-4">
                          {bank.steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                              <div key={index} className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                  {index + 1}
                                </div>
                                <div className="flex-1 pt-1">
                                  <div className="flex items-start gap-3">
                                    <StepIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                                      {t(step.key)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Placeholder for USSD screen images */}
                        <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
                          <CardContent className="p-6 text-center">
                            <Phone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {t("howToPayBank.common.example")}: {bank.ussd} {t("howToPayBank.common.sms")}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Important Tips */}
          <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertCircle className="w-6 h-6" />
                {t("howToPayBank.tips.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tips.map((tip, index) => {
                  const TipIcon = tip.icon;
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <TipIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {t(tip.key)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Alternative Payment Methods */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                {t("howToPayBank.alternatives.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("howToPayBank.alternatives.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/how-to-pay">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t("howToPayBank.alternatives.link")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-8 text-center space-y-6">
              <HelpCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  {t("howToPay.needHelp")}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t("howToPay.contactSupport")}
                </p>
              </div>
              
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("language") === "en" ? "Customer Support Hotline" : "Hotline ya Huduma kwa Wateja"}
                </p>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  {formatPhoneNumber(supportHotline)}
                </p>
                <Button 
                  size="lg" 
                  onClick={callSupportHotline}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2 mb-3 hover:scale-105 transition-all duration-300 hover:shadow-xl group"
                >
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {t("language") === "en" ? "Call Support Now" : "Piga Simu Sasa"}
                </Button>
                <Link href="/help">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {t("nav.help")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

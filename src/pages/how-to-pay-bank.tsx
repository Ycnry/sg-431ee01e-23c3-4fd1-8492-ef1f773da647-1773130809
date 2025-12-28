import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Building2, CreditCard, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Smartphone, Hash, FileText, Lock } from "lucide-react";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";

export default function HowToPayBankPage() {
  const { t } = useLanguage();
  const [expandedBank, setExpandedBank] = useState<string>("crdb");
  const [supportHotline, setSupportHotline] = useState("");

  useEffect(() => {
    setSupportHotline(getSupportHotline());
  }, []);

  const banks = [
    {
      id: "crdb",
      name: "CRDB Bank",
      ussd: "*150*03#",
      color: "bg-green-600",
      icon: Building2,
      steps: [
        { key: "howToPayBank.crdb.step1", icon: Phone },
        { key: "howToPayBank.crdb.step2", icon: Lock },
        { key: "howToPayBank.crdb.step3", icon: Smartphone },
        { key: "howToPayBank.crdb.step4", icon: CreditCard },
        { key: "howToPayBank.crdb.step5", icon: Hash },
        { key: "howToPayBank.crdb.step6", icon: FileText },
        { key: "howToPayBank.crdb.step7", icon: CreditCard },
        { key: "howToPayBank.crdb.step8", icon: CheckCircle2 },
        { key: "howToPayBank.crdb.step9", icon: CheckCircle2 },
      ]
    },
    {
      id: "nmb",
      name: "NMB Bank",
      ussd: "*150*66#",
      color: "bg-blue-600",
      icon: Building2,
      steps: [
        { key: "howToPayBank.nmb.step1", icon: Phone },
        { key: "howToPayBank.nmb.step2", icon: Lock },
        { key: "howToPayBank.nmb.step3", icon: Smartphone },
        { key: "howToPayBank.nmb.step4", icon: CreditCard },
        { key: "howToPayBank.nmb.step5", icon: Hash },
        { key: "howToPayBank.nmb.step6", icon: FileText },
        { key: "howToPayBank.nmb.step7", icon: CreditCard },
        { key: "howToPayBank.nmb.step8", icon: CheckCircle2 },
        { key: "howToPayBank.nmb.step9", icon: CheckCircle2 },
      ]
    },
    {
      id: "nbc",
      name: "NBC Bank",
      ussd: "*150*55#",
      color: "bg-red-600",
      icon: Building2,
      steps: [
        { key: "howToPayBank.nbc.step1", icon: Phone },
        { key: "howToPayBank.nbc.step2", icon: Lock },
        { key: "howToPayBank.nbc.step3", icon: Smartphone },
        { key: "howToPayBank.nbc.step4", icon: CreditCard },
        { key: "howToPayBank.nbc.step5", icon: Hash },
        { key: "howToPayBank.nbc.step6", icon: FileText },
        { key: "howToPayBank.nbc.step7", icon: CreditCard },
        { key: "howToPayBank.nbc.step8", icon: CheckCircle2 },
        { key: "howToPayBank.nbc.step9", icon: CheckCircle2 },
      ]
    },
    {
      id: "azania",
      name: "Azania Bank",
      ussd: "*150*75#",
      color: "bg-purple-600",
      icon: Building2,
      steps: [
        { key: "howToPayBank.azania.step1", icon: Phone },
        { key: "howToPayBank.azania.step2", icon: Lock },
        { key: "howToPayBank.azania.step3", icon: Smartphone },
        { key: "howToPayBank.azania.step4", icon: CreditCard },
        { key: "howToPayBank.azania.step5", icon: Hash },
        { key: "howToPayBank.azania.step6", icon: FileText },
        { key: "howToPayBank.azania.step7", icon: CreditCard },
        { key: "howToPayBank.azania.step8", icon: CheckCircle2 },
        { key: "howToPayBank.azania.step9", icon: CheckCircle2 },
      ]
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
          <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4 px-2">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 md:px-4 py-2 rounded-full mb-3 md:mb-4">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300 break-words">
                {t("howToPayBank.common.businessNumber")}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent px-2 leading-tight">
              {t("howToPayBank.title")}
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-2 leading-relaxed">
              {t("howToPayBank.subtitle")}
            </p>

            <Alert className="text-left bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <AlertDescription className="text-xs md:text-sm text-slate-700 dark:text-slate-300 break-words">
                {t("howToPayBank.intro")}
              </AlertDescription>
            </Alert>
          </div>

          {/* Bank Payment Methods */}
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 px-2">
              <Building2 className="w-5 w-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
              <span className="break-words">{t("howToPayBank.common.businessNumber")}</span>
            </h2>

            <Accordion type="single" collapsible value={expandedBank} onValueChange={setExpandedBank}>
              {banks.map((bank) => {
                const BankIcon = bank.icon;
                return (
                  <AccordionItem key={bank.id} value={bank.id} className="border rounded-xl mb-4 bg-white dark:bg-slate-800 shadow-sm">
                    <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4 hover:no-underline">
                      <div className="flex items-center gap-3 md:gap-4 w-full">
                        <div className={`p-2 md:p-3 rounded-full ${bank.color} flex-shrink-0`}>
                          <BankIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-bold text-base md:text-lg text-slate-800 dark:text-white break-words">
                            {bank.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs break-all">
                              {bank.ussd}
                            </Badge>
                            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 break-words">
                              {t("howToPayBank.common.businessNumber")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                      <div className="space-y-4 md:space-y-6 mt-3 md:mt-4">
                        {/* Step-by-step instructions */}
                        <div className="space-y-3 md:space-y-4">
                          {bank.steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                              <div key={index} className="flex gap-3 md:gap-4 items-start">
                                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-md">
                                  {index + 1}
                                </div>
                                <div className="flex-1 pt-0.5 md:pt-1 min-w-0">
                                  <div className="flex items-start gap-2 md:gap-3">
                                    <StepIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                    <p className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-200 leading-relaxed break-words whitespace-normal">
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
                          <CardContent className="p-4 md:p-6 text-center">
                            <Phone className="w-10 h-10 md:w-12 md:h-12 text-slate-400 mx-auto mb-2 md:mb-3" />
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 break-words">
                              {t("howToPayBank.common.example")}: <span className="font-mono break-all">{bank.ussd}</span> {t("howToPayBank.common.sms")}
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
          <Card className="mb-6 md:mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100 text-base md:text-lg">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span className="break-words">{t("howToPayBank.tips.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <ul className="space-y-2 md:space-y-3">
                {tips.map((tip, index) => {
                  const TipIcon = tip.icon;
                  return (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <TipIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 break-words leading-relaxed flex-1">
                        {t(tip.key)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Alternative Payment Methods */}
          <Card className="mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                <span className="break-words">{t("howToPayBank.alternatives.title")}</span>
              </CardTitle>
              <CardDescription className="text-sm md:text-base break-words">
                {t("howToPayBank.alternatives.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <Link href="/how-to-pay">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg text-sm md:text-base">
                  <Smartphone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words flex-1">{t("howToPayBank.alternatives.link")}</span>
                  <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6 md:p-8 text-center space-y-4 md:space-y-6">
              <HelpCircle className="w-12 h-12 md:w-16 md:h-16 text-green-600 dark:text-green-400 mx-auto" />
              <div className="px-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 break-words">
                  {t("howToPay.needHelp")}
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 break-words">
                  {t("howToPay.contactSupport")}
                </p>
              </div>
              
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-muted-foreground mb-2 break-words">
                  {t("language") === "en" ? "Customer Support Hotline" : "Hotline ya Huduma kwa Wateja"}
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mb-3 md:mb-4 break-all">
                  {formatPhoneNumber(supportHotline)}
                </p>
                <Button 
                  size="lg" 
                  onClick={callSupportHotline}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2 mb-3 hover:scale-105 transition-all duration-300 hover:shadow-xl group text-sm md:text-base"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                  <span className="break-words">{t("language") === "en" ? "Call Support Now" : "Piga Simu Sasa"}</span>
                </Button>
                <Link href="/help">
                  <Button size="lg" variant="outline" className="w-full gap-2 text-sm md:text-base">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="break-words">{t("nav.help")}</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>

        <LiveChatWidget position="bottom-right" />
      </div>
    </>
  );
}
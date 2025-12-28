import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, HelpCircle, CheckCircle, ArrowRight, Phone, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";

export default function HowToPayPage() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string>("mpesa");
  const [supportHotline, setSupportHotline] = useState("");
  const [mpesaLogoError, setMpesaLogoError] = useState(false);

  useEffect(() => {
    setSupportHotline(getSupportHotline());
  }, []);

  const scrollToMethod = (id: string) => {
    setOpenSection(id);
    // Small timeout to allow accordion to open before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const paymentMethods = [
    {
      id: "mpesa",
      title: t("howToPay.mpesa.title"),
      icon: Smartphone,
      color: "bg-red-600",
      ussd: "*150*00#",
      logoPath: "/M-Pesa.jpeg",
      steps: [
        t("howToPay.mpesa.step1"),
        t("howToPay.mpesa.step2"),
        t("howToPay.mpesa.step3"),
        t("howToPay.mpesa.step4"),
        t("howToPay.mpesa.step5"),
        t("howToPay.mpesa.step6"),
        t("howToPay.mpesa.step7"),
        t("howToPay.mpesa.step8"),
      ],
      example: t("howToPay.mpesa.example"),
    },
    {
      id: "airtel",
      title: t("howToPay.airtel.title"),
      icon: CreditCard,
      color: "bg-red-500",
      ussd: "*150*60#",
      steps: [
        t("howToPay.airtel.step1"),
        t("howToPay.airtel.step2"),
        t("howToPay.airtel.step3"),
        t("howToPay.airtel.step4"),
        t("howToPay.airtel.step5"),
        t("howToPay.airtel.step6"),
        t("howToPay.airtel.step7"),
        t("howToPay.airtel.step8"),
      ],
      example: t("howToPay.airtel.example"),
    },
    {
      id: "mixx",
      title: t("howToPay.mixx.title"),
      icon: Zap,
      color: "bg-blue-600",
      ussd: "*150*01#",
      steps: [
        t("howToPay.mixx.step1"),
        t("howToPay.mixx.step2"),
        t("howToPay.mixx.step3"),
        t("howToPay.mixx.step4"),
        t("howToPay.mixx.step5"),
        t("howToPay.mixx.step6"),
        t("howToPay.mixx.step7"),
        t("howToPay.mixx.step8"),
      ],
      example: t("howToPay.mixx.example"),
    },
    {
      id: "halotel",
      title: t("howToPay.halotel.title"),
      icon: Phone,
      color: "bg-purple-600",
      ussd: "*150*88#",
      steps: [
        t("howToPay.halotel.step1"),
        t("howToPay.halotel.step2"),
        t("howToPay.halotel.step3"),
        t("howToPay.halotel.step4"),
        t("howToPay.halotel.step5"),
        t("howToPay.halotel.step6"),
        t("howToPay.halotel.step7"),
        t("howToPay.halotel.step8"),
      ],
      example: t("howToPay.halotel.example"),
    },
  ];

  const paymentTips = [
    t("howToPay.tips.tip1"),
    t("howToPay.tips.tip2"),
    t("howToPay.tips.tip3"),
    t("howToPay.tips.tip4"),
    t("howToPay.tips.tip5"),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 px-2">
          <Badge variant="outline" className="mb-3 md:mb-4 text-xs md:text-sm">
            {t("howToPay.common.step")} by {t("howToPay.common.step")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent px-2 leading-tight">
            {t("howToPay.title")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
            {t("howToPay.subtitle")}
          </p>
        </div>

        {/* Payment Methods Cards */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card
              key={method.id}
              className={`${method.color} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden`}
              onClick={() => scrollToMethod(method.id)}
            >
              <CardHeader className="p-4 md:p-6 text-center">
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  {/* Logo or Icon - Centered */}
                  <div className="flex items-center justify-center">
                    {method.id === "mpesa" && !mpesaLogoError ? (
                      <Image
                        src={method.logoPath!}
                        alt="M-Pesa Logo"
                        width={60}
                        height={60}
                        className="object-contain w-12 h-12 md:w-16 md:h-16"
                        onError={() => setMpesaLogoError(true)}
                        priority
                      />
                    ) : (
                      <Icon className="h-8 w-8 md:h-12 md:w-12 text-white" />
                    )}
                  </div>
                  
                  {/* Title - Below Logo */}
                  <div className="flex flex-col items-center gap-1">
                    <CardTitle className="text-base md:text-lg text-white font-bold">
                      {method.title}
                    </CardTitle>
                    <p className="text-xs md:text-sm text-white/90 font-mono">
                      {method.ussd}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
        </div>

        {/* Step-by-Step Instructions */}
        <Accordion type="single" value={openSection} onValueChange={setOpenSection} className="mb-6 md:mb-8">
          {paymentMethods.map((method, methodIndex) => {
            const Icon = method.icon;
            return (
              <AccordionItem id={method.id} key={method.id} value={method.id} className="border rounded-lg mb-4 overflow-hidden">
                <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 w-full">
                    {/* Logo or Icon Container - Fixed Width */}
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                      {method.id === "mpesa" && !mpesaLogoError ? (
                        <Image
                          src={method.logoPath!}
                          alt="M-Pesa Logo"
                          width={40}
                          height={40}
                          className="object-contain w-8 h-8 md:w-10 md:h-10"
                          onError={() => setMpesaLogoError(true)}
                          priority
                        />
                      ) : (
                        <Icon className="h-6 w-6 md:h-8 md:w-8" />
                      )}
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-base md:text-lg">{method.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-mono">{method.ussd}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4 md:space-y-6 mt-3 md:mt-4">
                    {/* Example Business Number */}
                    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                      <AlertDescription className="text-xs md:text-sm break-words">
                        <strong className="block mb-1">{t("howToPay.common.businessNumber")}:</strong>
                        <span className="font-mono break-all">{method.example}</span>
                      </AlertDescription>
                    </Alert>

                    {/* Steps */}
                    <div className="space-y-3 md:space-y-4">
                      {method.steps.map((step, index) => (
                        <div key={index} className="flex gap-3 md:gap-4 items-start group">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm md:text-base text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pt-1 md:pt-2 min-w-0">
                            <p className="text-sm md:text-base leading-relaxed break-words whitespace-normal">
                              {step}
                            </p>
                            {index < method.steps.length - 1 && (
                              <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mt-2 md:mt-3" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Success Indicator */}
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0" />
                      <p className="text-xs md:text-sm font-medium text-green-900 dark:text-green-100 break-words">
                        {t("howToPay.common.success")}! {t("howToPay.tips.tip2")}
                      </p>
                    </div>

                    {/* Placeholder for Screenshots */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4 md:mt-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-[9/16] bg-gradient-to-br from-muted to-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                        >
                          <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/40" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {t("howToPay.common.step")} {methodIndex + 1} - Screenshots coming soon
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Payment Tips Section */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-600 flex-shrink-0" />
              <span className="break-words">{t("howToPay.tips.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <ul className="space-y-2 md:space-y-3">
              {paymentTips.map((tip, index) => (
                <li key={index} className="flex gap-2 md:gap-3 items-start">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm leading-relaxed break-words flex-1">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Need Help Section */}
        <Card className="text-center bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0 mb-6 md:mb-8">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl md:text-2xl flex items-center justify-center gap-2 break-words">
              <HelpCircle className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span>{t("howToPay.needHelp")}</span>
            </CardTitle>
            <CardDescription className="text-white/90 text-sm md:text-base break-words">
              {t("howToPay.contactSupport")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
              <p className="text-xs md:text-sm text-white/80 mb-2 break-words">
                {t("howToPay.needHelp")} - {t("howToPay.contactSupport")}
              </p>
              <p className="text-xl md:text-2xl font-bold mb-3 md:mb-4 break-all">
                {formatPhoneNumber(supportHotline)}
              </p>
              <Button 
                size="lg" 
                onClick={callSupportHotline}
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2 hover:scale-105 transition-all duration-300 hover:shadow-xl group text-sm md:text-base"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                <span className="break-words">{t("howToPay.needHelp")}</span>
              </Button>
            </div>
            <div className="flex justify-center gap-3 md:gap-4">
              <Link href="/help">
                <Button size="lg" variant="secondary" className="gap-2 text-sm md:text-base">
                  <HelpCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="break-words">{t("nav.help")}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Payment: Bank SIM Banking */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0" />
              <span className="break-words">{t("howToPayBank.alternatives.title")}</span>
            </CardTitle>
            <CardDescription className="text-sm md:text-base break-words">
              {t("howToPayBank.alternatives.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <Link href="/how-to-pay-bank">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg text-sm md:text-base">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-words flex-1">{t("howToPayBank.alternatives.link")}</span>
                <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground px-2">
          <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
            {t("nav.home")}
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:text-primary transition-colors whitespace-nowrap">
            {t("nav.help")}
          </Link>
          <span>•</span>
          <Link href="/search" className="hover:text-primary transition-colors whitespace-nowrap">
            {t("nav.fundis")}
          </Link>
          <span>•</span>
          <Link href="/events" className="hover:text-primary transition-colors whitespace-nowrap">
            {t("nav.events")}
          </Link>
        </div>

        <LiveChatWidget position="bottom-right" />
      </main>
    </div>
  );
}
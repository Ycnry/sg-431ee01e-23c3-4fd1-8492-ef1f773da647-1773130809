import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, HelpCircle, CheckCircle, ArrowRight, Phone, Zap } from "lucide-react";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";
import { cn } from "@/lib/utils";

export default function HowToPayPage() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string>("mpesa");
  const supportHotline = getSupportHotline();

  const scrollToMethod = (id: string) => {
    setOpenSection(id);
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
      title: "M-Pesa",
      icon: Smartphone,
      color: "bg-green-600",
      ussd: "*150*00#",
      logoPath: "/M-Pesa.jpeg",
      steps: [
        t("howToPay.mpesa.step1") || "Dial *150*00# on your Vodacom line",
        t("howToPay.mpesa.step2") || "Select 'Lipa kwa M-Pesa'",
        t("howToPay.mpesa.step3") || "Select 'Enter Business Number'",
        t("howToPay.mpesa.step4") || "Enter the business number shown",
        t("howToPay.mpesa.step5") || "Enter the amount in TZS",
        t("howToPay.mpesa.step6") || "Enter reference (your phone number)",
        t("howToPay.mpesa.step7") || "Enter your M-Pesa PIN",
        t("howToPay.mpesa.step8") || "Confirm the payment",
      ],
      example: "Business No: 123456",
    },
    {
      id: "airtel",
      title: "Airtel Money",
      icon: CreditCard,
      color: "bg-red-600",
      ussd: "*150*60#",
      logoPath: "/airtel.jpg",
      steps: [
        t("howToPay.airtel.step1") || "Dial *150*60# on your Airtel line",
        t("howToPay.airtel.step2") || "Select 'Make Payments'",
        t("howToPay.airtel.step3") || "Select 'Pay Bill'",
        t("howToPay.airtel.step4") || "Enter the business number shown",
        t("howToPay.airtel.step5") || "Enter the amount in TZS",
        t("howToPay.airtel.step6") || "Enter reference (your phone number)",
        t("howToPay.airtel.step7") || "Enter your Airtel Money PIN",
        t("howToPay.airtel.step8") || "Confirm the payment",
      ],
      example: "Business No: 789012",
    },
    {
      id: "tigopesa",
      title: "Tigo Pesa",
      icon: Zap,
      color: "bg-blue-600",
      ussd: "*150*01#",
      logoPath: "/Mixx_by_Yas-860x645-1.jpg",
      steps: [
        t("howToPay.tigo.step1") || "Dial *150*01# on your Tigo line",
        t("howToPay.tigo.step2") || "Select 'Pay Bills'",
        t("howToPay.tigo.step3") || "Select 'Enter Biller Code'",
        t("howToPay.tigo.step4") || "Enter the business number shown",
        t("howToPay.tigo.step5") || "Enter the amount in TZS",
        t("howToPay.tigo.step6") || "Enter reference (your phone number)",
        t("howToPay.tigo.step7") || "Enter your Tigo Pesa PIN",
        t("howToPay.tigo.step8") || "Confirm the payment",
      ],
      example: "Business No: 345678",
    },
    {
      id: "halopesa",
      title: "Halopesa",
      icon: Phone,
      color: "bg-orange-600",
      ussd: "*150*88#",
      logoPath: "/halopesa_tanzania_logo.jpg",
      steps: [
        t("howToPay.halo.step1") || "Dial *150*88# on your Halotel line",
        t("howToPay.halo.step2") || "Select 'Lipia Huduma'",
        t("howToPay.halo.step3") || "Select 'Business Payment'",
        t("howToPay.halo.step4") || "Enter the business number shown",
        t("howToPay.halo.step5") || "Enter the amount in TZS",
        t("howToPay.halo.step6") || "Enter reference (your phone number)",
        t("howToPay.halo.step7") || "Enter your Halopesa PIN",
        t("howToPay.halo.step8") || "Confirm the payment",
      ],
      example: "Business No: 901234",
    },
  ];

  const paymentTips = [
    t("howToPay.tips.tip1") || "Ensure you have sufficient balance before making payment",
    t("howToPay.tips.tip2") || "Double-check the business number before confirming",
    t("howToPay.tips.tip3") || "Keep your confirmation SMS as proof of payment",
    t("howToPay.tips.tip4") || "Contact support if payment doesn't reflect within 5 minutes",
    t("howToPay.tips.tip5") || "Never share your PIN with anyone",
  ];

  return (
    <>
      <Head>
        <title>{t("howToPay.title") || "How to Pay"} | Smart Fundi</title>
        <meta name="description" content="Learn how to pay for Smart Fundi services using M-Pesa, Airtel Money, Tigo Pesa, or Halopesa" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <Header />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8">
            <Badge variant="outline" className="mb-3 text-xs">
              {t("howToPay.badge") || "Payment Guide"}
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent leading-tight px-2">
              {t("howToPay.title") || "How to Pay"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              {t("howToPay.subtitle") || "Choose your preferred mobile money service and follow the simple steps below"}
            </p>
          </div>

          {/* Quick Selection Cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 active:scale-95 hover:shadow-md",
                    openSection === method.id && "ring-2 ring-primary"
                  )}
                  onClick={() => scrollToMethod(method.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center", method.color)}>
                        {method.logoPath ? (
                          <Image
                            src={method.logoPath}
                            alt={method.title}
                            width={32}
                            height={32}
                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{method.title}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{method.ussd}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Step-by-Step Instructions */}
          <Accordion type="single" value={openSection} onValueChange={setOpenSection} className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <AccordionItem
                  key={method.id}
                  id={method.id}
                  value={method.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0", method.color)}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm sm:text-base">{method.title}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{method.ussd}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 pb-4">
                    {/* Business Number Example */}
                    <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/50 border-blue-200">
                      <AlertDescription className="text-xs sm:text-sm">
                        <strong>{t("howToPay.example") || "Example"}:</strong> {method.example}
                      </AlertDescription>
                    </Alert>

                    {/* Steps */}
                    <div className="space-y-3">
                      {method.steps.map((step, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <p className="text-xs sm:text-sm pt-0.5 flex-1 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* Success Message */}
                    <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                        {t("howToPay.success") || "You will receive a confirmation SMS once payment is successful"}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Payment Tips */}
          <Card className="mt-6 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                {t("howToPay.tips.title") || "Payment Tips"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {paymentTips.map((tip, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Need Help Section */}
          <Card className="mt-6 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0">
            <CardContent className="p-4 sm:p-6 text-center">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {t("howToPay.needHelp") || "Need Help?"}
              </h3>
              <p className="text-sm text-white/90 mb-4">
                {t("howToPay.contactSupport") || "Our support team is available 24/7"}
              </p>
              <p className="text-xl sm:text-2xl font-bold mb-4 font-mono">
                {formatPhoneNumber(supportHotline)}
              </p>
              <Button
                size="lg"
                onClick={callSupportHotline}
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                <Phone className="w-4 h-4 mr-2" />
                {t("howToPay.callNow") || "Call Now"}
              </Button>
            </CardContent>
          </Card>

          {/* Bank Payment Link */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {t("howToPay.bankTitle") || "Prefer Bank Payment?"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("howToPay.bankDesc") || "You can also pay via bank transfer or SIM banking"}
                  </p>
                </div>
                <Link href="/how-to-pay-bank" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    {t("howToPay.viewBank") || "View Bank Options"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              {t("nav.home") || "Home"}
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-primary transition-colors">
              {t("nav.help") || "Help"}
            </Link>
            <span>•</span>
            <Link href="/search" className="hover:text-primary transition-colors">
              {t("nav.search") || "Search"}
            </Link>
          </div>
        </main>

        <LiveChatWidget position="bottom-right" />
        <BottomNavigation />
      </div>
    </>
  );
}
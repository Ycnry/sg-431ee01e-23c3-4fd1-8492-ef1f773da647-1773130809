import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, HelpCircle, CheckCircle, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { getSupportHotline, callSupportHotline, formatPhoneNumber } from "@/lib/settings";

export default function HowToPayPage() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string>("mpesa");
  const [supportHotline, setSupportHotline] = useState("");

  useEffect(() => {
    setSupportHotline(getSupportHotline());
  }, []);

  const paymentMethods = [
    {
      id: "mpesa",
      title: t("howToPay.mpesa.title"),
      icon: Smartphone,
      color: "bg-red-600",
      ussd: "*150#",
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
      icon: Phone,
      color: "bg-purple-600",
      ussd: "*150*88#",
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
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            {t("howToPay.common.step")} by {t("howToPay.common.step")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            {t("howToPay.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("howToPay.subtitle")}
          </p>
        </div>

        {/* Payment Methods Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  openSection === method.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setOpenSection(method.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`${method.color} w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription className="text-sm font-mono">
                    {method.ussd}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Step-by-Step Instructions */}
        <Accordion type="single" value={openSection} onValueChange={setOpenSection} className="mb-8">
          {paymentMethods.map((method, methodIndex) => {
            const Icon = method.icon;
            return (
              <AccordionItem key={method.id} value={method.id} className="border rounded-lg mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{method.ussd}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 mt-4">
                    {/* Example Business Number */}
                    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                      <AlertDescription className="text-sm">
                        <strong>{t("howToPay.common.businessNumber")}:</strong> {method.example}
                      </AlertDescription>
                    </Alert>

                    {/* Steps */}
                    <div className="space-y-4">
                      {method.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 items-start group">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="text-base leading-relaxed">{step}</p>
                            {index < method.steps.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground mt-3" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Success Indicator */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        {t("howToPay.common.success")}! {t("howToPay.tips.tip2")}
                      </p>
                    </div>

                    {/* Placeholder for Screenshots */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-[9/16] bg-gradient-to-br from-muted to-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                        >
                          <Smartphone className="h-8 w-8 text-muted-foreground/40" />
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
        <Card className="mb-8 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-600" />
              {t("howToPay.tips.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {paymentTips.map((tip, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Need Help Section */}
        <Card className="text-center bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6" />
              {t("howToPay.needHelp")}
            </CardTitle>
            <CardDescription className="text-white/90">
              {t("howToPay.contactSupport")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-white/80 mb-2">
                {t("howToPay.needHelp")} - {t("howToPay.contactSupport")}
              </p>
              <p className="text-2xl font-bold mb-4">
                {formatPhoneNumber(supportHotline)}
              </p>
              <Button 
                size="lg" 
                onClick={callSupportHotline}
                className="w-full bg-white text-blue-600 hover:bg-white/90 gap-2"
              >
                <Phone className="h-5 w-5" />
                {t("howToPay.needHelp")}
              </Button>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/help">
                <Button size="lg" variant="secondary" className="gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t("nav.help")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Payment: Bank SIM Banking */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-6 w-6 text-green-600" />
              {t("howToPayBank.alternatives.title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("howToPayBank.alternatives.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/how-to-pay-bank">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg">
                <Phone className="w-4 h-4 mr-2" />
                {t("howToPayBank.alternatives.link")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:text-primary transition-colors">
            {t("nav.help")}
          </Link>
          <span>•</span>
          <Link href="/search" className="hover:text-primary transition-colors">
            {t("nav.fundis")}
          </Link>
          <span>•</span>
          <Link href="/events" className="hover:text-primary transition-colors">
            {t("nav.events")}
          </Link>
        </div>
      </main>
    </div>
  );
}


import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Zap, Calendar } from "lucide-react";

export default function PromotePage() {
  const { language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState("daily");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const plans = [
    {
      id: "daily",
      name: language === "en" ? "Daily Promotion" : "Utangazaji wa Kila Siku",
      price: "1,500",
      duration: language === "en" ? "1 day" : "Siku 1",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "weekly",
      name: language === "en" ? "Weekly Promotion" : "Utangazaji wa Juma",
      price: "9,000",
      duration: language === "en" ? "7 days" : "Siku 7",
      icon: <Calendar className="h-5 w-5" />,
      savings: language === "en" ? "Save 1,500 TZS" : "Okoa 1,500 TZS",
    },
    {
      id: "monthly",
      name: language === "en" ? "Monthly Promotion" : "Utangazaji wa Mwezi",
      price: "35,000",
      duration: language === "en" ? "30 days" : "Siku 30",
      icon: <Star className="h-5 w-5" />,
      savings: language === "en" ? "Save 10,000 TZS" : "Okoa 10,000 TZS",
    },
  ];

  const handlePayment = () => {
    console.log("Processing payment:", { selectedPlan, paymentMethod });
  };

  const metaTitle = language === "en" ? "Promote Your Listing - Smart Fundi" : "Tangaza Wasifu Wako - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                {language === "en" ? "Promote Your Listing" : "Tangaza Wasifu Wako"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Get featured at the top of search results and increase your visibility"
                  : "Onekana juu ya matokeo ya utafutaji na ongeza mwonekano wako"}
              </p>
            </div>

            <div className="grid gap-6 mb-8">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id ? "border-blue-600 border-2" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600">
                          {plan.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.duration}</p>
                          {plan.savings && (
                            <Badge className="mt-1 bg-green-600">{plan.savings}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
                        <p className="text-sm text-muted-foreground">TZS</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Payment Method" : "Njia ya Malipo"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Choose your preferred payment method"
                    : "Chagua njia unayopendelea ya malipo"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">M-Pesa Tanzania</p>
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? "Mobile money payment" : "Malipo ya pesa kwa simu"}
                          </p>
                        </div>
                        <Badge>Recommended</Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">
                          {language === "en" ? "Credit/Debit Card" : "Kadi ya Mkopo/Debit"}
                        </p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handlePayment}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {language === "en" ? "Proceed to Payment" : "Endelea na Malipo"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

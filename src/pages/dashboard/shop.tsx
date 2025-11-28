import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Store, Upload, MessageSquare, CreditCard, Calendar, CheckCircle2, AlertCircle, HelpCircle, Wallet } from "lucide-react";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  lipaNumber?: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
}

export default function ShopDashboard() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  const [shopData, setShopData] = useState({
    shopName: "",
    description: "",
    openingHours: "",
    location: "",
  });

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Copper Pipe", price: "8,000" },
    { id: "2", name: "Switch", price: "3,500" },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "mpesa", name: "M-Pesa", enabled: true, lipaNumber: "123456" },
    { id: "airtel", name: "Airtel Money", enabled: true, lipaNumber: "789012" },
    { id: "mixx", name: "Mixx by Yas", enabled: false, lipaNumber: "" },
    { id: "cash", name: "Cash", enabled: true },
    { id: "bank", name: "Bank Transfer", enabled: true },
  ]);

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: true,
    expiryDate: "2025-12-11",
    amount: "15,000 TZS",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    const savedData = localStorage.getItem("shop_dashboard_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setShopData(parsed.shopData || shopData);
      setProducts(parsed.products || products);
      setPaymentMethods(parsed.paymentMethods || paymentMethods);
    }

    setLoading(false);
  }, [isAuthenticated, router]);

  const saveData = () => {
    localStorage.setItem("shop_dashboard_data", JSON.stringify({
      shopData,
      products,
      paymentMethods,
    }));
  };

  const handleShopDataChange = (field: string, value: string) => {
    setShopData({ ...shopData, [field]: value });
  };

  const handleProductChange = (id: string, field: string, value: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now().toString(), name: "", price: "" }]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, enabled: !pm.enabled } : pm
    ));
  };

  const updateLipaNumber = (id: string, lipaNumber: string) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, lipaNumber } : pm
    ));
  };

  const generatePaymentGuide = (method: PaymentMethod) => {
    if (!method.lipaNumber) return null;

    const guides = {
      mpesa: {
        en: `Go to M-Pesa → Lipa Na M-Pesa → Enter Business Number ${method.lipaNumber}`,
        sw: `Nenda kwenye M-Pesa → Lipa Na M-Pesa → Ingiza Nambari ya Biashara ${method.lipaNumber}`,
      },
      airtel: {
        en: `Go to Airtel Money → Lipa → Enter Paybill ${method.lipaNumber}`,
        sw: `Nenda kwenye Airtel Money → Lipa → Ingiza Paybill ${method.lipaNumber}`,
      },
      mixx: {
        en: `Open Mixx app → Pay → Enter Merchant Code ${method.lipaNumber}`,
        sw: `Fungua app ya Mixx → Lipa → Ingiza Nambari ya Merchant ${method.lipaNumber}`,
      },
    };

    return guides[method.id as keyof typeof guides]?.[language];
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>{language === "en" ? "Shop Dashboard - Smart Fundi" : "Dashibodi ya Duka - Smart Fundi"}</title>
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                {language === "en" ? "Shop Owner Dashboard" : "Dashibodi ya Mmiliki wa Duka"}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === "en" ? "Manage your shop profile and settings" : "Dhibiti wasifu na mipangilio ya duka lako"}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">
                    {language === "en" ? "Profile" : "Wasifu"}
                  </TabsTrigger>
                  <TabsTrigger value="products">
                    {language === "en" ? "Products" : "Bidhaa"}
                  </TabsTrigger>
                  <TabsTrigger value="payments">
                    {language === "en" ? "Payments" : "Malipo"}
                  </TabsTrigger>
                  <TabsTrigger value="messages">
                    {language === "en" ? "Messages" : "Ujumbe"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Shop Information" : "Taarifa za Duka"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{language === "en" ? "Shop Name" : "Jina la Duka"}</Label>
                        <Input
                          value={shopData.shopName}
                          onChange={(e) => handleShopDataChange("shopName", e.target.value)}
                          placeholder={language === "en" ? "Enter shop name" : "Weka jina la duka"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Description" : "Maelezo"}</Label>
                        <Textarea
                          value={shopData.description}
                          onChange={(e) => handleShopDataChange("description", e.target.value)}
                          placeholder={language === "en" ? "Describe your shop and services" : "Eleza duka lako na huduma zako"}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Opening Hours" : "Saa za Kufungua"}</Label>
                        <Input
                          value={shopData.openingHours}
                          onChange={(e) => handleShopDataChange("openingHours", e.target.value)}
                          placeholder="Mon-Sat: 8AM-6PM"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Location" : "Mahali"}</Label>
                        <Input
                          value={shopData.location}
                          onChange={(e) => handleShopDataChange("location", e.target.value)}
                          placeholder={language === "en" ? "City, Ward" : "Jiji, Kata"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Shop Logo" : "Nembo ya Duka"}</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? "Click to upload or drag and drop" : "Bonyeza kupakia au buruta na udondoshe"}
                          </p>
                          <Button variant="outline" className="mt-2" size="sm">
                            {language === "en" ? "Choose File" : "Chagua Faili"}
                          </Button>
                        </div>
                      </div>

                      <Button onClick={saveData} className="w-full">
                        {language === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Product Pricing" : "Bei za Bidhaa"}</CardTitle>
                      <CardDescription>
                        {language === "en" ? "Add and manage your product prices" : "Ongeza na dhibiti bei za bidhaa zako"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex gap-2">
                          <Input
                            value={product.name}
                            onChange={(e) => handleProductChange(product.id, "name", e.target.value)}
                            placeholder={language === "en" ? "Product name" : "Jina la bidhaa"}
                            className="flex-1"
                          />
                          <Input
                            value={product.price}
                            onChange={(e) => handleProductChange(product.id, "price", e.target.value)}
                            placeholder="TZS"
                            className="w-32"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}

                      <Button onClick={addProduct} variant="outline" className="w-full">
                        + {language === "en" ? "Add Product" : "Ongeza Bidhaa"}
                      </Button>

                      <Button onClick={saveData} className="w-full">
                        {language === "en" ? "Save Products" : "Hifadhi Bidhaa"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Payment Methods" : "Njia za Malipo"}</CardTitle>
                      <CardDescription>
                        {language === "en" ? "Configure how customers can pay you" : "Sanidi jinsi wateja wanavyoweza kukulipa"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              <span className="font-medium">{method.name}</span>
                            </div>
                            <Switch
                              checked={method.enabled}
                              onCheckedChange={() => togglePaymentMethod(method.id)}
                            />
                          </div>

                          {method.enabled && ["mpesa", "airtel", "mixx"].includes(method.id) && (
                            <div className="space-y-2">
                              <Label>
                                {language === "en" ? "Lipa Number" : "Nambari ya Lipa"}
                              </Label>
                              <Input
                                value={method.lipaNumber}
                                onChange={(e) => updateLipaNumber(method.id, e.target.value)}
                                placeholder={language === "en" ? "Enter your business number" : "Weka nambari ya biashara yako"}
                              />
                              {method.lipaNumber && (
                                <Alert className="mt-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription className="text-sm">
                                    <strong>{language === "en" ? "Payment Guide:" : "Mwongozo wa Malipo:"}</strong><br />
                                    {generatePaymentGuide(method)}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {language === "en" 
                            ? "These are direct payment methods. Customers will pay you directly using these options."
                            : "Hizi ni njia za malipo ya moja kwa moja. Wateja watakulipa moja kwa moja kwa kutumia chaguo hizi."}
                        </AlertDescription>
                      </Alert>

                      <Button onClick={saveData} className="w-full">
                        {language === "en" ? "Save Payment Methods" : "Hifadhi Njia za Malipo"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Customer Messages" : "Ujumbe wa Wateja"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {language === "en" ? "No messages yet" : "Hakuna ujumbe bado"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Subscription Status" : "Hali ya Usajili"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscriptionStatus.isActive ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "en" ? "Active" : "Inatumika"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Active until" : "Inatumika hadi"}
                        </p>
                        <p className="font-medium">{subscriptionStatus.expiryDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Monthly Fee" : "Ada ya Kila Mwezi"}
                        </p>
                        <p className="font-medium">{subscriptionStatus.amount}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "en" ? "Inactive" : "Haitumiki"}
                        </span>
                      </div>
                      <Button className="w-full">
                        {language === "en" ? "Renew Now" : "Rejea Sasa"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Quick Actions" : "Vitendo vya Haraka"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    {language === "en" ? "View Analytics" : "Angalia Takwimu"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {language === "en" ? "All Messages" : "Ujumbe Wote"}
                  </Button>
                  <Link href="/help" className="w-full">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <HelpCircle className="h-4 w-4" />
                      {language === "en" ? "Help & Support" : "Msaada na Usaidizi"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

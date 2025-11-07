import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MessageSquare, Phone, MapPin, Clock, Store, CheckCircle2, ShieldCheck, ShieldX } from "lucide-react";
import { mockShops } from "@/lib/mockData";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { Shop } from "@/types";

export default function ShopProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();

  const [shop, setShop] = useState<Shop | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    if (id) {
      const foundShop = mockShops.find((s) => s.id === id);
      setShop(foundShop || null);
      if (foundShop) {
        setIsPromoted(subscriptionDb.isUserPromoted(foundShop.id));
        setSubscriptionActive(subscriptionDb.isUserActiveAndValid(foundShop.id));
      }
    }
  }, [id]);

  if (!shop) {
    return <div>Loading...</div>;
  }

  const metaTitle = language === "en" 
    ? `${shop.name} - Hardware & Tools in ${shop.city} | Smart Fundi`
    : `${shop.name} - Vifaa na Zana ${shop.city} | Smart Fundi`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={`${shop.name} - Quality hardware and tools supplier in ${shop.city}, Tanzania`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg rounded-lg">
                      <AvatarImage src={shop.image || shop.logo} alt={shop.name} />
                      <AvatarFallback className="text-4xl rounded-lg">{shop.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{shop.name}</h1>
                        {shop.verified && (
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 gap-1.5 pl-2 pr-3">
                            <CheckCircle2 className="h-4 w-4" />
                            {t("common.verified")}
                          </Badge>
                        )}
                        {isPromoted && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {t("common.featured")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground">{shop.category}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{shop.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{shop.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({shop.reviewCount} {t("common.reviews")})
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {subscriptionActive ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <ShieldCheck className="h-4 w-4" /> Active Subscription
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-600">
                            <ShieldX className="h-4 w-4" /> Inactive Subscription
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {shop.name} is a trusted supplier of quality hardware, tools, and construction materials in {shop.city}. 
                  We provide a wide range of products for both professionals and DIY enthusiasts.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Product Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {shop.categories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-sm text-muted-foreground">{shop.openingHours}</p>
                </div>
              </div>

              {shop.subscriptionActive && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg mt-4">
                  <Store className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Active Premium Listing - Verified Business
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Shop</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button className="flex-1 gap-2 py-6 text-lg" variant="default">
                        <MessageSquare className="h-5 w-5" />
                        {t("action.message")}
                      </Button>
                      {shop.whatsapp && (
                        <Button className="flex-1 gap-2 py-6 text-lg" variant="outline">
                          <Phone className="h-5 w-5" />
                          {t("action.call")}
                        </Button>
                      )}
                    </div>
                     {isPromoted && (
                      <div className="text-center text-sm text-orange-600">
                        This shop is featured! Visit them for premium service.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    {language === "en" ? "Looking for a Fundi?" : "Unatafuta Fundi?"}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    {language === "en" 
                      ? "Connect with verified technicians who can install or repair your purchases"
                      : "Unganisha na mafundi wastahilifu wanaoweza kusanidi au kutengeneza vitu unavyonunua"}
                  </p>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-100">
                    {language === "en" ? "Find a Fundi" : "Tafuta Fundi"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

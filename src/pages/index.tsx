
import { useState, useEffect } from "react";
import Head from "next/head";
import { SplashScreen } from "@/components/SplashScreen";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { Header } from "@/components/Header";
import { FundiCard } from "@/components/FundiCard";
import { ShopCard } from "@/components/ShopCard";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Star, Shield, MessageSquare, TrendingUp, Users, MapPin, Wrench, Store } from "lucide-react";
import { mockFundis, mockShops, mockEvents } from "@/lib/mockData";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Dar es Salaam");

  useEffect(() => {
    setShowSplash(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowContent(true);
  };

  const cities = ["Dar es Salaam", "Arusha", "Mwanza"];
  
  const fundisByCity = cities.reduce((acc, city) => {
    acc[city] = mockFundis.filter(f => f.city === city).slice(0, 3);
    return acc;
  }, {} as Record<string, typeof mockFundis>);

  const shopsByCity = cities.reduce((acc, city) => {
    acc[city] = mockShops.filter(s => s.city === city).slice(0, 3);
    return acc;
  }, {} as Record<string, typeof mockShops>);

  const sponsoredEvents = mockEvents.filter(e => e.isSponsored);
  const upcomingEvents = mockEvents.slice(0, 3);

  const metaTitle = language === "en" 
    ? "Smart Fundi - Find Skilled Technicians in Tanzania" 
    : "Smart Fundi - Pata Mafundi Bora Tanzania";
  
  const metaDescription = language === "en"
    ? "Connect with verified electricians, plumbers, carpenters, mechanics and hardware stores across Tanzania. Fast, reliable, and affordable services."
    : "Wasiliana na mafundi halali wa umeme, mabomba, useremala, mitambo na maduka ya vifaa nchini Tanzania. Huduma za haraka, za kuaminika na za bei nafuu.";

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showWelcome) {
    return <WelcomeAnimation show={showWelcome} onComplete={handleWelcomeComplete} />;
  }

  if (!showContent) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-orange-500 hover:bg-orange-600">
                {language === "en" ? "Trusted by 10,000+ Customers" : "Waaminifu 10,000+ Wateja"}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {language === "en" ? "Welcome to Smart Fundi" : "Karibu Smart Fundi"}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                {language === "en" 
                  ? "Connect with verified technicians and hardware stores across Tanzania" 
                  : "Wasiliana na mafundi na maduka ya vifaa halali kote Tanzania"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Search className="mr-2 h-5 w-5" />
                    {language === "en" ? "Find Fundi" : "Pata Fundi"}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    {language === "en" ? "Become Provider" : "Kuwa Mtoa Huduma"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("features.verified.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("features.verified.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("features.messaging.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("features.messaging.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("features.reviews.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("features.reviews.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("features.local.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("features.local.description")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="fundis" className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">
                  {language === "en" ? "Best Fundis in Major Cities" : "Mafundi Bora Miji Mikubwa"}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                {language === "en" 
                  ? "Top-rated technicians across Tanzania's biggest cities" 
                  : "Mafundi bora zaidi miji mikubwa ya Tanzania"}
              </p>
              
              <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  {cities.map((city) => (
                    <TabsTrigger key={city} value={city} className="gap-2">
                      <MapPin className="h-4 w-4" />
                      {city}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {cities.map((city) => (
                  <TabsContent key={city} value={city}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {fundisByCity[city]?.length > 0 ? (
                        fundisByCity[city].map((fundi) => (
                          <FundiCard key={fundi.id} fundi={fundi} featured={fundi.promoted} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">
                            {language === "en" 
                              ? `No fundis available in ${city} yet` 
                              : `Hakuna mafundi ${city} bado`}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 text-center">
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    {language === "en" ? "View All Fundis" : "Ona Mafundi Wote"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="shops" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">
                  {language === "en" ? "Best Hardware Stores by City" : "Maduka Bora ya Vifaa kwa Jiji"}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                {language === "en" 
                  ? "Quality tool shops and building material suppliers" 
                  : "Maduka ya ubora ya zana na vifaa vya ujenzi"}
              </p>

              <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  {cities.map((city) => (
                    <TabsTrigger key={city} value={city} className="gap-2">
                      <MapPin className="h-4 w-4" />
                      {city}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {cities.map((city) => (
                  <TabsContent key={city} value={city}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shopsByCity[city]?.length > 0 ? (
                        shopsByCity[city].map((shop) => (
                          <ShopCard key={shop.id} shop={shop} featured={shop.promoted} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">
                            {language === "en" 
                              ? `No shops available in ${city} yet` 
                              : `Hakuna maduka ${city} bado`}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 text-center">
                <Link href="/search?type=shop">
                  <Button variant="outline" size="lg">
                    {language === "en" ? "View All Shops" : "Ona Maduka Yote"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {language === "en" ? "Biggest Events in Tanzania" : "Matukio Makubwa Tanzania"}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {language === "en" 
                    ? "Construction expos, tool fairs, and skills workshops" 
                    : "Maonyesho ya ujenzi, maonyesho ya zana, na warsha za ujuzi"}
                </p>
              </div>
              <Link href="/events">
                <Button variant="outline">
                  {language === "en" ? "View All Events" : "Ona Matukio Yote"}
                </Button>
              </Link>
            </div>

            {sponsoredEvents.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Badge className="bg-orange-500">
                    {language === "en" ? "Sponsored Events" : "Matukio Yaliyodhaminiwa"}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sponsoredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "Upcoming Events" : "Matukio Yanayokuja"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Join Smart Fundi Today" : "Jiunge na Smart Fundi Leo"}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === "en"
                ? "Are you a skilled technician or hardware shop owner? List your services and reach thousands of customers."
                : "Je, wewe ni fundi mwenye ujuzi au mmiliki wa duka la vifaa? Orodhesha huduma zako na fikia maelfu ya wateja."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?type=fundi">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  {language === "en" ? "Register as Fundi" : "Jisajili kama Fundi"}
                </Button>
              </Link>
              <Link href="/auth/signup?type=shop">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  {language === "en" ? "Register Your Shop" : "Sajili Duka Lako"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-muted py-8 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2025 Smart Fundi. {language === "en" ? "All rights reserved." : "Haki zote zimehifadhiwa."}</p>
          </div>
        </footer>
      </div>
    </>
  );
}

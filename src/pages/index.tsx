import { useState, useEffect } from "react";
import Head from "next/head";
import { SplashScreen } from "@/components/SplashScreen";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { Header } from "@/components/Header";
import { FundiCard } from "@/components/FundiCard";
import { ShopCard } from "@/components/ShopCard";
import { EventCard } from "@/components/EventCard";
import { SuperAgentCard } from "@/components/SuperAgentCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Shield, MessageSquare, TrendingUp, Users, MapPin, Wrench, Store } from "lucide-react";
import { mockFundis, mockShops, mockEvents, mockSuperAgents } from "@/lib/mockData";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();
  
  // Check sessionStorage to determine initial state
  const [showSplash, setShowSplash] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Dar es Salaam");

  useEffect(() => {
    // Check if splash has already been shown this session
    const splashShown = sessionStorage.getItem("smartfundi_splash_shown");
    
    if (splashShown === "true") {
      // Skip splash and welcome, go directly to content
      setShowSplash(false);
      setShowWelcome(false);
      setShowContent(true);
    } else {
      // First visit this session - show splash screen
      setShowSplash(true);
      setShowWelcome(false);
      setShowContent(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowContent(true);
    // Mark splash as shown for this session
    sessionStorage.setItem("smartfundi_splash_shown", "true");
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
  
  // Filter active super agents only
  const activeSuperAgents = mockSuperAgents.filter(sa => sa.subscriptionStatus === "active");

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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-background no-overflow-x">
        <Header />

        {/* Hero Section - Mobile Optimized */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center px-1">
              <Badge className="mb-3 sm:mb-4 bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">
                {language === "en" ? "Trusted by 10,000+ Customers" : "Waaminifu 10,000+ Wateja"}
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                {language === "en" ? "Welcome to Smart Fundi" : "Karibu Smart Fundi"}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 px-2">
                {language === "en" 
                  ? "Connect with verified technicians and hardware stores across Tanzania" 
                  : "Wasiliana na mafundi na maduka ya vifaa halali kote Tanzania"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <Link href="/search" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto h-12 sm:h-11 text-base">
                    <Search className="mr-2 h-5 w-5" />
                    {language === "en" ? "Find Fundi" : "Pata Fundi"}
                  </Button>
                </Link>
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto h-12 sm:h-11 text-base">
                    {language === "en" ? "Become Provider" : "Kuwa Mtoa Huduma"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile Grid */}
        <section className="py-10 sm:py-12 md:py-16 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:pt-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{t("features.verified.title")}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block">{t("features.verified.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:pt-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{t("features.messaging.title")}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block">{t("features.messaging.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:pt-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Store className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{t("features.reviews.title")}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block">{t("features.reviews.description")}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:pt-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{t("features.local.title")}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block">{t("features.local.description")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Super Agents Section - Mawakala Wakuu */}
        <section id="super-agents" className="py-10 sm:py-12 md:py-16">
          <div className="container">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 sm:p-2 rounded-lg shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {t("superAgent.title")}
                </h2>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs ml-2">
                  {language === "en" ? "Premium" : "Bora"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {t("superAgent.subtitle")}
              </p>
              
              {activeSuperAgents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSuperAgents.slice(0, 3).map((agent) => (
                    <SuperAgentCard 
                      key={agent.id} 
                      agent={agent}
                      onContact={(agent) => {
                        // Handle contact action
                        console.log("Contact agent:", agent.name);
                      }}
                      onViewProfile={(agent) => {
                        // Handle view profile action
                        console.log("View profile:", agent.name);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-card border border-border">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t("empty.superAgents.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-1">
                      {t("empty.superAgents.subtitle")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t("empty.superAgents.hint")}
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeSuperAgents.length > 3 && (
                <div className="mt-4 sm:mt-6 text-center">
                  <Link href="/super-agents">
                    <Button variant="outline" size="default" className="w-full sm:w-auto h-11 border-yellow-400 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20">
                      {language === "en" ? "View All Super Agents" : "Ona Mawakala Wakuu Wote"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mawakala Wakuu Section - Mobile Optimized */}
        <section id="mawakala-wakuu" className="py-10 sm:py-12 md:py-16 bg-muted/50">
          <div className="container">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-purple-600 p-1.5 sm:p-2 rounded-lg shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {language === "en" ? "Mawakala Wakuu" : "Mawakala Wakuu"}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {language === "en" 
                  ? "Top-rated technicians across Tanzania" 
                  : "Mafundi bora zaidi Tanzania"}
              </p>
              
              <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4 sm:mb-6 h-auto p-1">
                  {cities.map((city) => (
                    <TabsTrigger 
                      key={city} 
                      value={city} 
                      className="text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-3 data-[state=active]:text-primary"
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 shrink-0" />
                      <span className="truncate">{city.split(" ")[0]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {cities.map((city) => (
                  <TabsContent key={city} value={city}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fundisByCity[city]?.length > 0 ? (
                        fundisByCity[city].map((fundi) => (
                          <FundiCard key={fundi.id} fundi={fundi} featured={fundi.promoted} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 sm:py-12">
                          <p className="text-muted-foreground text-sm sm:text-base">
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

              <div className="mt-4 sm:mt-6 text-center">
                <Link href="/search">
                  <Button variant="outline" size="default" className="w-full sm:w-auto h-11">
                    {language === "en" ? "View All Fundis" : "Ona Mafundi Wote"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Shops Section - Mobile Optimized */}
        <section id="shops" className="py-10 sm:py-12 md:py-16 bg-muted/50">
          <div className="container">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg shrink-0">
                  <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {language === "en" ? "Hardware Stores" : "Maduka ya Vifaa"}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {language === "en" 
                  ? "Quality tool shops and building materials" 
                  : "Maduka bora ya zana na vifaa vya ujenzi"}
              </p>

              <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4 sm:mb-6 h-auto p-1">
                  {cities.map((city) => (
                    <TabsTrigger 
                      key={city} 
                      value={city} 
                      className="text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-3 data-[state=active]:text-primary"
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 shrink-0" />
                      <span className="truncate">{city.split(" ")[0]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {cities.map((city) => (
                  <TabsContent key={city} value={city}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shopsByCity[city]?.length > 0 ? (
                        shopsByCity[city].map((shop) => (
                          <ShopCard key={shop.id} shop={shop} featured={shop.promoted} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 sm:py-12">
                          <p className="text-muted-foreground text-sm sm:text-base">
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

              <div className="mt-4 sm:mt-6 text-center">
                <Link href="/search?type=shop">
                  <Button variant="outline" size="default" className="w-full sm:w-auto h-11">
                    {language === "en" ? "View All Shops" : "Ona Maduka Yote"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section - Mobile Optimized */}
        <section id="events" className="py-10 sm:py-12 md:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="bg-purple-600 p-1.5 sm:p-2 rounded-lg shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {language === "en" ? "Events" : "Matukio"}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {language === "en" 
                    ? "Construction expos and workshops" 
                    : "Maonyesho na warsha za ujenzi"}
                </p>
              </div>
              <Link href="/events" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-11">
                  {language === "en" ? "View All" : "Ona Yote"}
                </Button>
              </Link>
            </div>

            {sponsoredEvents.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Badge className="bg-orange-500 text-xs">
                    {language === "en" ? "Sponsored" : "Yaliyodhaminiwa"}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sponsoredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {language === "en" ? "Upcoming Events" : "Matukio Yanayokuja"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-blue-200" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              {language === "en" ? "Join Smart Fundi Today" : "Jiunge na Smart Fundi Leo"}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              {language === "en"
                ? "Are you a skilled technician or hardware shop owner? List your services and reach thousands of customers."
                : "Je, wewe ni fundi au mmiliki wa duka la vifaa? Orodhesha huduma zako na fikia maelfu ya wateja."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link href="/auth/signup?type=fundi" className="w-full sm:w-auto">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto h-12 sm:h-11 text-base">
                  {language === "en" ? "Register as Fundi" : "Jisajili kama Fundi"}
                </Button>
              </Link>
              <Link href="/auth/signup?type=shop" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 w-full sm:w-auto h-12 sm:h-11 text-base">
                  {language === "en" ? "Register Your Shop" : "Sajili Duka Lako"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-6 sm:py-8 border-t pb-bottom-nav">
          <div className="container text-center text-muted-foreground">
            <p className="text-sm">&copy; 2026 Smart Fundi. {language === "en" ? "All rights reserved." : "Haki zote zimehifadhiwa."}</p>
          </div>
        </footer>

        {/* Bottom Navigation for Mobile */}
        <BottomNavigation />
        
        {/* Live Chat Widget */}
        <LiveChatWidget position="bottom-right" />
      </div>
    </>
  );
}
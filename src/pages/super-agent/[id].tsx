import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockSuperAgents, mockFundis, mockShops } from "@/lib/mockData";
import { 
  Shield, MapPin, Users, Store, Phone, MessageSquare, ArrowLeft, 
  CheckCircle2, TrendingUp, Mail, Calendar, Award, Sparkles,
  User, Building
} from "lucide-react";

export default function SuperAgentProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("fundis");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const agent = mockSuperAgents.find(a => a.id === id);

  // Mock onboarded fundis and shops (in real app, these would be filtered by agent)
  const onboardedFundis = mockFundis.slice(0, agent?.fundisOnboarded || 3);
  const onboardedShops = mockShops.slice(0, agent?.shopsOnboarded || 2);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setIsTabsSticky(tabsTop <= 60);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!agent) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pb-24 px-4">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {language === "en" ? "Super Agent Not Found" : "Wakala Mkuu Hapatikani"}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {language === "en" 
                ? "The super agent you're looking for doesn't exist or has been removed."
                : "Wakala mkuu unayemtafuta hayupo au ameondolewa."}
            </p>
            <Link href="/">
              <Button className="rounded-full">{language === "en" ? "Back to Home" : "Rudi Nyumbani"}</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const totalOnboarded = agent.fundisOnboarded + agent.shopsOnboarded;
  const initials = agent.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const isSubscriptionActive = agent.subscriptionStatus === "active";
  
  // Calculate months active (mock data)
  const monthsActive = 8;

  return (
    <>
      <Head>
        <title>{agent.name} - Smart Fundi Super Agent</title>
        <meta name="description" content={`Super Agent profile for ${agent.name} covering ${agent.region}`} />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-background pb-24">
        {/* Gold Verified Banner for Active Subscription */}
        {isSubscriptionActive && (
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 py-2 px-4">
            <div className="container flex items-center justify-center gap-2 text-white text-sm font-medium">
              <Award className="h-4 w-4" />
              <span>{language === "en" ? "Verified Super Agent" : "Wakala Mkuu Aliyethibitishwa"}</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Cover Banner - Deep Blue with Gold Accents */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
          {/* Decorative gold patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          
          {/* Gold accent lines */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500" />
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-yellow-400/10 blur-2xl" />
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-yellow-400/10 blur-3xl" />
          
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="absolute top-4 left-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "en" ? "Back" : "Rudi"}
          </Button>
        </div>

        {/* Profile Photo - Overlapping Cover */}
        <div className="relative px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative -mt-20 sm:-mt-24 flex flex-col items-center sm:items-start sm:flex-row gap-4">
              {/* Profile Photo with Gold Border */}
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full" />
                <Avatar className="relative h-32 w-32 sm:h-40 sm:w-40 border-4 border-background">
                  <AvatarImage src={agent.photo} alt={agent.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 text-4xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Verified badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Name and Info */}
              <div className="flex-1 text-center sm:text-left sm:pt-24">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-bold">{agent.name}</h1>
                  {agent.verified && (
                    <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                
                <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Shield className="h-3 w-3 mr-1" />
                  {t("superAgent.badge")}
                </Badge>

                <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">
                    {agent.region}
                    {agent.district && `, ${agent.district}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 mt-6">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-1 bg-card rounded-xl shadow-lg border overflow-hidden">
              <div className="text-center py-4 bg-background">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{agent.fundisOnboarded}</div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" />
                  {language === "en" ? "Fundis" : "Mafundi"}
                </div>
              </div>
              <div className="text-center py-4 bg-background border-x">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{agent.shopsOnboarded}</div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Store className="h-3 w-3" />
                  {language === "en" ? "Shops" : "Maduka"}
                </div>
              </div>
              <div className="text-center py-4 bg-background">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{monthsActive}</div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {language === "en" ? "Months" : "Miezi"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div 
          ref={tabsRef} 
          className={`mt-6 ${isTabsSticky ? "sticky top-[60px] z-40 bg-background shadow-md" : ""}`}
        >
          <div className="max-w-3xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/50 rounded-none border-b">
                <TabsTrigger 
                  value="fundis"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-600 rounded-none"
                >
                  <Users className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{language === "en" ? "My Fundis" : "Mafundi"}</span>
                  <span className="sm:hidden">{language === "en" ? "Fundis" : "Mafundi"}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="shops"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-600 rounded-none"
                >
                  <Store className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{language === "en" ? "My Shops" : "Maduka"}</span>
                  <span className="sm:hidden">{language === "en" ? "Shops" : "Maduka"}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="about"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-600 rounded-none"
                >
                  <User className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>{language === "en" ? "About" : "Kuhusu"}</span>
                </TabsTrigger>
              </TabsList>

              {/* My Fundis Tab */}
              <TabsContent value="fundis" className="mt-0 p-4">
                {onboardedFundis.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {onboardedFundis.map((fundi) => (
                      <Link key={fundi.id} href={`/fundi/${fundi.id}`}>
                        <div className="aspect-square relative rounded-xl overflow-hidden group cursor-pointer">
                          <img 
                            src={fundi.image || fundi.photo} 
                            alt={fundi.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium truncate">{fundi.name}</p>
                            <p className="text-white/70 text-[10px] truncate">{fundi.specialty}</p>
                          </div>
                          {fundi.verified && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === "en" ? "No Fundis Yet" : "Hakuna Mafundi Bado"}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      {language === "en" 
                        ? "This super agent hasn't onboarded any fundis yet."
                        : "Wakala huyu hajaongeza mafundi wowote bado."}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* My Shops Tab */}
              <TabsContent value="shops" className="mt-0 p-4">
                {onboardedShops.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {onboardedShops.map((shop) => (
                      <Link key={shop.id} href={`/shop/${shop.id}`}>
                        <div className="aspect-square relative rounded-xl overflow-hidden group cursor-pointer">
                          <img 
                            src={shop.image || shop.logo} 
                            alt={shop.shopName || shop.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium truncate">{shop.shopName || shop.name}</p>
                            <p className="text-white/70 text-[10px] truncate">{shop.category}</p>
                          </div>
                          {shop.verified && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <Store className="h-12 w-12 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === "en" ? "No Shops Yet" : "Hakuna Maduka Bado"}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      {language === "en" 
                        ? "This super agent hasn't onboarded any shops yet."
                        : "Wakala huyu hajaongeza maduka yoyote bado."}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="mt-0 p-4">
                <div className="space-y-6 max-w-lg mx-auto">
                  {/* Bio Section */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-yellow-600" />
                      {language === "en" ? "About" : "Kuhusu"}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {agent.bio || (language === "en" 
                        ? "Dedicated Super Agent helping local fundis and shops grow their businesses through Smart Fundi platform."
                        : "Wakala Mkuu anayejitoa kusaidia mafundi na maduka ya mtaani kukuza biashara zao kupitia jukwaa la Smart Fundi.")}
                    </p>
                  </div>

                  {/* Coverage Area */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-yellow-600" />
                      {language === "en" ? "Coverage Area" : "Eneo la Huduma"}
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.region}</p>
                        {agent.district && (
                          <p className="text-sm text-muted-foreground">{agent.district}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      {language === "en" ? "Subscription Status" : "Hali ya Usajili"}
                    </h3>
                    <div className={`rounded-lg p-4 flex items-center justify-between ${
                      isSubscriptionActive 
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSubscriptionActive 
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}>
                          {isSubscriptionActive ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Shield className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          isSubscriptionActive ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                        }`}>
                          {isSubscriptionActive 
                            ? (language === "en" ? "Active" : "Hai")
                            : (language === "en" ? "Expired" : "Imeisha")}
                        </span>
                      </div>
                      <Badge className={
                        isSubscriptionActive 
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }>
                        {isSubscriptionActive 
                          ? (language === "en" ? "Premium" : "Premium")
                          : (language === "en" ? "Renew" : "Lipia")}
                      </Badge>
                    </div>
                  </div>

                  {/* Total Impact */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? "Total Onboarded" : "Jumla Walioongezwa"}
                          </p>
                          <p className="text-2xl font-bold text-yellow-600">{totalOnboarded}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {agent.phone && (
                      <Button variant="outline" className="w-full justify-start h-12 rounded-full">
                        <Phone className="h-4 w-4 mr-3 text-green-600" />
                        <span>{agent.phone}</span>
                      </Button>
                    )}
                    {agent.email && (
                      <Button variant="outline" className="w-full justify-start h-12 rounded-full">
                        <Mail className="h-4 w-4 mr-3 text-blue-600" />
                        <span className="truncate">{agent.email}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sticky Contact Button */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-30">
          <div className="max-w-3xl mx-auto">
            <Button 
              size="lg" 
              className="w-full h-14 text-base rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              {t("superAgent.contact")}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

import { useState, useEffect } from "react";
import Head from "next/head";
import { useLanguage } from "@/contexts/LanguageContext";
import { SplashScreen } from "@/components/SplashScreen";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { Header } from "@/components/Header";
import { FundiCard } from "@/components/FundiCard";
import { ShopCard } from "@/components/ShopCard";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { mockFundis, mockShops, mockEvents } from "@/lib/mockData";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("smartfundi_seen_intro");
    if (hasSeenIntro) {
      setShowSplash(false);
      setShowContent(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowContent(true);
    localStorage.setItem("smartfundi_seen_intro", "true");
  };

  const featuredFundis = mockFundis.filter((f) => f.promoted);
  const featuredShops = mockShops.filter((s) => s.promoted);
  const verifiedFundis = mockFundis.filter((f) => !f.promoted);

  const metaTitle = language === "en" 
    ? "Smart Fundi – Find Trusted Technicians in Tanzania" 
    : "Smart Fundi – Pata Fundi Bora Zaidi Tanzania";
  
  const metaDescription = language === "en"
    ? "Connect with verified fundis and quality hardware shops across Tanzania. Plumbers, electricians, carpenters, mechanics and more."
    : "Unganisha na mafundi wastahilifu na maduka ya ubora Tanzania nzima. Mabomba, umeme, useremala, magari na zaidi.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </Head>

      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {showWelcome && <WelcomeAnimation show={showWelcome} onComplete={handleWelcomeComplete} />}

      {showContent && (
        <div className="min-h-screen bg-background">
          <Header />

          <main>
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
              <div className="container mx-auto px-4 py-16 md:py-24 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    {t("home.hero.title")}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    {t("home.hero.subtitle")}
                  </p>
                  
                  <div className="flex gap-2 max-w-xl mx-auto mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder={t("home.hero.search")}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      {t("home.hero.findFundi")}
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <span className="text-muted-foreground">{t("common.specialty")}:</span>
                    {["Electrician", "Plumber", "Carpenter", "Mechanic", "Welder"].map((spec) => (
                      <button
                        key={spec}
                        className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border hover:border-blue-600 transition-colors"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {(featuredFundis.length > 0 || featuredShops.length > 0) && (
              <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{t("home.featured.title")}</h2>
                      <p className="text-muted-foreground">Premium verified professionals and shops</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredFundis.map((fundi) => (
                      <FundiCard key={fundi.id} fundi={fundi} featured />
                    ))}
                    {featuredShops.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} featured />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section id="fundis" className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{t("home.verified.title")}</h2>
                    <p className="text-muted-foreground">Skilled professionals ready to help</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    {t("common.loadMore")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {verifiedFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
                </div>
              </div>
            </section>

            <section id="shops" className="py-16 bg-background">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{t("home.shops.title")}</h2>
                    <p className="text-muted-foreground">Hardware stores and tool suppliers</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    {t("common.loadMore")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </div>
            </section>

            <section id="events" className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{t("home.events.title")}</h2>
                    <p className="text-muted-foreground">Workshops, training, and networking opportunities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>

            <footer className="bg-slate-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      SMART<span className="text-orange-400"> FUNDI</span>
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {t("splash.tagline")}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">For Customers</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Find a Fundi</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Browse Shops</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">View Events</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">For Professionals</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Register as Fundi</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Register Shop</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                  <p>© 2025 Smart Fundi. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      )}
    </>
  );
}

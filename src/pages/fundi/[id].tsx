import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFundis } from "@/lib/mockData";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { Fundi } from "@/types";
import { 
  Star, MapPin, CheckCircle2, Briefcase, Clock, Camera, 
  MessageSquare, Image, Phone, Calendar, Award, Wrench,
  ChevronLeft, Heart
} from "lucide-react";

// Mock portfolio images
const mockPortfolio = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=400&h=400&fit=crop",
];

// Mock reviews
const mockReviews = [
  {
    id: "1",
    customerName: "Maria Joseph",
    customerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Excellent work! Very professional and completed the job on time. Highly recommended!",
    date: "2026-04-15",
  },
  {
    id: "2",
    customerName: "John Mwamba",
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Good quality work. Arrived on time and was very respectful. Will hire again.",
    date: "2026-04-10",
  },
  {
    id: "3",
    customerName: "Grace Kimaro",
    customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Amazing fundi! Fixed everything perfectly. Fair price too.",
    date: "2026-04-05",
  },
];

// Mock skills
const mockSkills = ["Plumbing", "Pipe Fitting", "Water Heater Installation", "Drain Cleaning", "Leak Repair", "Bathroom Renovation"];

export default function FundiProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [fundi, setFundi] = useState<Fundi | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const foundFundi = mockFundis.find((f) => f.id === id);
      setFundi(foundFundi || null);
      if (foundFundi) {
        setIsPromoted(subscriptionDb.isUserPromoted(foundFundi.id));
        setSubscriptionActive(subscriptionDb.isUserActiveAndValid(foundFundi.id));
      }
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setIsHeaderSticky(tabsTop <= 60);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!fundi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {language === "en" ? "Loading..." : "Inapakia..."}
        </div>
      </div>
    );
  }

  const initials = fundi.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const jobsCompleted = Math.floor(Math.random() * 200) + 50;
  const yearsExperience = Math.floor(Math.random() * 10) + 2;
  const hourlyRate = Math.floor(Math.random() * 30000) + 15000;

  return (
    <>
      <Head>
        <title>{fundi.name} - {fundi.specialty} | Smart Fundi</title>
        <meta name="description" content={`Hire ${fundi.name}, a verified ${fundi.specialty} in ${fundi.city}`} />
      </Head>

      <div className="min-h-screen bg-background pb-24">
        {/* Fixed Back Button */}
        <button
          onClick={() => router.back()}
          className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Cover Banner */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {isPromoted && (
            <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {language === "en" ? "Featured" : "Maarufu"}
            </Badge>
          )}
        </div>

        {/* Profile Photo - Overlapping */}
        <div className="relative px-4 sm:px-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-sm" />
              <Avatar className="relative h-32 w-32 sm:h-36 sm:w-36 border-4 border-orange-500 shadow-xl">
                <AvatarImage src={fundi.image || fundi.photo} alt={fundi.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700 text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {fundi.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-8 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{fundi.name}</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <Badge className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                <Wrench className="h-3 w-3 mr-1" />
                {fundi.specialty}
              </Badge>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{fundi.rating.toFixed(1)}</span>
                  <span>({fundi.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{fundi.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-1 mt-6 mx-4 sm:mx-6 bg-muted/50 rounded-xl p-1">
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{jobsCompleted}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Jobs Done" : "Kazi Zilizofanywa"}
            </div>
          </div>
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-1">
              {fundi.rating.toFixed(1)}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Rating" : "Ukadiriaji"}
            </div>
          </div>
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{yearsExperience}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Years Exp." : "Miaka Uzoefu"}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsRef} className={`mt-6 ${isHeaderSticky ? "sticky top-0 z-40 bg-background shadow-md" : ""}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/50 mx-0 rounded-none border-b">
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none"
              >
                <Image className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Portfolio" : "Kazi"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none"
              >
                <MessageSquare className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Reviews" : "Maoni"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none"
              >
                <Award className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "About" : "Kuhusu"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-0 p-0">
              {mockPortfolio.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5">
                  {mockPortfolio.map((img, index) => (
                    <div key={index} className="aspect-square relative group cursor-pointer overflow-hidden">
                      <img 
                        src={img} 
                        alt={`Work ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-12 w-12 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Portfolio Yet" : "Hakuna Kazi Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "This fundi hasn't uploaded any work samples yet. Check back soon!"
                      : "Fundi huyu hajaongeza sampuli za kazi bado. Rudi tena baadaye!"}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-0">
              {mockReviews.length > 0 ? (
                <div className="divide-y">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.customerPhoto} alt={review.customerName} />
                          <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US")}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-12 w-12 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Reviews Yet" : "Hakuna Maoni Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "Be the first to review this fundi after hiring them!"
                      : "Kuwa wa kwanza kutoa maoni baada ya kumwajiri!"}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-0 p-4 sm:p-6 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === "en" ? "About Me" : "Kunihusu"}
                </h3>
                <p className="text-muted-foreground">
                  {fundi.bio || (language === "en" 
                    ? `Experienced ${fundi.specialty} based in ${fundi.city}. Committed to delivering quality work and excellent customer service.`
                    : `${fundi.specialty} mwenye uzoefu anayeishi ${fundi.city}. Nimejitolea kutoa kazi bora na huduma nzuri kwa wateja.`)}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === "en" ? "Skills" : "Ujuzi"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rate & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "en" ? "Hourly Rate" : "Kiwango kwa Saa"}
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    TZS {hourlyRate.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "en" ? "Availability" : "Upatikanaji"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-green-600">
                      {language === "en" ? "Available" : "Anapatikana"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {fundi.whatsapp && (
                  <Button 
                    className="w-full h-12 rounded-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(`https://wa.me/${fundi.whatsapp}`, "_blank")}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {language === "en" ? "WhatsApp" : "WhatsApp"}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Book Now Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
          <Button className="w-full h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold shadow-lg">
            <Calendar className="h-5 w-5 mr-2" />
            {language === "en" ? "Book Now" : "Weka Booking Sasa"}
          </Button>
        </div>
      </div>
    </>
  );
}
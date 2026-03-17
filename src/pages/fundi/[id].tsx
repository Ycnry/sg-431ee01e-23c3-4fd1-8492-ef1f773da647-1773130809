import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MessageSquare, Phone, MapPin, CheckCircle2, ShieldCheck, ShieldX } from "lucide-react";
import { mockFundis } from "@/lib/mockData";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { Fundi } from "@/types";

export default function FundiProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [fundi, setFundi] = useState<Fundi | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

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

  const handleSubmitReview = () => {
    if (rating > 0 && review.trim()) {
      console.log("Review submitted:", { rating, review, language });
      setRating(0);
      setReview("");
    }
  };

  const metaTitle = language === "en" 
    ? `${fundi?.name} - ${fundi?.specialty} in ${fundi?.city} | Smart Fundi`
    : `${fundi?.name} - ${fundi?.specialty} ${fundi?.city} | Smart Fundi`;

  if (!fundi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {language === "en" ? "Loading..." : "Inapakia..."}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pt-20 sm:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg flex-shrink-0">
                      <AvatarImage src={fundi.image || fundi.photo} alt={fundi.name} />
                      <AvatarFallback className="text-3xl sm:text-4xl">{fundi.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{fundi.name}</h1>
                        {fundi.verified && (
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 gap-1 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="hidden xs:inline">{t("common.verified")}</span>
                          </Badge>
                        )}
                      </div>
                      
                      {isPromoted && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 mb-2 text-xs">
                          {t("common.featured")}
                        </Badge>
                      )}
                      
                      <p className="text-base sm:text-lg text-muted-foreground">{fundi.specialty}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{fundi.city}</span>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{fundi.rating?.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({fundi.reviewCount} {t("common.reviews")})
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        {subscriptionActive ? (
                          <span className="flex items-center justify-center sm:justify-start gap-2 text-green-600">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                              {language === "en" ? "Active Subscription" : "Usajili Hai"}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center sm:justify-start gap-2 text-red-600">
                            <ShieldX className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                              {language === "en" ? "Inactive Subscription" : "Usajili Umekwisha"}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Actions - Mobile Prominent */}
              <Card className="lg:hidden">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Contact" : "Wasiliana"}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="gap-2 h-12" variant="default">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{t("action.message")}</span>
                    </Button>
                    {fundi.whatsapp && (
                      <Button className="gap-2 h-12" variant="outline">
                        <Phone className="h-5 w-5" />
                        <span className="text-sm">{t("action.call")}</span>
                      </Button>
                    )}
                  </div>
                  {fundi.whatsapp && (
                    <Button variant="outline" className="w-full gap-2 mt-3 h-12 border-green-600 text-green-600 hover:bg-green-50">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-sm">{t("action.whatsapp")}</span>
                    </Button>
                  )}
                  {isPromoted && (
                    <p className="text-center text-xs text-orange-600 mt-3">
                      {language === "en" 
                        ? "Featured provider - Priority service!" 
                        : "Mtoa huduma maarufu - Huduma ya kipaumbele!"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Leave a Review */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    {language === "en" ? "Leave a Review" : "Toa Maoni"}
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === "en" ? "Your Rating" : "Ukadiriaji Wako"}
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`h-8 w-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === "en" ? "Your Review" : "Maoni Yako"}
                      </label>
                      <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder={language === "en" 
                          ? "Share your experience with this fundi..." 
                          : "Shiriki uzoefu wako na fundi huyu..."}
                        className="min-h-[100px] text-base"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={rating === 0 || !review.trim()}
                      className="w-full h-12"
                    >
                      {language === "en" ? "Submit Review" : "Tuma Maoni"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === "en" ? "Contact" : "Wasiliana"}
                  </h2>
                  
                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg">
                      <MessageSquare className="h-5 w-5" />
                      {t("action.message")}
                    </Button>
                    
                    {fundi.whatsapp && (
                      <>
                        <Button variant="outline" className="w-full gap-2" size="lg">
                          <Phone className="h-5 w-5" />
                          {t("action.call")}
                        </Button>
                        
                        <Button variant="outline" className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50" size="lg">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          {t("action.whatsapp")}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isPromoted && (
                <Card className="border-orange-500 border-2">
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-orange-500">
                      {language === "en" ? "Featured Listing" : "Orodha Maarufu"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" 
                        ? "This is a premium verified professional with an active promoted listing."
                        : "Huyu ni mtaalamu aliyethibitishwa na orodha iliyotangazwa."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </>
  );
}
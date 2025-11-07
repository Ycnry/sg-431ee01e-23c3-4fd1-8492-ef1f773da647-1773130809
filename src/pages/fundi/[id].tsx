
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MessageSquare, Phone, MapPin, CheckCircle2, Briefcase } from "lucide-react";
import { mockFundis } from "@/lib/mockData";

export default function FundiProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const fundi = mockFundis.find((f) => f.id === id);

  if (!fundi) {
    return <div>Loading...</div>;
  }

  const handleSubmitReview = () => {
    if (rating > 0 && review.trim()) {
      console.log("Review submitted:", { rating, review, language });
      setRating(0);
      setReview("");
    }
  };

  const metaTitle = language === "en" 
    ? `${fundi.name} - ${fundi.specialty} in ${fundi.city} | Smart Fundi`
    : `${fundi.name} - ${fundi.specialty} ${fundi.city} | Smart Fundi`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <Avatar className="h-24 w-24 border-4 border-blue-100">
                      <AvatarImage src={fundi.photo} alt={fundi.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                        {fundi.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">{fundi.name}</h1>
                        {fundi.verified && (
                          <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">{fundi.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({fundi.reviewCount} {t("common.reviews")})</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{fundi.specialty}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{fundi.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-muted-foreground leading-relaxed">{fundi.bio}</p>
                  </div>

                  {fundi.subscriptionActive && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Active subscription - Verified professional
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === "en" ? "Leave a Review" : "Toa Maoni"}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === "en" ? "Your Rating" : "Ukadiriaji Wako"}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-colors"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === "en" ? "Your Review" : "Maoni Yako"}
                      </label>
                      <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder={language === "en" 
                          ? "Share your experience with this fundi..." 
                          : "Shiriki uzoefu wako na fundi huyu..."}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitReview}
                      disabled={rating === 0 || !review.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {language === "en" ? "Submit Review" : "Wasilisha Maoni"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact</h2>
                  
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
                        
                        <Button variant="outline" className="w-full gap-2" size="lg">
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

              {fundi.promoted && (
                <Card className="border-orange-500 border-2">
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-orange-500">Featured Listing</Badge>
                    <p className="text-sm text-muted-foreground">
                      This is a premium verified professional with an active promoted listing.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

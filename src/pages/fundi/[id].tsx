import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MessageSquare, Phone, MapPin, CheckCircle2, Briefcase, ShieldCheck, ShieldX } from "lucide-react";
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

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={fundi?.image || fundi?.photo} alt={fundi?.name} />
                      <AvatarFallback className="text-4xl">{fundi?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{fundi?.name}</h1>
                        {fundi?.verified && (
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
                      <p className="text-lg text-muted-foreground">{fundi?.specialty}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{fundi?.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{fundi?.rating?.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({fundi?.reviewCount} {t("common.reviews")})
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

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === "en" ? "Leave a Review" : "Toa Maoni"}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button className="flex-1 gap-2 py-6 text-lg" variant="default">
                        <MessageSquare className="h-5 w-5" />
                        {t("action.message")}
                      </Button>
                      {fundi?.whatsapp && (
                        <Button className="flex-1 gap-2 py-6 text-lg" variant="outline">
                          <Phone className="h-5 w-5" />
                          {t("action.call")}
                        </Button>
                      )}
                    </div>
                    {isPromoted && (
                      <div className="text-center text-sm text-orange-600">
                        This provider is featured! Contact them for priority service.
                      </div>
                    )}
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
                    
                    {fundi?.whatsapp && (
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

              {isPromoted && (
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

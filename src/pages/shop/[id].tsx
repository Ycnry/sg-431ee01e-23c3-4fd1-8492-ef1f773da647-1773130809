import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Star, MessageSquare, Phone, MapPin, Clock, Store, 
  CheckCircle2, ShieldCheck, ShieldX, ChevronDown, 
  FileText, MapPinned, Award, AlertTriangle, ThumbsUp, Flag
} from "lucide-react";
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
  const [credentialsExpanded, setCredentialsExpanded] = useState(false);
  const [userHasVerified, setUserHasVerified] = useState(false);
  const [userHasReported, setUserHasReported] = useState(false);

  useEffect(() => {
    if (id) {
      const foundShop = mockShops.find((s) => s.id === id);
      setShop(foundShop || null);
      if (foundShop) {
        setIsPromoted(subscriptionDb.isUserPromoted(foundShop.id));
        setSubscriptionActive(subscriptionDb.isUserActiveAndValid(foundShop.id));
        
        const verifiedShops = JSON.parse(localStorage.getItem("user_verified_shops") || "[]");
        setUserHasVerified(verifiedShops.includes(foundShop.id));
        
        const reportedShops = JSON.parse(localStorage.getItem("user_reported_shops") || "[]");
        setUserHasReported(reportedShops.includes(foundShop.id));
      }
    }
  }, [id]);

  const handleConfirmReal = () => {
    if (!shop || userHasVerified) return;
    
    const verifiedShops = JSON.parse(localStorage.getItem("user_verified_shops") || "[]");
    verifiedShops.push(shop.id);
    localStorage.setItem("user_verified_shops", JSON.stringify(verifiedShops));
    setUserHasVerified(true);
  };

  const handleReportScam = () => {
    if (!shop || userHasReported) return;
    
    const reportedShops = JSON.parse(localStorage.getItem("user_reported_shops") || "[]");
    reportedShops.push(shop.id);
    localStorage.setItem("user_reported_shops", JSON.stringify(reportedShops));
    setUserHasReported(true);
    
    const scamReports = JSON.parse(localStorage.getItem("shop_scam_reports") || "{}");
    scamReports[shop.id] = (scamReports[shop.id] || 0) + 1;
    localStorage.setItem("shop_scam_reports", JSON.stringify(scamReports));
  };

  const metaTitle = language === "en" 
    ? `${shop?.name || "Shop"} - Hardware & Tools | Smart Fundi`
    : `${shop?.name || "Duka"} - Vifaa na Zana | Smart Fundi`;

  if (!shop) {
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
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg rounded-lg flex-shrink-0">
                      <AvatarImage src={shop.image || shop.logo} alt={shop.name} />
                      <AvatarFallback className="text-3xl sm:text-4xl rounded-lg">{shop.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{shop.name}</h1>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                        {shop.verificationStatus === "approved" && (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700 gap-1 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="hidden xs:inline">{language === "en" ? "Verified" : "Imethibitishwa"}</span>
                          </Badge>
                        )}
                        {shop.communityVerified && (
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 gap-1 text-xs">
                            <Award className="h-3 w-3" />
                            <span className="hidden xs:inline">{language === "en" ? "Community" : "Jamii"}</span>
                          </Badge>
                        )}
                        {isPromoted && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                            {t("common.featured")}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-base sm:text-lg text-muted-foreground">{shop.category}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{shop.city}</span>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{shop.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({shop.reviewCount} {t("common.reviews")})
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
                    {language === "en" ? "Contact Shop" : "Wasiliana na Duka"}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="gap-2 h-12" variant="default">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{t("action.message")}</span>
                    </Button>
                    {shop.whatsapp && (
                      <Button className="gap-2 h-12" variant="outline">
                        <Phone className="h-5 w-5" />
                        <span className="text-sm">{t("action.call")}</span>
                      </Button>
                    )}
                  </div>
                  {shop.whatsapp && (
                    <Button variant="outline" className="w-full gap-2 mt-3 h-12 border-green-600 text-green-600 hover:bg-green-50">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-sm">{t("action.whatsapp")}</span>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Unverified Warning */}
              {shop.verificationStatus === "pending" && (
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">
                    <strong>{language === "en" ? "Unverified Shop" : "Duka Lisilohaihakikishwa"}:</strong><br />
                    {language === "en" 
                      ? "This shop is pending verification. Use at your own risk."
                      : "Duka hili linasubiri uthibitisho. Tumia kwa hatari yako."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Verified Credentials */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <Collapsible open={credentialsExpanded} onOpenChange={setCredentialsExpanded}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <CardTitle className="text-left text-base sm:text-lg">
                            {language === "en" ? "Verified Credentials" : "Vyeti Vilivyothibitishwa"}
                          </CardTitle>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform flex-shrink-0 ${credentialsExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      {shop.verificationStatus === "approved" ? (
                        <div className="space-y-3">
                          {shop.businessRegistrationNumber && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm">
                                  {language === "en" ? "Business Registration" : "Usajili wa Biashara"}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">{shop.businessRegistrationNumber}</p>
                              </div>
                            </div>
                          )}
                          
                          {shop.physicalAddress && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <MapPinned className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm">
                                  {language === "en" ? "Physical Address" : "Anwani"}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground break-words">{shop.physicalAddress}</p>
                              </div>
                            </div>
                          )}

                          {shop.verifiedAt && (
                            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm text-green-800 dark:text-green-200">
                                  {language === "en" ? "Verified by Smart Fundi" : "Imethibitishwa"}
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                  {shop.verifiedAt}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <AlertDescription className="text-xs sm:text-sm">
                            {language === "en" 
                              ? "This shop has not been verified yet."
                              : "Duka hili halijathibitishwa bado."}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardHeader>
              </Card>

              {/* Customer Trust Layer */}
              <Card>
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    {language === "en" ? "Customer Trust" : "Uaminifu wa Wateja"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">
                          {language === "en" ? "Trust Points" : "Pointi za Uaminifu"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shop.trustPoints || 0} {language === "en" ? "points" : "pointi"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium">{shop.customerVerifications || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "verifications" : "uthibitisho"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button
                      onClick={handleConfirmReal}
                      disabled={userHasVerified}
                      variant={userHasVerified ? "secondary" : "default"}
                      className="gap-1 sm:gap-2 h-10 sm:h-11 text-xs sm:text-sm"
                      size="sm"
                    >
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">
                        {userHasVerified 
                          ? (language === "en" ? "Confirmed" : "Imethibitishwa")
                          : (language === "en" ? "Confirm Real" : "Thibitisha")
                        }
                      </span>
                    </Button>
                    
                    <Button
                      onClick={handleReportScam}
                      disabled={userHasReported}
                      variant={userHasReported ? "secondary" : "outline"}
                      className={`gap-1 sm:gap-2 h-10 sm:h-11 text-xs sm:text-sm ${!userHasReported ? "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" : ""}`}
                      size="sm"
                    >
                      <Flag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">
                        {userHasReported 
                          ? (language === "en" ? "Reported" : "Imeripotiwa")
                          : (language === "en" ? "Report Scam" : "Ripoti")
                        }
                      </span>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {language === "en" 
                      ? "Help the community by confirming legitimate shops"
                      : "Saidia jamii kwa kuthibitisha maduka halali"}
                  </p>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-xl font-semibold mb-3">
                    {language === "en" ? "About" : "Kuhusu"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {shop.name} {language === "en" 
                      ? `is a trusted supplier of quality hardware, tools, and construction materials in ${shop.city}.`
                      : `ni muuzaji wa kuaminika wa vifaa vya ujenzi na zana bora ${shop.city}.`}
                  </p>
                </CardContent>
              </Card>

              {/* Product Categories */}
              {shop.categories && shop.categories.length > 0 && (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-base sm:text-xl font-semibold mb-3">
                      {language === "en" ? "Categories" : "Makundi"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {shop.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs sm:text-sm">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Opening Hours */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {language === "en" ? "Opening Hours" : "Saa za Kufungua"}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{shop.openingHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === "en" ? "Contact Shop" : "Wasiliana na Duka"}
                  </h2>
                  
                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg">
                      <MessageSquare className="h-5 w-5" />
                      {t("action.message")}
                    </Button>
                    
                    {shop.whatsapp && (
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
                        ? "This is a premium verified shop with an active promoted listing."
                        : "Hili ni duka lililothibitishwa na orodha iliyotangazwa."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Find a Fundi CTA */}
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    {language === "en" ? "Looking for a Fundi?" : "Unatafuta Fundi?"}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    {language === "en" 
                      ? "Connect with verified technicians who can install or repair your purchases"
                      : "Unganisha na mafundi wanaoweza kusanidi vitu unavyonunua"}
                  </p>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-100">
                    {language === "en" ? "Find a Fundi" : "Tafuta Fundi"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </>
  );
}
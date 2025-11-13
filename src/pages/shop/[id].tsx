import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
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
    
    console.log(`User confirmed shop ${shop.id} is real (+2 trust points)`);
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
    
    console.log(`User reported shop ${shop.id} as scam`);
    
    if (scamReports[shop.id] >= 2) {
      console.log(`Shop ${shop.id} flagged for admin review (≥2 reports)`);
    }
  };

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
                        {shop.verificationStatus === "approved" && (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700 gap-1.5 pl-2 pr-3">
                            <CheckCircle2 className="h-4 w-4" />
                            {language === "en" ? "Verified by Smart Fundi" : "Imethibitishwa na Smart Fundi"}
                          </Badge>
                        )}
                        {shop.communityVerified && (
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 gap-1.5 pl-2 pr-3">
                            <Award className="h-4 w-4" />
                            {language === "en" ? "Community Verified" : "Imethibitishwa na Jamii"}
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

              {shop.verificationStatus === "pending" && (
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>{language === "en" ? "Unverified Shop" : "Duka Lisilohaihakikishwa"}:</strong><br />
                    {language === "en" 
                      ? "This shop is pending verification. Use at your own risk. We recommend engaging only with verified shops."
                      : "Duka hili linasubiri uthibitisho. Tumia kwa hatari yako mwenyewe. Tunapendekeza kuingiliana tu na maduka yaliyothibitishwa."}
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <Collapsible open={credentialsExpanded} onOpenChange={setCredentialsExpanded}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-left">
                            {language === "en" ? "Verified Credentials" : "Vyeti Vilivyothibitishwa"}
                          </CardTitle>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${credentialsExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      {shop.verificationStatus === "approved" ? (
                        <div className="space-y-4">
                          {shop.businessRegistrationNumber && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {language === "en" ? "Business Registration Number" : "Nambari ya Usajili wa Biashara"}
                                </p>
                                <p className="text-sm text-muted-foreground">{shop.businessRegistrationNumber}</p>
                              </div>
                            </div>
                          )}
                          
                          {shop.physicalAddress && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <MapPinned className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {language === "en" ? "Physical Address" : "Anwani ya Kimwili"}
                                </p>
                                <p className="text-sm text-muted-foreground">{shop.physicalAddress}</p>
                              </div>
                            </div>
                          )}

                          {shop.verifiedAt && (
                            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm text-green-800 dark:text-green-200">
                                  {language === "en" ? "Verified by Smart Fundi" : "Imethibitishwa na Smart Fundi"}
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                  {language === "en" ? "Verified on" : "Imethibitishwa tarehe"}: {shop.verifiedAt}
                                </p>
                              </div>
                            </div>
                          )}

                          {shop.phoneVerified && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Phone className="h-4 w-4" />
                              <span>{language === "en" ? "Phone Verified" : "Simu Imethibitishwa"}</span>
                            </div>
                          )}

                          {(shop.businessLicenseUrl || shop.tinCertificateUrl || shop.storefrontPhotoUrl) && (
                            <div className="space-y-2">
                              <p className="font-medium text-sm">
                                {language === "en" ? "Uploaded Documents" : "Hati Zilizopakiwa"}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {shop.businessLicenseUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">{language === "en" ? "Business License" : "Leseni ya Biashara"}</p>
                                  </div>
                                )}
                                {shop.tinCertificateUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">{language === "en" ? "TIN Certificate" : "Cheti cha TIN"}</p>
                                  </div>
                                )}
                                {shop.storefrontPhotoUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">{language === "en" ? "Storefront Photo" : "Picha ya Duka"}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {language === "en" 
                              ? "This shop has not been verified yet. Credentials will be displayed once the shop is verified by Smart Fundi admin."
                              : "Duka hili halijathibitishwa bado. Vyeti vitaonyeshwa baada ya duka kuthibitishwa na msimamizi wa Smart Fundi."}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Customer Trust Layer" : "Tabaka la Uaminifu wa Wateja"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">
                          {language === "en" ? "Trust Points" : "Pointi za Uaminifu"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shop.trustPoints || 0} {language === "en" ? "points" : "pointi"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{shop.customerVerifications || 0} {language === "en" ? "verifications" : "uthibitisho"}</p>
                      <p className="text-xs text-muted-foreground">
                        {shop.scamReports || 0} {language === "en" ? "scam reports" : "ripoti za ulaghai"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleConfirmReal}
                      disabled={userHasVerified}
                      variant={userHasVerified ? "secondary" : "default"}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {userHasVerified 
                        ? (language === "en" ? "Confirmed" : "Imethibitishwa")
                        : (language === "en" ? "Confirm Real Shop" : "Thibitisha Duka la Kweli")
                      }
                    </Button>
                    
                    <Button
                      onClick={handleReportScam}
                      disabled={userHasReported}
                      variant={userHasReported ? "secondary" : "outline"}
                      className={`gap-2 ${!userHasReported ? "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" : ""}`}
                    >
                      <Flag className="h-4 w-4" />
                      {userHasReported 
                        ? (language === "en" ? "Reported" : "Imeripotiwa")
                        : (language === "en" ? "Report Scam" : "Ripoti Ulaghai")
                      }
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {language === "en" 
                      ? "Help the community by confirming legitimate shops or reporting suspicious activity"
                      : "Saidia jamii kwa kuthibitisha maduka halali au kuripoti shughuli za kutiliwa shaka"}
                  </p>
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
                  {shop.categories?.map((category) => (
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

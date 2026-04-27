import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockShops } from "@/lib/mockData";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { Shop } from "@/types";
import { 
  Star, MapPin, CheckCircle2, Clock, Package, 
  MessageSquare, Store, Phone, ShoppingBag, Award,
  ChevronLeft, Heart, Globe, CreditCard, Banknote
} from "lucide-react";

// Mock products
const mockProducts = [
  { id: "1", name: "Cement (50kg bag)", price: 18500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", inStock: true },
  { id: "2", name: "Iron Sheets (Box Profile)", price: 32000, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", inStock: true },
  { id: "3", name: "PVC Pipes 4 inch", price: 8500, image: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=400&h=400&fit=crop", inStock: true },
  { id: "4", name: "Paint (20L bucket)", price: 125000, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop", inStock: false },
  { id: "5", name: "Electrical Wire (100m)", price: 45000, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop", inStock: true },
  { id: "6", name: "Door Lock Set", price: 28000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", inStock: true },
];

// Mock reviews
const mockReviews = [
  {
    id: "1",
    customerName: "Peter Makonde",
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Great prices and quality materials. The staff is very helpful and knowledgeable.",
    date: "2026-04-20",
  },
  {
    id: "2",
    customerName: "Fatuma Hassan",
    customerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Good selection of products. Delivery was on time. Will buy again.",
    date: "2026-04-15",
  },
  {
    id: "3",
    customerName: "James Kileo",
    customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Best hardware shop in the area. Competitive prices and genuine products.",
    date: "2026-04-10",
  },
];

// Payment methods
const paymentMethods = ["M-Pesa", "Cash", "Bank Transfer", "Tigo Pesa"];

export default function ShopProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const foundShop = mockShops.find((s) => s.id === id);
      setShop(foundShop || null);
      if (foundShop) {
        setIsPromoted(subscriptionDb.isUserPromoted(foundShop.id));
      }
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setIsHeaderSticky(tabsTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {language === "en" ? "Loading..." : "Inapakia..."}
        </div>
      </div>
    );
  }

  const shopName = shop.shopName || shop.name;
  const initials = shopName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const productsCount = mockProducts.length;
  const citiesServed = Math.floor(Math.random() * 5) + 1;

  return (
    <>
      <Head>
        <title>{shopName} - {shop.category} | Smart Fundi</title>
        <meta name="description" content={`Shop at ${shopName}, quality ${shop.category} in ${shop.city}`} />
      </Head>

      <div className="min-h-screen bg-background pb-24">
        {/* Fixed Back Button */}
        <button
          onClick={() => router.back()}
          className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Cover Image */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {isPromoted && (
            <Badge className="absolute top-4 right-16 bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {language === "en" ? "Featured" : "Maarufu"}
            </Badge>
          )}
        </div>

        {/* Shop Logo - Overlapping */}
        <div className="relative px-4 sm:px-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur-sm" />
              <Avatar className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-2xl border-4 border-green-500 shadow-xl">
                <AvatarImage src={shop.image || shop.logo} alt={shopName} className="rounded-xl" />
                <AvatarFallback className="bg-green-100 text-green-700 text-3xl font-bold rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {shop.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-8 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{shopName}</h1>
              </div>
              
              <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <Store className="h-3 w-3 mr-1" />
                {shop.category}
              </Badge>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{shop.rating.toFixed(1)}</span>
                  <span>({shop.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{shop.openingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-1 mt-6 mx-4 sm:mx-6 bg-muted/50 rounded-xl p-1">
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{productsCount}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Products" : "Bidhaa"}
            </div>
          </div>
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-1">
              {shop.rating.toFixed(1)}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Rating" : "Ukadiriaji"}
            </div>
          </div>
          <div className="text-center py-4 bg-background rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{citiesServed}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "en" ? "Cities" : "Miji"}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsRef} className={`mt-6 ${isHeaderSticky ? "sticky top-0 z-40 bg-background shadow-md" : ""}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/50 mx-0 rounded-none border-b">
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 rounded-none"
              >
                <Package className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Products" : "Bidhaa"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 rounded-none"
              >
                <MessageSquare className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Reviews" : "Maoni"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 rounded-none"
              >
                <Award className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "About" : "Kuhusu"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-0 p-0">
              {mockProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 p-2">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="bg-card border rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="destructive">
                              {language === "en" ? "Out of Stock" : "Imeisha"}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
                        <p className="text-green-600 dark:text-green-400 font-bold">
                          TZS {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Products Yet" : "Hakuna Bidhaa Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "This shop hasn't listed any products yet. Check back soon!"
                      : "Duka hili halijaongeza bidhaa bado. Rudi tena baadaye!"}
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
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Reviews Yet" : "Hakuna Maoni Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "Be the first to review this shop!"
                      : "Kuwa wa kwanza kutoa maoni kwa duka hili!"}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-0 p-4 sm:p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === "en" ? "About Us" : "Kuhusu Sisi"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "en" 
                    ? `${shopName} is your trusted supplier for quality hardware, building materials, and tools in ${shop.city}. We offer competitive prices and excellent customer service.`
                    : `${shopName} ni muuzaji wako wa kuaminika wa vifaa vya ujenzi, nyenzo za ujenzi, na zana ${shop.city}. Tunatoa bei nzuri na huduma bora kwa wateja.`}
                </p>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === "en" ? "Location" : "Mahali"}
                </h3>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">{shop.city}, {shop.ward}</p>
                    <p className="text-sm text-muted-foreground">{shop.openingHours}</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {shop.categories && shop.categories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === "en" ? "Categories" : "Makundi"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="rounded-full">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === "en" ? "Payment Methods" : "Njia za Malipo"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      {method === "M-Pesa" || method === "Tigo Pesa" ? (
                        <Phone className="h-4 w-4 text-green-600" />
                      ) : method === "Bank Transfer" ? (
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Banknote className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    {language === "en" ? "Delivery Available" : "Uwasilishaji Unapatikana"}
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {language === "en" 
                    ? "We deliver to all areas within the city. Contact us for delivery rates."
                    : "Tunawasilisha maeneo yote ndani ya jiji. Wasiliana nasi kwa bei za usafiri."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Contact Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
          <div className="flex gap-3 max-w-lg mx-auto">
            {shop.whatsapp && (
              <Button 
                className="flex-1 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg"
                onClick={() => window.open(`https://wa.me/${shop.whatsapp}`, "_blank")}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Button>
            )}
            <Button 
              className="flex-1 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg"
              onClick={() => shop.whatsapp && window.open(`tel:${shop.whatsapp}`, "_self")}
            >
              <Phone className="h-5 w-5 mr-2" />
              {language === "en" ? "Call" : "Piga Simu"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
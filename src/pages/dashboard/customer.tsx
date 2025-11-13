
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Star, Heart, MessageSquare, History, Settings,
  Trash2, Edit, Phone, Bell, Globe, HelpCircle
} from "lucide-react";
import Link from "next/link";

interface BookingHistory {
  id: string;
  providerName: string;
  providerType: "fundi" | "shop";
  specialty?: string;
  date: string;
  status: "contacted" | "completed" | "cancelled";
}

interface Review {
  id: string;
  targetId: string;
  targetName: string;
  targetType: "fundi" | "shop";
  rating: number;
  comment: string;
  date: string;
  language: "en" | "sw";
}

interface Favorite {
  id: string;
  providerId: string;
  providerName: string;
  providerType: "fundi" | "shop";
  specialty?: string;
  rating: number;
  image?: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState<BookingHistory[]>([
    {
      id: "1",
      providerName: "John Kamau",
      providerType: "fundi",
      specialty: "Electrician",
      date: "2025-11-05",
      status: "completed",
    },
    {
      id: "2",
      providerName: "Dar Hardware Supplies",
      providerType: "shop",
      date: "2025-11-08",
      status: "contacted",
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      targetId: "1",
      targetName: "John Kamau",
      targetType: "fundi",
      rating: 5,
      comment: "Excellent work! Very professional.",
      date: "2025-11-06",
      language: "en",
    },
  ]);

  const [favorites, setFavorites] = useState<Favorite[]>([
    {
      id: "1",
      providerId: "1",
      providerName: "John Kamau",
      providerType: "fundi",
      specialty: "Electrician",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      providerId: "shop1",
      providerName: "Dar Hardware Supplies",
      providerType: "shop",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
    },
  ]);

  const [accountSettings, setAccountSettings] = useState({
    phone: user?.phone || "",
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    const savedData = localStorage.getItem("customer_dashboard_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setBookings(parsed.bookings || bookings);
      setReviews(parsed.reviews || reviews);
      setFavorites(parsed.favorites || favorites);
      setAccountSettings(parsed.accountSettings || accountSettings);
    }

    setLoading(false);
  }, [isAuthenticated, router]);

  const saveData = () => {
    localStorage.setItem("customer_dashboard_data", JSON.stringify({
      bookings,
      reviews,
      favorites,
      accountSettings,
    }));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    saveData();
  };

  const handleStartEditReview = (review: Review) => {
    setEditingReview(review.id);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };

  const handleSaveReview = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, rating: editReviewData.rating, comment: editReviewData.comment }
        : r
    ));
    setEditingReview(null);
    saveData();
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites(favorites.filter(f => f.id !== favoriteId));
    saveData();
  };

  const handleSettingsChange = (field: string, value: any) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>{language === "en" ? "My Dashboard - Smart Fundi" : "Dashibodi Yangu - Smart Fundi"}</title>
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                {language === "en" ? `Welcome back, ${user?.name}` : `Karibu tena, ${user?.name}`}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === "en" ? "Manage your bookings and favorites" : "Dhibiti maagizo na vipendwa vyako"}
            </p>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">
                <History className="h-4 w-4 mr-2" />
                {language === "en" ? "History" : "Historia"}
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                {language === "en" ? "Reviews" : "Maoni"}
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                {language === "en" ? "Favorites" : "Vipendwa"}
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                {language === "en" ? "Settings" : "Mipangilio"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Booking History" : "Historia ya Maagizo"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Providers you've contacted" : "Watoaji huduma uliowasiliana nao"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No bookings yet" : "Hakuna maagizo bado"}
                      </p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{booking.providerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.providerName}</p>
                            {booking.specialty && (
                              <p className="text-sm text-muted-foreground">{booking.specialty}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{booking.date}</p>
                          </div>
                        </div>
                        <Badge variant={
                          booking.status === "completed" ? "default" :
                          booking.status === "contacted" ? "secondary" : "destructive"
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Your Reviews" : "Maoni Yako"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Edit or delete your reviews" : "Hariri au futa maoni yako"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No reviews yet" : "Hakuna maoni bado"}
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.targetName}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingReview !== review.id && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEditReview(review)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingReview === review.id ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-6 w-6 cursor-pointer ${
                                    star <= editReviewData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() => setEditReviewData({ ...editReviewData, rating: star })}
                                />
                              ))}
                            </div>
                            <Textarea
                              value={editReviewData.comment}
                              onChange={(e) => setEditReviewData({ ...editReviewData, comment: e.target.value })}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveReview(review.id)}>
                                {language === "en" ? "Save" : "Hifadhi"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingReview(null)}>
                                {language === "en" ? "Cancel" : "Ghairi"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Saved Favorites" : "Vipendwa Vilivohifadhiwa"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Your favorite fundis and shops" : "Mafundi na maduka uliyopendelea"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No favorites yet" : "Hakuna vipendwa bado"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {favorites.map((favorite) => (
                        <div key={favorite.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={favorite.image} />
                                <AvatarFallback>{favorite.providerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{favorite.providerName}</p>
                                {favorite.specialty && (
                                  <p className="text-sm text-muted-foreground">{favorite.specialty}</p>
                                )}
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">{favorite.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {language === "en" ? "Message" : "Tuma Ujumbe"}
                            </Button>
                            <Button size="sm" variant="outline">
                              {language === "en" ? "View" : "Angalia"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Account Settings" : "Mipangilio ya Akaunti"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Phone Number" : "Namba ya Simu"}</Label>
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                      <Input
                        value={accountSettings.phone}
                        onChange={(e) => handleSettingsChange("phone", e.target.value)}
                        placeholder="+255 7XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <Label>{language === "en" ? "Push Notifications" : "Arifa za Kusukuma"}</Label>
                      </div>
                      <Switch
                        checked={accountSettings.notificationsEnabled}
                        onCheckedChange={(checked) => handleSettingsChange("notificationsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>{language === "en" ? "Email Notifications" : "Arifa za Barua pepe"}</Label>
                      <Switch
                        checked={accountSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>{language === "en" ? "SMS Notifications" : "Arifa za SMS"}</Label>
                      <Switch
                        checked={accountSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingsChange("smsNotifications", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {language === "en" ? "Language Preference" : "Chaguo la Lugha"}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant={language === "en" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setLanguage("en")}
                      >
                        English
                      </Button>
                      <Button
                        variant={language === "sw" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setLanguage("sw")}
                      >
                        Kiswahili
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      {language === "en" ? "Need Help?" : "Unahitaji Msaada?"}
                    </Label>
                    <Link href="/help" className="w-full">
                      <Button variant="outline" className="w-full">
                        {language === "en" ? "Go to Help & Support" : "Nenda kwenye Msaada"}
                      </Button>
                    </Link>
                  </div>

                  <Button onClick={saveData} className="w-full">
                    {language === "en" ? "Save Settings" : "Hifadhi Mipangilio"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

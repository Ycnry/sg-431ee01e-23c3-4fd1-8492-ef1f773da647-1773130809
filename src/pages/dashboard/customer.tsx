import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Star, Heart, MessageSquare, History, Settings,
  Trash2, Edit, Phone, Bell, Globe, HelpCircle, Wallet,
  CreditCard, Clock, MapPin, Search, Filter, ChevronRight,
  CheckCircle2, XCircle, AlertCircle, Calendar, ArrowUpRight
} from "lucide-react";

interface BookingHistory {
  id: string;
  providerName: string;
  providerType: "fundi" | "shop";
  providerImage?: string;
  specialty?: string;
  date: string;
  time?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount?: number;
  location?: string;
}

interface Review {
  id: string;
  targetId: string;
  targetName: string;
  targetImage?: string;
  targetType: "fundi" | "shop";
  rating: number;
  comment: string;
  date: string;
  language: "en" | "sw";
  helpful: number;
}

interface Favorite {
  id: string;
  providerId: string;
  providerName: string;
  providerType: "fundi" | "shop";
  specialty?: string;
  rating: number;
  image?: string;
  location?: string;
  isVerified?: boolean;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: "mpesa" | "airtel" | "card" | "cash";
  status: "completed" | "pending" | "failed";
  description: string;
  recipient: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [bookings, setBookings] = useState<BookingHistory[]>([
    {
      id: "1",
      providerName: "John Kamau",
      providerType: "fundi",
      providerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      specialty: "Electrician",
      date: "2025-11-05",
      time: "10:00 AM",
      status: "completed",
      amount: 45000,
      location: "Kinondoni, Dar es Salaam",
    },
    {
      id: "2",
      providerName: "Dar Hardware Supplies",
      providerType: "shop",
      providerImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop",
      date: "2025-11-08",
      status: "confirmed",
      amount: 125000,
      location: "Kariakoo, Dar es Salaam",
    },
    {
      id: "3",
      providerName: "Mary Mwalimu",
      providerType: "fundi",
      specialty: "Plumber",
      date: "2025-11-12",
      time: "2:00 PM",
      status: "pending",
      amount: 35000,
      location: "Mikocheni, Dar es Salaam",
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      targetId: "1",
      targetName: "John Kamau",
      targetImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      targetType: "fundi",
      rating: 5,
      comment: "Excellent work! Very professional and completed the job on time. Highly recommended for electrical work.",
      date: "2025-11-06",
      language: "en",
      helpful: 12,
    },
    {
      id: "2",
      targetId: "shop1",
      targetName: "Dar Hardware Supplies",
      targetType: "shop",
      rating: 4,
      comment: "Good quality products and fair prices. Delivery was a bit delayed but overall satisfied.",
      date: "2025-11-09",
      language: "en",
      helpful: 5,
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      location: "Kinondoni",
      isVerified: true,
    },
    {
      id: "2",
      providerId: "shop1",
      providerName: "Dar Hardware Supplies",
      providerType: "shop",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop",
      location: "Kariakoo",
      isVerified: true,
    },
    {
      id: "3",
      providerId: "2",
      providerName: "Peter Mushi",
      providerType: "fundi",
      specialty: "Carpenter",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      location: "Masaki",
      isVerified: true,
    },
  ]);

  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: "1",
      date: "2025-11-05",
      amount: 45000,
      method: "mpesa",
      status: "completed",
      description: "Electrical repair service",
      recipient: "John Kamau",
    },
    {
      id: "2",
      date: "2025-11-08",
      amount: 125000,
      method: "mpesa",
      status: "completed",
      description: "Hardware supplies purchase",
      recipient: "Dar Hardware Supplies",
    },
    {
      id: "3",
      date: "2025-11-10",
      amount: 35000,
      method: "airtel",
      status: "pending",
      description: "Plumbing service deposit",
      recipient: "Mary Mwalimu",
    },
  ]);

  const [accountSettings, setAccountSettings] = useState({
    phone: user?.phone || "+255 712 345 678",
    email: user?.email || "",
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    setLoading(false);
  }, [isAuthenticated, router]);

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
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
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites(favorites.filter(f => f.id !== favoriteId));
  };

  const handleSettingsChange = (field: string, value: boolean | string) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle2 },
      confirmed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: CheckCircle2 },
      pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
      cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
      failed: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("sw-TZ", { style: "currency", currency: "TZS", minimumFractionDigits: 0 }).format(amount);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalBookings: bookings.length,
    completedJobs: bookings.filter(b => b.status === "completed").length,
    totalSpent: payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    favoriteCount: favorites.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{language === "en" ? "Loading..." : "Inapakia..."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{language === "en" ? "My Dashboard - Smart Fundi" : "Dashibodi Yangu - Smart Fundi"}</title>
        <meta name="description" content={language === "en" ? "Manage your bookings, favorites, and account settings" : "Dhibiti maagizo, vipendwa, na mipangilio yako"} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pt-20 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={user?.photo} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {language === "en" ? `Welcome back, ${user?.name?.split(" ")[0] || "Customer"}` : `Karibu tena, ${user?.name?.split(" ")[0] || "Mteja"}`}
                  </h1>
                  <p className="text-muted-foreground">
                    {language === "en" ? "Manage your services and bookings" : "Dhibiti huduma na maagizo yako"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/search">
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    {language === "en" ? "Find Services" : "Tafuta Huduma"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">{language === "en" ? "Total Bookings" : "Jumla ya Maagizo"}</p>
                    <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">{language === "en" ? "Completed" : "Zilizokamilika"}</p>
                    <p className="text-3xl font-bold">{stats.completedJobs}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">{language === "en" ? "Total Spent" : "Jumla Uliyotumia"}</p>
                    <p className="text-xl font-bold">{formatAmount(stats.totalSpent)}</p>
                  </div>
                  <Wallet className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm">{language === "en" ? "Favorites" : "Vipendwa"}</p>
                    <p className="text-3xl font-bold">{stats.favoriteCount}</p>
                  </div>
                  <Heart className="h-10 w-10 text-pink-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <History className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Bookings" : "Maagizo"}</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs sm:text-sm">
                <Heart className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Favorites" : "Vipendwa"}</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                <Star className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Reviews" : "Maoni"}</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm">
                <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Payments" : "Malipo"}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Settings" : "Mipangilio"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>{language === "en" ? "Booking History" : "Historia ya Maagizo"}</CardTitle>
                      <CardDescription>
                        {language === "en" ? "Track your service requests and appointments" : "Fuatilia maombi yako ya huduma na miadi"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={language === "en" ? "Search..." : "Tafuta..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-40"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === "en" ? "All" : "Zote"}</SelectItem>
                          <SelectItem value="pending">{language === "en" ? "Pending" : "Zinasubiri"}</SelectItem>
                          <SelectItem value="confirmed">{language === "en" ? "Confirmed" : "Zimethibitishwa"}</SelectItem>
                          <SelectItem value="completed">{language === "en" ? "Completed" : "Zimekamilika"}</SelectItem>
                          <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "Zimeghairiwa"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No bookings found" : "Hakuna maagizo yaliyopatikana"}
                      </p>
                      <Link href="/search">
                        <Button className="mt-4">
                          {language === "en" ? "Find Services" : "Tafuta Huduma"}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={booking.providerImage} />
                            <AvatarFallback>{booking.providerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{booking.providerName}</p>
                              <Badge variant="outline" className="text-xs">
                                {booking.providerType === "fundi" ? "Fundi" : language === "en" ? "Shop" : "Duka"}
                              </Badge>
                            </div>
                            {booking.specialty && (
                              <p className="text-sm text-muted-foreground">{booking.specialty}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {booking.date} {booking.time && `• ${booking.time}`}
                              </span>
                              {booking.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {booking.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          {getStatusBadge(booking.status)}
                          {booking.amount && (
                            <p className="font-semibold text-primary">{formatAmount(booking.amount)}</p>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {language === "en" ? "Message" : "Ujumbe"}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Saved Favorites" : "Vipendwa Vilivyohifadhiwa"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Your favorite fundis and shops for quick access" : "Mafundi na maduka uliyopendelea kwa ufikiaji wa haraka"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No favorites yet" : "Hakuna vipendwa bado"}
                      </p>
                      <Link href="/search">
                        <Button className="mt-4">
                          {language === "en" ? "Discover Services" : "Gundua Huduma"}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {favorites.map((favorite) => (
                        <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-14 w-14">
                                  <AvatarImage src={favorite.image} />
                                  <AvatarFallback>{favorite.providerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="font-semibold">{favorite.providerName}</p>
                                    {favorite.isVerified && (
                                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                  {favorite.specialty && (
                                    <p className="text-sm text-muted-foreground">{favorite.specialty}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{favorite.rating}</span>
                                    </div>
                                    {favorite.location && (
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {favorite.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFavorite(favorite.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Heart className="h-5 w-5 fill-current" />
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {language === "en" ? "Message" : "Ujumbe"}
                              </Button>
                              <Link href={favorite.providerType === "fundi" ? `/fundi/${favorite.providerId}` : `/shop/${favorite.providerId}`}>
                                <Button size="sm" variant="outline">
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Your Reviews" : "Maoni Yako"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Reviews you've written for services" : "Maoni uliyoandika kwa huduma"}
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
                      <div key={review.id} className="border rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={review.targetImage} />
                              <AvatarFallback>{review.targetName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{review.targetName}</p>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          {editingReview !== review.id && (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleStartEditReview(review)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(review.id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {editingReview === review.id ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-6 w-6 cursor-pointer transition-colors ${
                                    star <= editReviewData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300 hover:text-yellow-200"
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
                              <span className="ml-2 text-sm text-muted-foreground">
                                {review.helpful} {language === "en" ? "found helpful" : "wameona inasaidia"}
                              </span>
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

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Payment History" : "Historia ya Malipo"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Track all your transactions" : "Fuatilia miamala yako yote"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No payment history" : "Hakuna historia ya malipo"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${
                              payment.method === "mpesa" ? "bg-green-100 dark:bg-green-900" :
                              payment.method === "airtel" ? "bg-red-100 dark:bg-red-900" :
                              "bg-blue-100 dark:bg-blue-900"
                            }`}>
                              <CreditCard className={`h-5 w-5 ${
                                payment.method === "mpesa" ? "text-green-600" :
                                payment.method === "airtel" ? "text-red-600" :
                                "text-blue-600"
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.recipient} • {payment.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatAmount(payment.amount)}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Account Information" : "Taarifa za Akaunti"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{language === "en" ? "Full Name" : "Jina Kamili"}</Label>
                      <Input value={user?.name || ""} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "en" ? "Email" : "Barua pepe"}</Label>
                      <Input
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => handleSettingsChange("email", e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
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
                    <Button className="w-full">
                      {language === "en" ? "Update Profile" : "Sasisha Wasifu"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Notifications" : "Arifa"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label>{language === "en" ? "Marketing Emails" : "Barua pepe za Masoko"}</Label>
                      <Switch
                        checked={accountSettings.marketingEmails}
                        onCheckedChange={(checked) => handleSettingsChange("marketingEmails", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {language === "en" ? "Language" : "Lugha"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      {language === "en" ? "Help & Support" : "Msaada na Usaidizi"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/help">
                      <Button variant="outline" className="w-full justify-start">
                        {language === "en" ? "Help Center" : "Kituo cha Msaada"}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <Link href="/how-to-pay">
                      <Button variant="outline" className="w-full justify-start">
                        {language === "en" ? "Payment Guide" : "Mwongozo wa Malipo"}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
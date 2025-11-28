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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Wrench, Upload, MessageSquare, Star, Award, TrendingUp, 
  Zap, CheckCircle2, AlertCircle, Calendar, FileText, HelpCircle, Wallet
} from "lucide-react";
import Link from "next/link";

interface Achievement {
  id: string;
  title: { en: string; sw: string };
  description: { en: string; sw: string };
  earned: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  language: "en" | "sw";
}

export default function FundiDashboard() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  const [fundiData, setFundiData] = useState({
    bio: "",
    specialties: [] as string[],
    serviceAreas: "",
    whatsapp: "",
    certificates: [] as string[],
  });

  const [stats, setStats] = useState({
    averageRating: 4.8,
    totalJobs: 127,
    reviewCount: 98,
    responseTime: "< 1 hour",
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "top-rated",
      title: { en: "Top Rated", sw: "Ukadiriaji wa Juu" },
      description: { en: "Average rating ≥ 4.5", sw: "Wastani wa ukadiriaji ≥ 4.5" },
      earned: true,
      icon: Star,
    },
    {
      id: "trusted",
      title: { en: "Trusted Fundi", sw: "Fundi Mwaminifu" },
      description: { en: "Completed 50+ jobs", sw: "Umekamilisha kazi 50+" },
      earned: true,
      icon: Award,
    },
    {
      id: "fast-responder",
      title: { en: "Fast Responder", sw: "Mjibu wa Haraka" },
      description: { en: "Replies within 1 hour", sw: "Anajibu ndani ya saa 1" },
      earned: true,
      icon: Zap,
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "John Mwangi",
      rating: 5,
      comment: "Excellent work! Very professional and timely.",
      date: "2025-11-05",
      language: "en",
    },
    {
      id: "2",
      customerName: "Amina Hassan",
      rating: 5,
      comment: "Kazi nzuri sana! Fundi mzuri.",
      date: "2025-11-01",
      language: "sw",
    },
    {
      id: "3",
      customerName: "David Kimani",
      rating: 4,
      comment: "Good service, would recommend.",
      date: "2025-10-28",
      language: "en",
    },
  ]);

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: true,
    expiryDate: "2025-12-11",
    amount: "5,000 TZS",
    isPromoted: false,
    promotionExpiry: "",
  });

  const [reviewSortBy, setReviewSortBy] = useState<"date" | "rating">("date");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    const savedData = localStorage.getItem("fundi_dashboard_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFundiData(parsed.fundiData || fundiData);
      setReviews(parsed.reviews || reviews);
    }

    setLoading(false);
  }, [isAuthenticated, router]);

  const saveData = () => {
    localStorage.setItem("fundi_dashboard_data", JSON.stringify({
      fundiData,
      reviews,
    }));
  };

  const handleFundiDataChange = (field: string, value: string | string[]) => {
    setFundiData({ ...fundiData, [field]: value });
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.rating - a.rating;
  });

  const specialtyOptions = [
    "Electrician", "Plumber", "Carpenter", "Mechanic", "Welder",
    "Painter", "Mason", "HVAC Technician", "Appliance Repair"
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>{language === "en" ? "Fundi Dashboard - Smart Fundi" : "Dashibodi ya Fundi - Smart Fundi"}</title>
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                {language === "en" ? "Fundi Dashboard" : "Dashibodi ya Fundi"}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === "en" ? "Manage your professional profile" : "Dhibiti wasifu wako wa kitaalamu"}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.averageRating}</p>
                        <p className="text-xs text-muted-foreground">
                          {language === "en" ? "Avg Rating" : "Wastani"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.totalJobs}</p>
                        <p className="text-xs text-muted-foreground">
                          {language === "en" ? "Jobs Done" : "Kazi Zilizokamilika"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.reviewCount}</p>
                        <p className="text-xs text-muted-foreground">
                          {language === "en" ? "Reviews" : "Maoni"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">
                    {language === "en" ? "Profile" : "Wasifu"}
                  </TabsTrigger>
                  <TabsTrigger value="achievements">
                    {language === "en" ? "Achievements" : "Mafanikio"}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    {language === "en" ? "Reviews" : "Maoni"}
                  </TabsTrigger>
                  <TabsTrigger value="messages">
                    {language === "en" ? "Messages" : "Ujumbe"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Professional Information" : "Taarifa za Kitaalamu"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{language === "en" ? "Profile Photo" : "Picha ya Wasifu"}</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.photo} />
                            <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            {language === "en" ? "Change Photo" : "Badilisha Picha"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Bio" : "Maelezo"}</Label>
                        <Textarea
                          value={fundiData.bio}
                          onChange={(e) => handleFundiDataChange("bio", e.target.value)}
                          placeholder={language === "en" ? "Tell customers about yourself" : "Waambie wateja kuhusu wewe"}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Specialties" : "Ujuzi"}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={language === "en" ? "Select your specialties" : "Chagua ujuzi wako"} />
                          </SelectTrigger>
                          <SelectContent>
                            {specialtyOptions.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Service Areas" : "Maeneo ya Huduma"}</Label>
                        <Input
                          value={fundiData.serviceAreas}
                          onChange={(e) => handleFundiDataChange("serviceAreas", e.target.value)}
                          placeholder={language === "en" ? "e.g., Dar es Salaam, Kinondoni" : "mfano, Dar es Salaam, Kinondoni"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "WhatsApp (Optional)" : "WhatsApp (Si lazima)"}</Label>
                        <Input
                          value={fundiData.whatsapp}
                          onChange={(e) => handleFundiDataChange("whatsapp", e.target.value)}
                          placeholder="+255 7XX XXX XXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Certificates (Optional)" : "Vyeti (Si lazima)"}</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            {language === "en" ? "Upload certificates or ID for verification" : "Pakia vyeti au kitambulisho kwa uthibitisho"}
                          </p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            {language === "en" ? "Upload File" : "Pakia Faili"}
                          </Button>
                        </div>
                      </div>

                      <Button onClick={saveData} className="w-full">
                        {language === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Your Achievements" : "Mafanikio Yako"}</CardTitle>
                      <CardDescription>
                        {language === "en" ? "Badges earned based on your performance" : "Vitambulisho vilivyopatikana kulingana na utendaji wako"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {achievements.map((achievement) => {
                        const Icon = achievement.icon;
                        return (
                          <div 
                            key={achievement.id} 
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                              achievement.earned 
                                ? "border-green-500 bg-green-50 dark:bg-green-950" 
                                : "border-gray-200 dark:border-gray-800 opacity-50"
                            }`}
                          >
                            <div className={`p-3 rounded-lg ${
                              achievement.earned 
                                ? "bg-green-500" 
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {achievement.title[language]}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description[language]}
                              </p>
                            </div>
                            {achievement.earned && (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{language === "en" ? "Customer Reviews" : "Maoni ya Wateja"}</CardTitle>
                        <Select value={reviewSortBy} onValueChange={(value: "date" | "rating") => setReviewSortBy(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">
                              {language === "en" ? "By Date" : "Kwa Tarehe"}
                            </SelectItem>
                            <SelectItem value="rating">
                              {language === "en" ? "By Rating" : "Kwa Ukadiriaji"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sortedReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{review.customerName}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === "en" ? "Messages" : "Ujumbe"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {language === "en" ? "No messages yet" : "Hakuna ujumbe bado"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Subscription Status" : "Hali ya Usajili"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscriptionStatus.isActive ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "en" ? "Active" : "Inatumika"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Active until" : "Inatumika hadi"}
                        </p>
                        <p className="font-medium">{subscriptionStatus.expiryDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Monthly Fee" : "Ada ya Kila Mwezi"}
                        </p>
                        <p className="font-medium">{subscriptionStatus.amount}</p>
                      </div>
                      {subscriptionStatus.isPromoted && (
                        <Badge className="w-full justify-center bg-orange-500">
                          {language === "en" ? "Featured Listing Active" : "Uorodheshaji Maarufu Unafanya Kazi"}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "en" ? "Inactive" : "Haitumiki"}
                        </span>
                      </div>
                      <Button className="w-full">
                        {language === "en" ? "Renew Now" : "Rejea Sasa"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Promote Your Listing" : "Tangaza Uorodheshaji Wako"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Get featured placement for 1,500 TZS per day" 
                      : "Pata nafasi maalum kwa 1,500 TZS kwa siku"}
                  </p>
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {language === "en" ? "Get Featured" : "Pata Nafasi Maalum"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Quick Actions" : "Vitendo vya Haraka"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    {language === "en" ? "View Bookings" : "Angalia Maagizo"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {language === "en" ? "All Messages" : "Ujumbe Wote"}
                  </Button>
                  <Link href="/how-to-pay" className="w-full">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Wallet className="h-4 w-4" />
                      {language === "en" ? "How to Pay" : "Jinsi ya Kulipa"}
                    </Button>
                  </Link>
                  <Link href="/help" className="w-full">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <HelpCircle className="h-4 w-4" />
                      {language === "en" ? "Help & Support" : "Msaada na Usaidizi"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

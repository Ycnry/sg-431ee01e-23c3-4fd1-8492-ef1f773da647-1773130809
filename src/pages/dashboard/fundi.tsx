import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Settings,
  Bell,
  Wallet,
  CreditCard,
  Sparkles,
  Eye,
  ThumbsUp,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Shield,
  Award,
  Camera,
  Edit,
  Save,
  X
} from "lucide-react";

// Mock data for fundi dashboard
const mockJobs = [
  {
    id: "1",
    customerName: "Maria Joseph",
    customerAvatar: "",
    service: "Electrical Wiring",
    location: "Mikocheni, Dar es Salaam",
    date: "2026-03-18",
    time: "09:00",
    status: "pending",
    budget: 75000,
    description: "Need complete house rewiring for 3 bedroom house",
    urgency: "normal"
  },
  {
    id: "2",
    customerName: "John Makamba",
    customerAvatar: "",
    service: "Socket Installation",
    location: "Masaki, Dar es Salaam",
    date: "2026-03-19",
    time: "14:00",
    status: "accepted",
    budget: 25000,
    description: "Install 5 new electrical sockets in living room",
    urgency: "high"
  },
  {
    id: "3",
    customerName: "Grace Mwita",
    customerAvatar: "",
    service: "Generator Repair",
    location: "Kinondoni, Dar es Salaam",
    date: "2026-03-15",
    time: "10:00",
    status: "completed",
    budget: 150000,
    description: "5KVA generator not starting",
    urgency: "urgent"
  }
];

const mockEarnings = {
  today: 0,
  thisWeek: 175000,
  thisMonth: 850000,
  lastMonth: 720000,
  pending: 100000,
  totalJobs: 47,
  completedJobs: 42,
  cancelledJobs: 3
};

const mockReviews = [
  {
    id: "1",
    customerName: "Grace Mwita",
    rating: 5,
    comment: "Excellent work! Very professional and timely. Highly recommended!",
    date: "2026-03-15",
    service: "Generator Repair"
  },
  {
    id: "2",
    customerName: "Peter Kimaro",
    rating: 4,
    comment: "Good job on the wiring. Clean work.",
    date: "2026-03-10",
    service: "Electrical Wiring"
  },
  {
    id: "3",
    customerName: "Anna Swai",
    rating: 5,
    comment: "Fundi mzuri sana! Alifanya kazi nzuri.",
    date: "2026-03-05",
    service: "Socket Installation"
  }
];

const mockMessages = [
  {
    id: "1",
    customerName: "Maria Joseph",
    lastMessage: "Habari, je unaweza kuja kesho?",
    time: "10:30 AM",
    unread: true,
    avatar: ""
  },
  {
    id: "2",
    customerName: "John Makamba",
    lastMessage: "Asante sana kwa kazi nzuri!",
    time: "Yesterday",
    unread: false,
    avatar: ""
  }
];

export default function FundiDashboard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Juma Hassan",
    specialty: "Electrician",
    phone: "+255 712 345 678",
    whatsapp: "+255 712 345 678",
    city: "Dar es Salaam",
    bio: "Professional electrician with 8 years of experience in residential and commercial electrical work.",
    hourlyRate: 15000,
    avatar: ""
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    status: "active",
    plan: "monthly",
    expiresAt: "2026-04-15",
    daysRemaining: 29,
    isPromoted: false,
    promotionEndsAt: null as string | null
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; labelSw: string }> = {
      pending: { variant: "secondary", label: "Pending", labelSw: "Inasubiri" },
      accepted: { variant: "default", label: "Accepted", labelSw: "Imekubaliwa" },
      completed: { variant: "outline", label: "Completed", labelSw: "Imekamilika" },
      cancelled: { variant: "destructive", label: "Cancelled", labelSw: "Imeghairiwa" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant}>
        {language === "sw" ? config.labelSw : config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig: Record<string, { color: string; label: string; labelSw: string }> = {
      normal: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", label: "Normal", labelSw: "Kawaida" },
      high: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300", label: "High Priority", labelSw: "Kipaumbele" },
      urgent: { color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", label: "Urgent", labelSw: "Haraka" }
    };
    const config = urgencyConfig[urgency] || urgencyConfig.normal;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {language === "sw" ? config.labelSw : config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAcceptJob = (jobId: string) => {
    console.log("Accepting job:", jobId);
    // Update job status logic here
  };

  const handleDeclineJob = (jobId: string) => {
    console.log("Declining job:", jobId);
    // Update job status logic here
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;
  const completionRate = Math.round((mockEarnings.completedJobs / mockEarnings.totalJobs) * 100);
  const earningsGrowth = Math.round(((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100);

  return (
    <>
      <Head>
        <title>{language === "sw" ? "Dashibodi ya Fundi - Smart Fundi" : "Fundi Dashboard - Smart Fundi"}</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {language === "sw" ? `Habari, ${profile.name}!` : `Hello, ${profile.name}!`}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-primary/10">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {profile.specialty}
                    </Badge>
                    <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                      <Shield className="w-3 h-3 mr-1" />
                      {subscription.status === "active" 
                        ? (language === "sw" ? "Imeidhinishwa" : "Verified")
                        : (language === "sw" ? "Haijaidhinishwa" : "Not Verified")
                      }
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="availability" className="text-sm">
                    {language === "sw" ? "Upatikanaji" : "Available"}
                  </Label>
                  <Switch
                    id="availability"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                </div>
                <Badge variant={isAvailable ? "default" : "secondary"} className="px-3 py-1">
                  {isAvailable 
                    ? (language === "sw" ? "🟢 Ninapatikana" : "🟢 Available")
                    : (language === "sw" ? "🔴 Sipatikani" : "🔴 Unavailable")
                  }
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">
                      {language === "sw" ? "Mapato Mwezi Huu" : "This Month"}
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(mockEarnings.thisMonth)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {earningsGrowth > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-200" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-200" />
                      )}
                      <span className="text-xs text-green-100">{earningsGrowth}%</span>
                    </div>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">
                      {language === "sw" ? "Kazi Ziliokamilika" : "Jobs Completed"}
                    </p>
                    <p className="text-2xl font-bold">{mockEarnings.completedJobs}</p>
                    <p className="text-xs text-blue-100 mt-1">
                      {completionRate}% {language === "sw" ? "kiwango" : "rate"}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">
                      {language === "sw" ? "Ukadiriaji" : "Rating"}
                    </p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= averageRating ? "fill-yellow-200 text-yellow-200" : "text-yellow-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Award className="w-10 h-10 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">
                      {language === "sw" ? "Maombi Mapya" : "New Requests"}
                    </p>
                    <p className="text-2xl font-bold">
                      {mockJobs.filter(j => j.status === "pending").length}
                    </p>
                    <p className="text-xs text-purple-100 mt-1">
                      {language === "sw" ? "Inasubiri jibu" : "Awaiting response"}
                    </p>
                  </div>
                  <Bell className="w-10 h-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                <BarChart3 className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Muhtasari" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs md:text-sm">
                <Briefcase className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Kazi" : "Jobs"}
              </TabsTrigger>
              <TabsTrigger value="earnings" className="text-xs md:text-sm">
                <Wallet className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Mapato" : "Earnings"}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs md:text-sm">
                <Star className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Maoni" : "Reviews"}
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm">
                <Settings className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Mipangilio" : "Settings"}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pending Jobs */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      {language === "sw" ? "Maombi Yanayosubiri" : "Pending Requests"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockJobs.filter(j => j.status === "pending").length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        {language === "sw" ? "Hakuna maombi mapya" : "No pending requests"}
                      </p>
                    ) : (
                      mockJobs.filter(j => j.status === "pending").map((job) => (
                        <div key={job.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{job.service}</span>
                                {getUrgencyBadge(job.urgency)}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.location}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {job.date} • {job.time}
                              </p>
                              <p className="text-sm font-medium text-primary mt-1">
                                {formatCurrency(job.budget)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => handleAcceptJob(job.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === "sw" ? "Kubali" : "Accept"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeclineJob(job.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              {language === "sw" ? "Kataa" : "Decline"}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedJob(job)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{job.service}</DialogTitle>
                                  <DialogDescription>{job.customerName}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <p className="text-sm">{job.description}</p>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        {language === "sw" ? "Eneo:" : "Location:"}
                                      </span>
                                      <p>{job.location}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {language === "sw" ? "Bajeti:" : "Budget:"}
                                      </span>
                                      <p className="font-medium">{formatCurrency(job.budget)}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {language === "sw" ? "Tarehe:" : "Date:"}
                                      </span>
                                      <p>{job.date}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {language === "sw" ? "Muda:" : "Time:"}
                                      </span>
                                      <p>{job.time}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      {language === "sw" ? "Ujumbe wa Hivi Karibuni" : "Recent Messages"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          msg.unread ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/50"
                        }`}
                        onClick={() => router.push("/messages")}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>
                              {msg.customerName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{msg.customerName}</span>
                              <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{msg.lastMessage}</p>
                          </div>
                          {msg.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full" onClick={() => router.push("/messages")}>
                      {language === "sw" ? "Tazama Ujumbe Wote" : "View All Messages"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    {language === "sw" ? "Hali ya Usajili" : "Subscription Status"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                          {subscription.status === "active" 
                            ? (language === "sw" ? "Hai" : "Active")
                            : (language === "sw" ? "Imekwisha" : "Expired")
                          }
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {language === "sw" ? "Mpango wa Kila Mwezi" : "Monthly Plan"} - 5,000 TZS
                        </span>
                      </div>
                      <p className="text-sm">
                        {language === "sw" 
                          ? `Siku ${subscription.daysRemaining} zimebaki • Inaisha ${subscription.expiresAt}`
                          : `${subscription.daysRemaining} days remaining • Expires ${subscription.expiresAt}`
                        }
                      </p>
                      <Progress value={(subscription.daysRemaining / 30) * 100} className="h-2 mt-2 w-48" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Ongeza Muda" : "Renew"}
                      </Button>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Tangaza" : "Promote"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {language === "sw" ? "Kazi Zako" : "Your Jobs"}
                </h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "sw" ? "Zote" : "All"}</SelectItem>
                    <SelectItem value="pending">{language === "sw" ? "Zinasubiri" : "Pending"}</SelectItem>
                    <SelectItem value="accepted">{language === "sw" ? "Zimekubaliwa" : "Accepted"}</SelectItem>
                    <SelectItem value="completed">{language === "sw" ? "Zimekamilika" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {mockJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={job.customerAvatar} />
                            <AvatarFallback>
                              {job.customerName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{job.service}</h3>
                              {getStatusBadge(job.status)}
                              {getUrgencyBadge(job.urgency)}
                            </div>
                            <p className="text-sm text-muted-foreground">{job.customerName}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {job.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {job.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-primary">{formatCurrency(job.budget)}</p>
                          </div>
                          {job.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleAcceptJob(job.id)}>
                                {language === "sw" ? "Kubali" : "Accept"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeclineJob(job.id)}>
                                {language === "sw" ? "Kataa" : "Decline"}
                              </Button>
                            </div>
                          )}
                          {job.status === "accepted" && (
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {language === "sw" ? "Wasiliana" : "Contact"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {language === "sw" ? "Wiki Hii" : "This Week"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(mockEarnings.thisWeek)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {language === "sw" ? "Mwezi Huu" : "This Month"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(mockEarnings.thisMonth)}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +{earningsGrowth}% {language === "sw" ? "vs mwezi uliopita" : "vs last month"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {language === "sw" ? "Inasubiri Malipo" : "Pending Payout"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(mockEarnings.pending)}</p>
                    <Button size="sm" className="mt-2">
                      <Wallet className="w-4 h-4 mr-1" />
                      {language === "sw" ? "Toa Pesa" : "Withdraw"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "sw" ? "Historia ya Mapato" : "Earnings History"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockJobs.filter(j => j.status === "completed").map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{job.service}</p>
                          <p className="text-sm text-muted-foreground">{job.customerName} • {job.date}</p>
                        </div>
                        <p className="font-semibold text-green-600">+{formatCurrency(job.budget)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === "sw" ? "Maoni ya Wateja" : "Customer Reviews"}</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({mockReviews.length})</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-muted-foreground">{review.service} • {review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === "sw" ? "Wasifu Wako" : "Your Profile"}</span>
                    <Button variant="outline" size="sm" onClick={() => setShowEditProfile(!showEditProfile)}>
                      {showEditProfile ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                      {showEditProfile 
                        ? (language === "sw" ? "Ghairi" : "Cancel")
                        : (language === "sw" ? "Hariri" : "Edit")
                      }
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showEditProfile ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-2xl">
                            {profile.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-1" />
                          {language === "sw" ? "Badilisha Picha" : "Change Photo"}
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jina Kamili" : "Full Name"}</Label>
                          <Input 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Utaalamu" : "Specialty"}</Label>
                          <Input 
                            value={profile.specialty} 
                            onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Namba ya Simu" : "Phone Number"}</Label>
                          <Input 
                            value={profile.phone} 
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>WhatsApp</Label>
                          <Input 
                            value={profile.whatsapp} 
                            onChange={(e) => setProfile({...profile, whatsapp: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jiji" : "City"}</Label>
                          <Select value={profile.city} onValueChange={(v) => setProfile({...profile, city: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                              <SelectItem value="Arusha">Arusha</SelectItem>
                              <SelectItem value="Mwanza">Mwanza</SelectItem>
                              <SelectItem value="Dodoma">Dodoma</SelectItem>
                              <SelectItem value="Mbeya">Mbeya</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Bei kwa Saa (TZS)" : "Hourly Rate (TZS)"}</Label>
                          <Input 
                            type="number"
                            value={profile.hourlyRate} 
                            onChange={(e) => setProfile({...profile, hourlyRate: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "sw" ? "Maelezo Yako" : "Your Bio"}</Label>
                        <Textarea 
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <Button className="w-full md:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Hifadhi Mabadiliko" : "Save Changes"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-2xl">
                            {profile.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{profile.name}</h3>
                          <p className="text-muted-foreground">{profile.specialty}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.city}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "sw" ? "Arifa" : "Notifications"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{language === "sw" ? "Maombi Mapya ya Kazi" : "New Job Requests"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Pokea arifa za kazi mpya" : "Get notified of new job requests"}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{language === "sw" ? "Ujumbe" : "Messages"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Arifa za ujumbe mpya" : "New message notifications"}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{language === "sw" ? "Maoni Mapya" : "New Reviews"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Arifa unapopokea maoni" : "Get notified when you receive reviews"}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { updateSupportHotline, getSupportHotline } from "@/lib/settings";
import {
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Settings,
  Bell,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  UserCheck,
  AlertTriangle,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  MessageSquare,
  CreditCard,
  Sparkles,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Star,
  Flag,
  Lock,
  Unlock,
  UserX,
  Building2
} from "lucide-react";

// Mock data for admin dashboard
const mockPendingApprovals = [
  {
    id: "1",
    type: "fundi",
    name: "Juma Hassan",
    email: "juma@example.com",
    phone: "+255 712 345 678",
    specialty: "Electrician",
    city: "Dar es Salaam",
    submittedAt: "2026-03-16",
    documents: ["ID Card", "Certificate"],
    avatar: ""
  },
  {
    id: "2",
    type: "fundi",
    name: "Maria Joseph",
    email: "maria@example.com",
    phone: "+255 754 321 098",
    specialty: "Plumber",
    city: "Arusha",
    submittedAt: "2026-03-15",
    documents: ["ID Card"],
    avatar: ""
  },
  {
    id: "3",
    type: "shop",
    name: "Kariakoo Hardware",
    email: "info@kariakoo.co.tz",
    phone: "+255 222 123 456",
    specialty: "Hardware Store",
    city: "Dar es Salaam",
    submittedAt: "2026-03-14",
    documents: ["Business License", "TIN Certificate"],
    avatar: ""
  }
];

const mockUsers = [
  {
    id: "1",
    name: "John Makamba",
    email: "john@example.com",
    phone: "+255 789 456 123",
    role: "customer",
    status: "active",
    joinedAt: "2026-01-15",
    lastActive: "2026-03-17",
    avatar: ""
  },
  {
    id: "2",
    name: "Juma Hassan",
    email: "juma@example.com",
    phone: "+255 712 345 678",
    role: "fundi",
    status: "active",
    joinedAt: "2026-02-01",
    lastActive: "2026-03-17",
    subscriptionStatus: "active",
    avatar: ""
  },
  {
    id: "3",
    name: "Kariakoo Hardware",
    email: "info@kariakoo.co.tz",
    phone: "+255 222 123 456",
    role: "shop",
    status: "active",
    joinedAt: "2026-02-15",
    lastActive: "2026-03-16",
    subscriptionStatus: "active",
    avatar: ""
  },
  {
    id: "4",
    name: "Grace Mwita",
    email: "grace@example.com",
    phone: "+255 765 432 109",
    role: "customer",
    status: "suspended",
    joinedAt: "2026-03-01",
    lastActive: "2026-03-10",
    avatar: ""
  }
];

const mockEvents = [
  {
    id: "1",
    title: "Electrical Safety Workshop",
    organizer: "VETA Dar es Salaam",
    date: "2026-03-25",
    location: "VETA Campus, Dar",
    status: "approved",
    fee: 25000,
    expectedAttendees: 50
  },
  {
    id: "2",
    title: "Plumbing Certification Course",
    organizer: "Tanzania Skills Foundation",
    date: "2026-04-10",
    location: "Arusha Technical College",
    status: "pending",
    fee: 25000,
    expectedAttendees: 30
  }
];

const mockRevenue = {
  today: 125000,
  thisWeek: 875000,
  thisMonth: 3500000,
  lastMonth: 2800000,
  subscriptions: {
    fundi: { active: 245, revenue: 1225000 },
    shop: { active: 42, revenue: 630000 }
  },
  promotions: {
    listings: 156,
    revenue: 234000
  },
  events: {
    approved: 8,
    revenue: 200000
  }
};

const mockSecurityLogs = [
  {
    id: "1",
    type: "rate_limit",
    ip: "192.168.1.100",
    endpoint: "/api/auth/login",
    timestamp: "2026-03-17 10:30:00",
    details: "5 failed login attempts"
  },
  {
    id: "2",
    type: "validation_failure",
    ip: "192.168.1.105",
    endpoint: "/api/auth/signup",
    timestamp: "2026-03-17 09:15:00",
    details: "Invalid phone format"
  },
  {
    id: "3",
    type: "suspicious_activity",
    ip: "10.0.0.50",
    endpoint: "/api/payments/mpesa",
    timestamp: "2026-03-16 22:45:00",
    details: "Multiple payment attempts"
  }
];

const mockReports = [
  {
    id: "1",
    reportedUser: "Fake Electrician",
    reportedBy: "John Makamba",
    reason: "Fraudulent profile",
    status: "pending",
    date: "2026-03-16"
  },
  {
    id: "2",
    reportedUser: "Spam Shop",
    reportedBy: "Maria Joseph",
    reason: "Spam messages",
    status: "resolved",
    date: "2026-03-14"
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<typeof mockPendingApprovals[0] | null>(null);
  const [supportHotline, setSupportHotline] = useState(getSupportHotline());
  const [hotlineSaved, setHotlineSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const formatCurrency = (amount: number, currency: "TZS" | "USD" = "TZS") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
      }).format(amount / 2500); // Approximate TZS to USD
    }
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; labelSw: string }> = {
      active: { variant: "default", label: "Active", labelSw: "Hai" },
      pending: { variant: "secondary", label: "Pending", labelSw: "Inasubiri" },
      approved: { variant: "default", label: "Approved", labelSw: "Imeidhinishwa" },
      rejected: { variant: "destructive", label: "Rejected", labelSw: "Imekataliwa" },
      suspended: { variant: "destructive", label: "Suspended", labelSw: "Imesimamishwa" },
      resolved: { variant: "outline", label: "Resolved", labelSw: "Imetatuliwa" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant}>
        {language === "sw" ? config.labelSw : config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string; labelSw: string; icon: React.ReactNode }> = {
      customer: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", label: "Customer", labelSw: "Mteja", icon: <Users className="w-3 h-3" /> },
      fundi: { color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", label: "Fundi", labelSw: "Fundi", icon: <Briefcase className="w-3 h-3" /> },
      shop: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", label: "Shop", labelSw: "Duka", icon: <Store className="w-3 h-3" /> },
      admin: { color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", label: "Admin", labelSw: "Msimamizi", icon: <Shield className="w-3 h-3" /> }
    };
    const config = roleConfig[role] || roleConfig.customer;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {language === "sw" ? config.labelSw : config.label}
      </span>
    );
  };

  const handleApprove = (id: string) => {
    console.log("Approving:", id);
    // API call to approve user
  };

  const handleReject = (id: string) => {
    console.log("Rejecting:", id);
    // API call to reject user
  };

  const handleSuspend = (id: string) => {
    console.log("Suspending:", id);
    // API call to suspend user
  };

  const handleSaveHotline = () => {
    const success = updateSupportHotline(supportHotline);
    if (success) {
      setHotlineSaved(true);
      setTimeout(() => setHotlineSaved(false), 3000);
    }
  };

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === "all" || u.role === userFilter || u.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const revenueGrowth = Math.round(((mockRevenue.thisMonth - mockRevenue.lastMonth) / mockRevenue.lastMonth) * 100);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{language === "sw" ? "Dashibodi ya Msimamizi - Smart Fundi" : "Admin Dashboard - Smart Fundi"}</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Admin Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === "sw" ? "Dashibodi ya Msimamizi" : "Admin Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "sw" ? "Simamia Smart Fundi" : "Manage Smart Fundi Platform"}
                </p>
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
                      {language === "sw" ? "Mapato Mwezi Huu" : "This Month Revenue"}
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(mockRevenue.thisMonth)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {revenueGrowth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-200" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-200" />
                      )}
                      <span className="text-xs text-green-100">{revenueGrowth > 0 ? "+" : ""}{revenueGrowth}%</span>
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
                      {language === "sw" ? "Mafundi Hai" : "Active Fundis"}
                    </p>
                    <p className="text-2xl font-bold">{mockRevenue.subscriptions.fundi.active}</p>
                    <p className="text-xs text-blue-100 mt-1">
                      {formatCurrency(mockRevenue.subscriptions.fundi.revenue)}
                    </p>
                  </div>
                  <Briefcase className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">
                      {language === "sw" ? "Maduka Hai" : "Active Shops"}
                    </p>
                    <p className="text-2xl font-bold">{mockRevenue.subscriptions.shop.active}</p>
                    <p className="text-xs text-purple-100 mt-1">
                      {formatCurrency(mockRevenue.subscriptions.shop.revenue)}
                    </p>
                  </div>
                  <Store className="w-10 h-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">
                      {language === "sw" ? "Inasubiri Idhini" : "Pending Approvals"}
                    </p>
                    <p className="text-2xl font-bold">{mockPendingApprovals.length}</p>
                    <p className="text-xs text-orange-100 mt-1">
                      {language === "sw" ? "Inahitaji hatua" : "Requires action"}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[800px]">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                <LayoutDashboard className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Muhtasari" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="approvals" className="text-xs md:text-sm">
                <UserCheck className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Idhini" : "Approvals"}
                {mockPendingApprovals.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {mockPendingApprovals.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs md:text-sm">
                <Users className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Watumiaji" : "Users"}
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs md:text-sm">
                <Calendar className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Matukio" : "Events"}
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs md:text-sm">
                <Shield className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Usalama" : "Security"}
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm">
                <Settings className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Mipangilio" : "Settings"}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      {language === "sw" ? "Mgawanyo wa Mapato" : "Revenue Breakdown"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{language === "sw" ? "Usajili wa Mafundi" : "Fundi Subscriptions"}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(mockRevenue.subscriptions.fundi.revenue)}</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">{language === "sw" ? "Usajili wa Maduka" : "Shop Subscriptions"}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(mockRevenue.subscriptions.shop.revenue)}</span>
                      </div>
                      <Progress value={18} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{language === "sw" ? "Matangazo" : "Promotions"}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(mockRevenue.promotions.revenue)}</span>
                      </div>
                      <Progress value={7} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{language === "sw" ? "Matukio" : "Events"}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(mockRevenue.events.revenue)}</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{language === "sw" ? "Jumla" : "Total"}</span>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(mockRevenue.thisMonth)}</p>
                          <p className="text-sm text-muted-foreground">≈ {formatCurrency(mockRevenue.thisMonth, "USD")}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      {language === "sw" ? "Shughuli za Hivi Karibuni" : "Recent Activity"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPendingApprovals.slice(0, 3).map((approval) => (
                        <div key={approval.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={approval.avatar} />
                            <AvatarFallback>
                              {approval.type === "shop" ? <Store className="w-5 h-5" /> : approval.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{approval.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {language === "sw" ? "Maombi mapya ya" : "New"} {approval.type} {language === "sw" ? "" : "application"}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            {language === "sw" ? "Mpya" : "New"}
                          </Badge>
                        </div>
                      ))}
                      
                      {mockSecurityLogs.slice(0, 2).map((log) => (
                        <div key={log.id} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{log.type.replace("_", " ")}</p>
                            <p className="text-xs text-muted-foreground">{log.details}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{log.timestamp.split(" ")[1]}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-3" onClick={() => setActiveTab("approvals")}>
                      {language === "sw" ? "Tazama Zote" : "View All"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    {language === "sw" ? "Takwimu za Jukwaa" : "Platform Statistics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{mockUsers.filter(u => u.role === "customer").length}</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Wateja" : "Customers"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{mockRevenue.subscriptions.fundi.active}</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Mafundi" : "Fundis"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{mockRevenue.subscriptions.shop.active}</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Maduka" : "Shops"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600">{mockRevenue.events.approved}</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Matukio" : "Events"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      {language === "sw" ? "Maombi Yanayosubiri Idhini" : "Pending Approvals"}
                    </span>
                    <Badge variant="secondary">{mockPendingApprovals.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockPendingApprovals.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        {language === "sw" ? "Hakuna maombi yanayosubiri" : "No pending approvals"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockPendingApprovals.map((approval) => (
                        <div key={approval.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={approval.avatar} />
                                <AvatarFallback>
                                  {approval.type === "shop" ? <Store className="w-6 h-6" /> : approval.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{approval.name}</h3>
                                  {getRoleBadge(approval.type)}
                                </div>
                                <p className="text-sm text-muted-foreground">{approval.specialty}</p>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {approval.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {approval.phone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {approval.city}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{approval.documents.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-xs text-muted-foreground text-right">
                                {language === "sw" ? "Iliyowasilishwa" : "Submitted"}: {approval.submittedAt}
                              </p>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedApproval(approval)}>
                                      <Eye className="w-4 h-4 mr-1" />
                                      {language === "sw" ? "Angalia" : "View"}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{approval.name}</DialogTitle>
                                      <DialogDescription>{approval.specialty} - {approval.city}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <Label className="text-muted-foreground">{language === "sw" ? "Barua pepe" : "Email"}</Label>
                                          <p>{approval.email}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">{language === "sw" ? "Simu" : "Phone"}</Label>
                                          <p>{approval.phone}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">{language === "sw" ? "Nyaraka" : "Documents"}</Label>
                                          <p>{approval.documents.join(", ")}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">{language === "sw" ? "Tarehe" : "Date"}</Label>
                                          <p>{approval.submittedAt}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 pt-4">
                                        <Button className="flex-1" onClick={() => handleApprove(approval.id)}>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          {language === "sw" ? "Idhinisha" : "Approve"}
                                        </Button>
                                        <Button variant="destructive" className="flex-1" onClick={() => handleReject(approval.id)}>
                                          <XCircle className="w-4 h-4 mr-2" />
                                          {language === "sw" ? "Kataa" : "Reject"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button size="sm" onClick={() => handleApprove(approval.id)}>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {language === "sw" ? "Idhinisha" : "Approve"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  {language === "sw" ? "Kataa" : "Reject"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === "sw" ? "Usimamizi wa Watumiaji" : "User Management"}</span>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder={language === "sw" ? "Tafuta..." : "Search..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-48"
                        />
                      </div>
                      <Select value={userFilter} onValueChange={setUserFilter}>
                        <SelectTrigger className="w-32">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === "sw" ? "Wote" : "All"}</SelectItem>
                          <SelectItem value="customer">{language === "sw" ? "Wateja" : "Customers"}</SelectItem>
                          <SelectItem value="fundi">{language === "sw" ? "Mafundi" : "Fundis"}</SelectItem>
                          <SelectItem value="shop">{language === "sw" ? "Maduka" : "Shops"}</SelectItem>
                          <SelectItem value="active">{language === "sw" ? "Hai" : "Active"}</SelectItem>
                          <SelectItem value="suspended">{language === "sw" ? "Wamesimamishwa" : "Suspended"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "sw" ? "Mtumiaji" : "User"}</TableHead>
                        <TableHead>{language === "sw" ? "Jukumu" : "Role"}</TableHead>
                        <TableHead>{language === "sw" ? "Hali" : "Status"}</TableHead>
                        <TableHead>{language === "sw" ? "Alijiunga" : "Joined"}</TableHead>
                        <TableHead>{language === "sw" ? "Vitendo" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.role === "shop" ? <Store className="w-5 h-5" /> : user.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.joinedAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {user.status === "active" ? (
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleSuspend(user.id)}>
                                  <Ban className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-green-600">
                                  <Unlock className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === "sw" ? "Usimamizi wa Matukio" : "Event Management"}</span>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {language === "sw" ? "Ongeza Tukio" : "Add Event"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              {getStatusBadge(event.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{event.organizer}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {event.expectedAttendees} {language === "sw" ? "wanaosubiri" : "expected"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-primary">{formatCurrency(event.fee)}</p>
                              <p className="text-xs text-muted-foreground">{language === "sw" ? "Ada" : "Fee"}</p>
                            </div>
                            <div className="flex gap-2">
                              {event.status === "pending" && (
                                <>
                                  <Button size="sm" onClick={() => handleApprove(event.id)}>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {language === "sw" ? "Idhinisha" : "Approve"}
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleReject(event.id)}>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    {language === "sw" ? "Kataa" : "Reject"}
                                  </Button>
                                </>
                              )}
                              {event.status === "approved" && (
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  {language === "sw" ? "Hariri" : "Edit"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Security Logs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      {language === "sw" ? "Kumbukumbu za Usalama" : "Security Logs"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockSecurityLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant={log.type === "suspicious_activity" ? "destructive" : "secondary"}>
                              {log.type.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                          </div>
                          <p className="text-sm">{log.details}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>IP: {log.ip}</span>
                            <span>{log.endpoint}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="w-4 h-4 mr-2" />
                      {language === "sw" ? "Pakua Ripoti" : "Export Logs"}
                    </Button>
                  </CardContent>
                </Card>

                {/* User Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-orange-500" />
                      {language === "sw" ? "Ripoti za Watumiaji" : "User Reports"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockReports.map((report) => (
                        <div key={report.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{report.reportedUser}</p>
                              <p className="text-sm text-muted-foreground">{report.reason}</p>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{language === "sw" ? "Iliyoripotiwa na" : "Reported by"}: {report.reportedBy}</span>
                            <span>{report.date}</span>
                          </div>
                          {report.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="w-4 h-4 mr-1" />
                                {language === "sw" ? "Chunguza" : "Investigate"}
                              </Button>
                              <Button size="sm" variant="destructive">
                                <UserX className="w-4 h-4 mr-1" />
                                {language === "sw" ? "Simamisha" : "Suspend"}
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rate Limit Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    {language === "sw" ? "Takwimu za Kiwango cha Ombi" : "Rate Limit Statistics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-red-500">23</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Majaribio ya Kuingia" : "Login Attempts"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-500">8</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Uthibitishaji Batili" : "Validation Failures"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-500">5</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "IP Zilizozuiwa" : "Blocked IPs"}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">99.2%</p>
                      <p className="text-sm text-muted-foreground">{language === "sw" ? "Ombi Halali" : "Valid Requests"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Support Hotline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-500" />
                      {language === "sw" ? "Namba ya Msaada" : "Support Hotline"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{language === "sw" ? "Namba ya Simu" : "Phone Number"}</Label>
                      <Input
                        value={supportHotline}
                        onChange={(e) => setSupportHotline(e.target.value)}
                        placeholder="+255 XXX XXX XXX"
                      />
                    </div>
                    <Button onClick={handleSaveHotline} disabled={hotlineSaved}>
                      {hotlineSaved ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === "sw" ? "Imehifadhiwa!" : "Saved!"}
                        </>
                      ) : (
                        <>
                          {language === "sw" ? "Hifadhi" : "Save"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Platform Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-500" />
                      {language === "sw" ? "Mipangilio ya Jukwaa" : "Platform Settings"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Usajili Mpya" : "New Registrations"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Ruhusu usajili mpya" : "Allow new user registrations"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Malipo ya M-Pesa" : "M-Pesa Payments"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Washa malipo ya M-Pesa" : "Enable M-Pesa payments"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Hali ya Matengenezo" : "Maintenance Mode"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Zima jukwaa kwa matengenezo" : "Disable platform for maintenance"}
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      {language === "sw" ? "Bei za Usajili" : "Subscription Pricing"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{language === "sw" ? "Usajili wa Fundi (TZS/mwezi)" : "Fundi Subscription (TZS/month)"}</Label>
                      <Input type="number" defaultValue="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "sw" ? "Usajili wa Duka (TZS/mwezi)" : "Shop Subscription (TZS/month)"}</Label>
                      <Input type="number" defaultValue="15000" />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "sw" ? "Tangazo la Siku (TZS)" : "Daily Promotion (TZS)"}</Label>
                      <Input type="number" defaultValue="1500" />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "sw" ? "Ada ya Tukio (TZS)" : "Event Fee (TZS)"}</Label>
                      <Input type="number" defaultValue="25000" />
                    </div>
                    <Button className="w-full">
                      {language === "sw" ? "Hifadhi Bei" : "Save Pricing"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-500" />
                      {language === "sw" ? "Arifa za Msimamizi" : "Admin Notifications"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Usajili Mpya" : "New Registrations"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Arifa ya usajili mpya" : "Notify on new registrations"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Arifa za Usalama" : "Security Alerts"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Arifa za shughuli za shaka" : "Alert on suspicious activity"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{language === "sw" ? "Ripoti za Watumiaji" : "User Reports"}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "sw" ? "Arifa ya ripoti mpya" : "Notify on new reports"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
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
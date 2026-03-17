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
  Store, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  Clock,
  MapPin,
  Phone,
  TrendingUp,
  TrendingDown,
  Users,
  Settings,
  Bell,
  CreditCard,
  Sparkles,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BarChart3,
  Shield,
  Camera,
  Save,
  X,
  ChevronRight,
  Calendar,
  DollarSign,
  Boxes,
  Tag,
  Percent,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";

// Mock data for shop dashboard
const mockProducts = [
  {
    id: "1",
    name: "Electrical Wire (2.5mm)",
    category: "Electrical",
    price: 45000,
    stock: 150,
    unit: "roll",
    image: "",
    status: "active",
    sales: 45
  },
  {
    id: "2",
    name: "Circuit Breaker 32A",
    category: "Electrical",
    price: 25000,
    stock: 30,
    unit: "piece",
    image: "",
    status: "active",
    sales: 28
  },
  {
    id: "3",
    name: "PVC Pipe 3 inch",
    category: "Plumbing",
    price: 15000,
    stock: 5,
    unit: "piece",
    image: "",
    status: "low_stock",
    sales: 67
  },
  {
    id: "4",
    name: "Paint Bucket (White) 20L",
    category: "Paint",
    price: 85000,
    stock: 0,
    unit: "bucket",
    image: "",
    status: "out_of_stock",
    sales: 12
  }
];

const mockOrders = [
  {
    id: "ORD001",
    customerName: "Juma Hassan",
    items: ["Electrical Wire (2.5mm) x2", "Circuit Breaker 32A x4"],
    total: 190000,
    status: "pending",
    date: "2026-03-17",
    phone: "+255 712 345 678"
  },
  {
    id: "ORD002",
    customerName: "Maria Joseph",
    items: ["PVC Pipe 3 inch x10"],
    total: 150000,
    status: "confirmed",
    date: "2026-03-16",
    phone: "+255 754 321 098"
  },
  {
    id: "ORD003",
    customerName: "Peter Kimaro",
    items: ["Paint Bucket (White) 20L x2"],
    total: 170000,
    status: "completed",
    date: "2026-03-15",
    phone: "+255 789 456 123"
  }
];

const mockInquiries = [
  {
    id: "1",
    customerName: "Grace Mwita",
    message: "Je, mna waya wa umeme wa 4mm?",
    time: "10:30 AM",
    unread: true,
    avatar: ""
  },
  {
    id: "2",
    customerName: "John Makamba",
    message: "Bei ya mabomba ya chuma ni kiasi gani?",
    time: "Yesterday",
    unread: true,
    avatar: ""
  },
  {
    id: "3",
    customerName: "Anna Swai",
    message: "Asante, nitakuja kuchukua kesho",
    time: "2 days ago",
    unread: false,
    avatar: ""
  }
];

const mockSalesData = {
  today: 450000,
  thisWeek: 2150000,
  thisMonth: 8750000,
  lastMonth: 7200000,
  totalOrders: 156,
  completedOrders: 142,
  pendingOrders: 14
};

const mockReviews = [
  {
    id: "1",
    customerName: "Juma Hassan",
    rating: 5,
    comment: "Duka zuri sana! Bei nzuri na bidhaa bora.",
    date: "2026-03-15"
  },
  {
    id: "2",
    customerName: "Maria Joseph",
    rating: 4,
    comment: "Good products, fast service.",
    date: "2026-03-12"
  }
];

const categories = [
  { id: "electrical", name: { en: "Electrical", sw: "Umeme" } },
  { id: "plumbing", name: { en: "Plumbing", sw: "Mabomba" } },
  { id: "paint", name: { en: "Paint & Finishes", sw: "Rangi" } },
  { id: "tools", name: { en: "Tools", sw: "Zana" } },
  { id: "hardware", name: { en: "Hardware", sw: "Vifaa" } },
  { id: "safety", name: { en: "Safety Equipment", sw: "Vifaa vya Usalama" } }
];

export default function ShopDashboard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [productFilter, setProductFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Shop profile state
  const [profile, setProfile] = useState({
    name: "Fundi Hardware & Electrical",
    logo: "",
    phone: "+255 222 123 456",
    whatsapp: "+255 712 345 678",
    city: "Dar es Salaam",
    ward: "Kariakoo",
    address: "Kariakoo Market, Block A, Shop 15",
    description: "Your one-stop shop for all electrical, plumbing, and hardware supplies. Quality products at competitive prices.",
    openingHours: {
      weekdays: "08:00 - 18:00",
      saturday: "08:00 - 16:00",
      sunday: "Closed"
    },
    categories: ["electrical", "plumbing", "hardware"]
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    status: "active",
    plan: "monthly",
    expiresAt: "2026-04-15",
    daysRemaining: 29,
    isPromoted: true,
    promotionEndsAt: "2026-03-20"
  });

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "piece",
    description: ""
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; labelSw: string }> = {
      active: { variant: "default", label: "Active", labelSw: "Hai" },
      low_stock: { variant: "secondary", label: "Low Stock", labelSw: "Stoki Ndogo" },
      out_of_stock: { variant: "destructive", label: "Out of Stock", labelSw: "Imeisha" },
      pending: { variant: "secondary", label: "Pending", labelSw: "Inasubiri" },
      confirmed: { variant: "default", label: "Confirmed", labelSw: "Imethibitishwa" },
      completed: { variant: "outline", label: "Completed", labelSw: "Imekamilika" }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge variant={config.variant}>
        {language === "sw" ? config.labelSw : config.label}
      </Badge>
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesFilter = productFilter === "all" || product.status === productFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const salesGrowth = Math.round(((mockSalesData.thisMonth - mockSalesData.lastMonth) / mockSalesData.lastMonth) * 100);
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;
  const lowStockCount = mockProducts.filter(p => p.status === "low_stock" || p.status === "out_of_stock").length;
  const unreadInquiries = mockInquiries.filter(i => i.unread).length;

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
        <title>{language === "sw" ? "Dashibodi ya Duka - Smart Fundi" : "Shop Dashboard - Smart Fundi"}</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={profile.logo} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    <Store className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-primary/10">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.ward}, {profile.city}
                    </Badge>
                    <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                      <Shield className="w-3 h-3 mr-1" />
                      {subscription.status === "active" 
                        ? (language === "sw" ? "Imethibitishwa" : "Verified")
                        : (language === "sw" ? "Haijathibitishwa" : "Not Verified")
                      }
                    </Badge>
                    {subscription.isPromoted && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {language === "sw" ? "Inatangazwa" : "Promoted"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="store-status" className="text-sm">
                    {language === "sw" ? "Duka Limefunguliwa" : "Store Open"}
                  </Label>
                  <Switch
                    id="store-status"
                    checked={isOpen}
                    onCheckedChange={setIsOpen}
                  />
                </div>
                <Badge variant={isOpen ? "default" : "secondary"} className="px-3 py-1">
                  {isOpen 
                    ? (language === "sw" ? "🟢 Wazi" : "🟢 Open")
                    : (language === "sw" ? "🔴 Imefungwa" : "🔴 Closed")
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
                      {language === "sw" ? "Mauzo Mwezi Huu" : "This Month Sales"}
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(mockSalesData.thisMonth)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {salesGrowth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-200" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-200" />
                      )}
                      <span className="text-xs text-green-100">{salesGrowth > 0 ? "+" : ""}{salesGrowth}%</span>
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
                      {language === "sw" ? "Maagizo" : "Orders"}
                    </p>
                    <p className="text-2xl font-bold">{mockSalesData.totalOrders}</p>
                    <p className="text-xs text-blue-100 mt-1">
                      {mockSalesData.pendingOrders} {language === "sw" ? "inasubiri" : "pending"}
                    </p>
                  </div>
                  <ShoppingCart className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">
                      {language === "sw" ? "Stoki Ndogo" : "Low Stock"}
                    </p>
                    <p className="text-2xl font-bold">{lowStockCount}</p>
                    <p className="text-xs text-orange-100 mt-1">
                      {language === "sw" ? "bidhaa zinahitaji kuagiza" : "items need restock"}
                    </p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">
                      {language === "sw" ? "Maswali" : "Inquiries"}
                    </p>
                    <p className="text-2xl font-bold">{unreadInquiries}</p>
                    <p className="text-xs text-purple-100 mt-1">
                      {language === "sw" ? "haijasomwa" : "unread"}
                    </p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-purple-200" />
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
              <TabsTrigger value="products" className="text-xs md:text-sm">
                <Package className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Bidhaa" : "Products"}
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs md:text-sm">
                <ShoppingCart className="w-4 h-4 mr-1 hidden md:inline" />
                {language === "sw" ? "Maagizo" : "Orders"}
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
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-500" />
                      {language === "sw" ? "Maagizo ya Hivi Karibuni" : "Recent Orders"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground truncate">{order.items.join(", ")}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-primary">{formatCurrency(order.total)}</span>
                          <span className="text-xs text-muted-foreground">{order.date}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full" onClick={() => setActiveTab("orders")}>
                      {language === "sw" ? "Tazama Maagizo Yote" : "View All Orders"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Customer Inquiries */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      {language === "sw" ? "Maswali ya Wateja" : "Customer Inquiries"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockInquiries.map((inquiry) => (
                      <div 
                        key={inquiry.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          inquiry.unread ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/50"
                        }`}
                        onClick={() => router.push("/messages")}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={inquiry.avatar} />
                            <AvatarFallback>
                              {inquiry.customerName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{inquiry.customerName}</span>
                              <span className="text-xs text-muted-foreground">{inquiry.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{inquiry.message}</p>
                          </div>
                          {inquiry.unread && (
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

              {/* Subscription & Promotion Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    {language === "sw" ? "Usajili na Matangazo" : "Subscription & Promotions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                          {subscription.status === "active" 
                            ? (language === "sw" ? "Hai" : "Active")
                            : (language === "sw" ? "Imekwisha" : "Expired")
                          }
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {language === "sw" ? "Mpango wa Duka" : "Shop Plan"} - 15,000 TZS/{language === "sw" ? "mwezi" : "month"}
                        </span>
                      </div>
                      <p className="text-sm">
                        {language === "sw" 
                          ? `Siku ${subscription.daysRemaining} zimebaki • Inaisha ${subscription.expiresAt}`
                          : `${subscription.daysRemaining} days remaining • Expires ${subscription.expiresAt}`
                        }
                      </p>
                      <Progress value={(subscription.daysRemaining / 30) * 100} className="h-2 w-48" />
                      
                      {subscription.isPromoted && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          {language === "sw" 
                            ? `Tangazo linaisha ${subscription.promotionEndsAt}`
                            : `Promotion ends ${subscription.promotionEndsAt}`
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Ongeza Muda" : "Renew"}
                      </Button>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Tangaza Duka" : "Promote Shop"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              {lowStockCount > 0 && (
                <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-400">
                      <AlertCircle className="w-5 h-5" />
                      {language === "sw" ? "Onyo la Stoki" : "Stock Alert"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockProducts.filter(p => p.status === "low_stock" || p.status === "out_of_stock").map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {language === "sw" ? "Stoki" : "Stock"}: {product.stock} {product.unit}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(product.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={language === "sw" ? "Tafuta bidhaa..." : "Search products..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={productFilter} onValueChange={setProductFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === "sw" ? "Zote" : "All"}</SelectItem>
                      <SelectItem value="active">{language === "sw" ? "Hai" : "Active"}</SelectItem>
                      <SelectItem value="low_stock">{language === "sw" ? "Stoki Ndogo" : "Low Stock"}</SelectItem>
                      <SelectItem value="out_of_stock">{language === "sw" ? "Imeisha" : "Out of Stock"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {language === "sw" ? "Ongeza Bidhaa" : "Add Product"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {language === "sw" ? "Ongeza Bidhaa Mpya" : "Add New Product"}
                      </DialogTitle>
                      <DialogDescription>
                        {language === "sw" 
                          ? "Jaza maelezo ya bidhaa yako"
                          : "Fill in the details of your product"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{language === "sw" ? "Jina la Bidhaa" : "Product Name"}</Label>
                        <Input 
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder={language === "sw" ? "Mfano: Waya wa umeme" : "E.g. Electrical wire"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jamii" : "Category"}</Label>
                          <Select value={newProduct.category} onValueChange={(v) => setNewProduct({...newProduct, category: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder={language === "sw" ? "Chagua" : "Select"} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {language === "sw" ? cat.name.sw : cat.name.en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Kipimo" : "Unit"}</Label>
                          <Select value={newProduct.unit} onValueChange={(v) => setNewProduct({...newProduct, unit: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="piece">{language === "sw" ? "Kipande" : "Piece"}</SelectItem>
                              <SelectItem value="roll">{language === "sw" ? "Roli" : "Roll"}</SelectItem>
                              <SelectItem value="meter">{language === "sw" ? "Mita" : "Meter"}</SelectItem>
                              <SelectItem value="kg">{language === "sw" ? "Kilo" : "Kg"}</SelectItem>
                              <SelectItem value="bucket">{language === "sw" ? "Ndoo" : "Bucket"}</SelectItem>
                              <SelectItem value="bag">{language === "sw" ? "Mfuko" : "Bag"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Bei (TZS)" : "Price (TZS)"}</Label>
                          <Input 
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="45000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Stoki" : "Stock"}</Label>
                          <Input 
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="100"
                          />
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => setShowAddProduct(false)}>
                        <Save className="w-4 h-4 mr-2" />
                        {language === "sw" ? "Hifadhi Bidhaa" : "Save Product"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.stock} {product.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {product.sales} {language === "sw" ? "mauzo" : "sales"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          {language === "sw" ? "Hariri" : "Edit"}
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {language === "sw" ? "Maagizo" : "Orders"}
                </h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "sw" ? "Zote" : "All"}</SelectItem>
                    <SelectItem value="pending">{language === "sw" ? "Inasubiri" : "Pending"}</SelectItem>
                    <SelectItem value="confirmed">{language === "sw" ? "Imethibitishwa" : "Confirmed"}</SelectItem>
                    <SelectItem value="completed">{language === "sw" ? "Imekamilika" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">{order.id}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {order.phone}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.items.join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> {order.date}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xl font-bold text-primary">{formatCurrency(order.total)}</span>
                          {order.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {language === "sw" ? "Thibitisha" : "Confirm"}
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                {language === "sw" ? "Wasiliana" : "Contact"}
                              </Button>
                            </div>
                          )}
                          {order.status === "confirmed" && (
                            <Button size="sm" variant="outline">
                              {language === "sw" ? "Kamilisha" : "Complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                          <p className="text-sm text-muted-foreground">{review.date}</p>
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
                    <span>{language === "sw" ? "Wasifu wa Duka" : "Shop Profile"}</span>
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
                          <AvatarImage src={profile.logo} />
                          <AvatarFallback className="text-2xl">
                            <Store className="w-10 h-10" />
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-1" />
                          {language === "sw" ? "Badilisha Logo" : "Change Logo"}
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jina la Duka" : "Shop Name"}</Label>
                          <Input 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
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
                          <Label>{language === "sw" ? "Kata/Mtaa" : "Ward"}</Label>
                          <Input 
                            value={profile.ward}
                            onChange={(e) => setProfile({...profile, ward: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Anwani Kamili" : "Full Address"}</Label>
                          <Input 
                            value={profile.address}
                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "sw" ? "Maelezo ya Duka" : "Shop Description"}</Label>
                        <Textarea 
                          value={profile.description}
                          onChange={(e) => setProfile({...profile, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Siku za Kazi" : "Weekdays"}</Label>
                          <Input 
                            value={profile.openingHours.weekdays}
                            onChange={(e) => setProfile({...profile, openingHours: {...profile.openingHours, weekdays: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jumamosi" : "Saturday"}</Label>
                          <Input 
                            value={profile.openingHours.saturday}
                            onChange={(e) => setProfile({...profile, openingHours: {...profile.openingHours, saturday: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === "sw" ? "Jumapili" : "Sunday"}</Label>
                          <Input 
                            value={profile.openingHours.sunday}
                            onChange={(e) => setProfile({...profile, openingHours: {...profile.openingHours, sunday: e.target.value}})}
                          />
                        </div>
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
                          <AvatarImage src={profile.logo} />
                          <AvatarFallback className="text-2xl">
                            <Store className="w-10 h-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{profile.name}</h3>
                          <p className="text-muted-foreground">{profile.ward}, {profile.city}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.address}</span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">{language === "sw" ? "Siku za Kazi" : "Weekdays"}</p>
                          <p className="font-medium">{profile.openingHours.weekdays}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{language === "sw" ? "Jumamosi" : "Saturday"}</p>
                          <p className="font-medium">{profile.openingHours.saturday}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{language === "sw" ? "Jumapili" : "Sunday"}</p>
                          <p className="font-medium">{profile.openingHours.sunday}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.description}</p>
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
                      <p className="font-medium">{language === "sw" ? "Maagizo Mapya" : "New Orders"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Pokea arifa za maagizo mapya" : "Get notified of new orders"}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{language === "sw" ? "Maswali ya Wateja" : "Customer Inquiries"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Arifa za ujumbe mpya" : "New message notifications"}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{language === "sw" ? "Onyo la Stoki" : "Stock Alerts"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "sw" ? "Arifa wakati stoki inapopungua" : "Get notified when stock is low"}
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
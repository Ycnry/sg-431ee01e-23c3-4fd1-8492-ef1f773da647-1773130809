import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Wrench, 
  Store, 
  TrendingUp, 
  LogOut,
  BarChart3,
  Globe,
  MessageSquare,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Settings,
  AlertCircle,
  MapPinned,
  Phone
} from "lucide-react";
import { SubscriptionChart } from "@/components/admin/SubscriptionChart";
import { LanguageChart } from "@/components/admin/LanguageChart";
import { GeographicHeatmap } from "@/components/admin/GeographicHeatmap";
import { BugReportsList } from "@/components/admin/BugReportsList";
import {
  mockUserStats,
  mockGeographicData,
  mockLanguageStats,
  mockBugReports,
  mockRevenueData,
  formatTZS,
  BugReport
} from "@/lib/adminData";

interface PendingVerification {
  id: string;
  name: string;
  email: string;
  specialty: string;
  city: string;
  phone: string;
  idDocumentUrl: string;
  documentType: string;
  submittedDate: string;
  requiresManualVerification: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bugReports, setBugReports] = useState<BugReport[]>(mockBugReports);
  const [adminName, setAdminName] = useState("Admin");
  const [supportHotline, setSupportHotline] = useState("+255759218354");
  const [hotlineSaved, setHotlineSaved] = useState(false);
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([
    {
      id: "fundi-pending-1",
      name: "David Msangi",
      email: "david.msangi@example.com",
      specialty: "Electrician",
      city: "Dar es Salaam",
      phone: "+255 765 432 109",
      idDocumentUrl: "/uploads/image_133049d0-ae3e-47c2-adcd-3558f0428311.png",
      documentType: "Passport",
      submittedDate: "2025-11-10",
      requiresManualVerification: true,
      verificationStatus: "pending",
    },
    {
      id: "fundi-pending-2",
      name: "Grace Mwakasege",
      email: "grace.mwakasege@example.com",
      specialty: "Plumber",
      city: "Arusha",
      phone: "+255 742 876 543",
      idDocumentUrl: "/uploads/image_4a24922e-ef18-4310-aabe-2608c6229396.png",
      documentType: "Driver's License",
      submittedDate: "2025-11-11",
      requiresManualVerification: true,
      verificationStatus: "pending",
    },
  ]);

  interface PendingShopVerification {
    id: string;
    shopName: string;
    email: string;
    city: string;
    phone: string;
    businessRegistrationNumber?: string;
    physicalAddress?: string;
    storefrontPhotoUrl?: string;
    businessLicenseUrl?: string;
    tinCertificateUrl?: string;
    submittedDate: string;
    verificationStatus: "pending" | "approved" | "rejected";
    scamReports: number;
  }

  const [pendingShopVerifications, setPendingShopVerifications] = useState<PendingShopVerification[]>([
    {
      id: "shop-pending-1",
      shopName: "Mwanza Tools & Hardware",
      email: "mwanza.tools@example.com",
      city: "Mwanza",
      phone: "+255 745 123 456",
      businessRegistrationNumber: "BRELA-98765432",
      physicalAddress: "Station Rd, Mwanza",
      storefrontPhotoUrl: "/uploads/shop3-storefront.jpg",
      submittedDate: "2025-11-12",
      verificationStatus: "pending",
      scamReports: 0,
    },
  ]);

  useEffect(() => {
    const adminData = localStorage.getItem("smartfundi_admin");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        if (parsed.role === "admin") {
          setIsAuthenticated(true);
          setAdminName(parsed.name || "Admin");
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    } else {
      router.push("/admin/login");
    }

    const settings = localStorage.getItem("support_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setSupportHotline(parsed.hotline_number || "+255759218354");
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("smartfundi_admin");
    router.push("/admin/login");
  };

  const handleResolveBug = (bugId: string) => {
    setBugReports(prev => 
      prev.map(bug => 
        bug.id === bugId 
          ? { ...bug, status: "resolved" as const, resolvedAt: new Date().toISOString() }
          : bug
      )
    );
  };

  const handleApproveVerification = (fundiId: string) => {
    setPendingVerifications(prev =>
      prev.map(fundi =>
        fundi.id === fundiId
          ? { ...fundi, verificationStatus: "approved" }
          : fundi
      )
    );
    console.log(`Approved fundi: ${fundiId}`);
  };

  const handleRejectVerification = (fundiId: string) => {
    setPendingVerifications(prev =>
      prev.map(fundi =>
        fundi.id === fundiId
          ? { ...fundi, verificationStatus: "rejected" }
          : fundi
      )
    );
    console.log(`Rejected fundi: ${fundiId}`);
  };

  const handleApproveShopVerification = (shopId: string) => {
    setPendingShopVerifications(prev =>
      prev.map(shop =>
        shop.id === shopId
          ? { ...shop, verificationStatus: "approved" }
          : shop
      )
    );
    console.log(`Approved shop: ${shopId}`);
  };

  const handleRejectShopVerification = (shopId: string) => {
    setPendingShopVerifications(prev =>
      prev.map(shop =>
        shop.id === shopId
          ? { ...shop, verificationStatus: "rejected" }
          : shop
      )
    );
    console.log(`Rejected shop: ${shopId}`);
  };

  const handleVerifyBySMS = (shopId: string, phone: string) => {
    const smsMessage = "Smart Fundi: Tuma 'NIMETHIBITISHWA' kwa namba hii ili usajili wako uhalalishwe.";
    console.log(`Sending SMS verification to ${phone}: ${smsMessage}`);
    alert(`SMS verification sent to ${phone}. Shop owner should reply 'NIMETHIBITISHWA' to complete verification.`);
  };

  const handleSaveHotline = () => {
    const settings = {
      hotline_number: supportHotline,
      updated_at: new Date().toISOString(),
      updated_by: adminName,
    };
    localStorage.setItem("support_settings", JSON.stringify(settings));
    setHotlineSaved(true);
    setTimeout(() => setHotlineSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const openBugs = bugReports.filter(b => b.status === "open").length;
  const inProgressBugs = bugReports.filter(b => b.status === "in-progress").length;
  const pendingVerificationsCount = pendingVerifications.filter(v => v.verificationStatus === "pending").length;

  return (
    <>
      <Head>
        <title>Admin Dashboard - Smart Fundi</title>
        <meta name="description" content="Admin analytics and management dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-gray-950 dark:to-gray-900">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Smart Fundi Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {adminName}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-100">
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {mockUserStats.totalCustomers.toLocaleString()}
                  </div>
                  <Users className="h-8 w-8 text-blue-100" />
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  +{mockUserStats.newUsersThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-100">
                  Total Fundis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {mockUserStats.totalFundis.toLocaleString()}
                  </div>
                  <Wrench className="h-8 w-8 text-orange-100" />
                </div>
                <p className="text-xs text-orange-100 mt-2">
                  Verified technicians
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-100">
                  Total Shops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {mockUserStats.totalShops.toLocaleString()}
                  </div>
                  <Store className="h-8 w-8 text-green-100" />
                </div>
                <p className="text-xs text-green-100 mt-2">
                  Hardware & supply stores
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-100">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatTZS(totalRevenue)}
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-100" />
                </div>
                <p className="text-xs text-purple-100 mt-2">
                  Last 6 months
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="geographic" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Geographic</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Language</span>
              </TabsTrigger>
              <TabsTrigger value="verifications" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Verifications</span>
                {pendingVerificationsCount > 0 && (
                  <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {pendingVerificationsCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="shop-verifications" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Shop Verifications</span>
              </TabsTrigger>
              <TabsTrigger value="bugs" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Bugs</span>
                {openBugs > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {openBugs}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Status</CardTitle>
                    <CardDescription>
                      Active vs. expired subscriptions breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="w-full max-w-sm">
                        <SubscriptionChart 
                          active={mockUserStats.activeSubscriptions}
                          expired={mockUserStats.expiredSubscriptions}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {mockUserStats.activeSubscriptions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((mockUserStats.activeSubscriptions / (mockUserStats.activeSubscriptions + mockUserStats.expiredSubscriptions)) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Expired</p>
                        <p className="text-2xl font-bold text-red-600">
                          {mockUserStats.expiredSubscriptions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((mockUserStats.expiredSubscriptions / (mockUserStats.activeSubscriptions + mockUserStats.expiredSubscriptions)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>
                      Breakdown by user type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            Customers
                          </span>
                          <span className="font-semibold">{mockUserStats.totalCustomers.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${(mockUserStats.totalCustomers / (mockUserStats.totalCustomers + mockUserStats.totalFundis + mockUserStats.totalShops)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-orange-600" />
                            Fundis
                          </span>
                          <span className="font-semibold">{mockUserStats.totalFundis.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-600 transition-all"
                            style={{ width: `${(mockUserStats.totalFundis / (mockUserStats.totalCustomers + mockUserStats.totalFundis + mockUserStats.totalShops)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-green-600" />
                            Shops
                          </span>
                          <span className="font-semibold">{mockUserStats.totalShops.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 transition-all"
                            style={{ width: `${(mockUserStats.totalShops / (mockUserStats.totalCustomers + mockUserStats.totalFundis + mockUserStats.totalShops)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Users</span>
                        <span className="text-2xl font-bold">
                          {(mockUserStats.totalCustomers + mockUserStats.totalFundis + mockUserStats.totalShops).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="geographic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>
                    Sign-ups by city across Tanzania
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeographicHeatmap data={mockGeographicData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language Preference</CardTitle>
                  <CardDescription>
                    Percentage of users by language preference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="w-full max-w-sm">
                      <LanguageChart 
                        english={mockLanguageStats.english}
                        swahili={mockLanguageStats.swahili}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                    <div className="space-y-1 text-center">
                      <p className="text-sm text-muted-foreground">English Users</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {mockLanguageStats.english}%
                      </p>
                      <p className="text-xs text-muted-foreground">Primary language</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-sm text-muted-foreground">Swahili Users</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {mockLanguageStats.swahili}%
                      </p>
                      <p className="text-xs text-muted-foreground">Primary language</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Identity Verifications</CardTitle>
                  <CardDescription>
                    Fundi accounts using alternative documents requiring manual review
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-600"></div>
                      <span>{pendingVerificationsCount} Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      <span>{pendingVerifications.filter(v => v.verificationStatus === "approved").length} Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-600"></div>
                      <span>{pendingVerifications.filter(v => v.verificationStatus === "rejected").length} Rejected</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingVerifications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending verifications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingVerifications.map((fundi) => (
                        <div
                          key={fundi.id}
                          className={`border-2 rounded-lg p-4 ${
                            fundi.verificationStatus === "pending"
                              ? "border-orange-200 bg-orange-50 dark:bg-orange-950"
                              : fundi.verificationStatus === "approved"
                              ? "border-green-200 bg-green-50 dark:bg-green-950"
                              : "border-red-200 bg-red-50 dark:bg-red-950"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                <Wrench className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{fundi.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {fundi.specialty} • {fundi.city}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Submitted: {fundi.submittedDate}
                                </p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              fundi.verificationStatus === "pending"
                                ? "bg-orange-500 text-white"
                                : fundi.verificationStatus === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}>
                              {fundi.verificationStatus.toUpperCase()}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{fundi.email}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Phone</p>
                              <p className="font-medium">{fundi.phone}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Uploaded Document: {fundi.documentType}
                            </p>
                            <div className="border-2 border-dashed rounded-lg p-4 bg-white dark:bg-gray-900">
                              <div className="flex items-center gap-2 text-blue-600">
                                <FileText className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                  {fundi.documentType} Document
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click to view full document
                              </p>
                            </div>
                          </div>

                          <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm">
                              <strong>Action Required:</strong> This fundi provided an alternative government-issued document (Passport, Driver's License, Voter's Card, NIDA Application Receipt, School Documentation, or Birth Certificate) instead of a National ID Number. Please verify the document authenticity before approving.
                            </AlertDescription>
                          </Alert>

                          {fundi.verificationStatus === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveVerification(fundi.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Activate
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => handleRejectVerification(fundi.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {fundi.verificationStatus === "approved" && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">Account Approved & Activated</span>
                            </div>
                          )}

                          {fundi.verificationStatus === "rejected" && (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-5 w-5" />
                              <span className="font-medium">Account Rejected - User Notified</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shop-verifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Shop Verifications</CardTitle>
                  <CardDescription>
                    Shop accounts requiring verification before displaying full credentials
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-600"></div>
                      <span>{pendingShopVerifications.filter(s => s.verificationStatus === "pending").length} Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      <span>{pendingShopVerifications.filter(s => s.verificationStatus === "approved").length} Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-600"></div>
                      <span>{pendingShopVerifications.filter(s => s.verificationStatus === "rejected").length} Rejected</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingShopVerifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending shop verifications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingShopVerifications.map((shop) => (
                        <div
                          key={shop.id}
                          className={`border-2 rounded-lg p-4 ${
                            shop.verificationStatus === "pending"
                              ? "border-orange-200 bg-orange-50 dark:bg-orange-950"
                              : shop.verificationStatus === "approved"
                              ? "border-green-200 bg-green-50 dark:bg-green-950"
                              : "border-red-200 bg-red-50 dark:bg-red-950"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                <Store className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{shop.shopName}</h3>
                                <p className="text-sm text-muted-foreground">{shop.city}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Submitted: {shop.submittedDate}
                                </p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              shop.verificationStatus === "pending"
                                ? "bg-orange-500 text-white"
                                : shop.verificationStatus === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}>
                              {shop.verificationStatus.toUpperCase()}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{shop.email}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Phone</p>
                              <p className="font-medium">{shop.phone}</p>
                            </div>
                          </div>

                          {shop.businessRegistrationNumber && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg mb-3">
                              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">Business Registration (BRELA)</p>
                                <p className="text-sm text-muted-foreground">{shop.businessRegistrationNumber}</p>
                              </div>
                            </div>
                          )}

                          {shop.physicalAddress && (
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg mb-3">
                              <MapPinned className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">Physical Address</p>
                                <p className="text-sm text-muted-foreground">{shop.physicalAddress}</p>
                              </div>
                            </div>
                          )}

                          {(shop.storefrontPhotoUrl || shop.businessLicenseUrl || shop.tinCertificateUrl) && (
                            <div className="mb-4">
                              <p className="font-medium text-sm mb-2">Uploaded Documents</p>
                              <div className="grid grid-cols-3 gap-2">
                                {shop.storefrontPhotoUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">Storefront Photo</p>
                                  </div>
                                )}
                                {shop.businessLicenseUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">Business License</p>
                                  </div>
                                )}
                                {shop.tinCertificateUrl && (
                                  <div className="border rounded-lg p-2 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs">TIN Certificate</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {shop.scamReports >= 2 && (
                            <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                                <strong>⚠️ Flagged for Review:</strong> This shop has received {shop.scamReports} scam report(s) from customers.
                              </AlertDescription>
                            </Alert>
                          )}

                          {shop.verificationStatus === "pending" && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveShopVerification(shop.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve & Activate
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={() => handleRejectShopVerification(shop.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleVerifyBySMS(shop.id, shop.phone)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Verify by SMS/Call
                              </Button>
                            </div>
                          )}

                          {shop.verificationStatus === "approved" && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">Shop Approved & Verified</span>
                            </div>
                          )}

                          {shop.verificationStatus === "rejected" && (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-5 w-5" />
                              <span className="font-medium">Shop Rejected - Owner Notified</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bugs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bug Reports</CardTitle>
                  <CardDescription>
                    User-submitted issues and their status
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-600"></div>
                      <span>{openBugs} Open</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                      <span>{inProgressBugs} In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      <span>{bugReports.filter(b => b.status === "resolved").length} Resolved</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <BugReportsList 
                    reports={bugReports}
                    onResolve={handleResolveBug}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Support Hotline (Tanzania)</CardTitle>
                  <CardDescription>
                    Configure the phone number customers can call for human support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotline">Support Phone Number</Label>
                    <Input
                      id="hotline"
                      type="tel"
                      value={supportHotline}
                      onChange={(e) => setSupportHotline(e.target.value)}
                      placeholder="+255 XXX XXX XXX"
                    />
                    <p className="text-sm text-muted-foreground">
                      This number is used in the Help & Support AI assistant when users request human assistance
                    </p>
                  </div>

                  <Button onClick={handleSaveHotline} className="w-full">
                    Save Hotline Number
                  </Button>

                  {hotlineSaved && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Support hotline number saved successfully! All Help & Support calls will now use: {supportHotline}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Note:</strong> Only admin users can read and update this setting. The hotline number is protected by Authentication and Database rules.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

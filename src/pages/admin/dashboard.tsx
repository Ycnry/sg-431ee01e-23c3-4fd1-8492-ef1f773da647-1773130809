
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  AlertTriangle
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bugReports, setBugReports] = useState<BugReport[]>(mockBugReports);
  const [adminName, setAdminName] = useState("Admin");

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
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
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
              <TabsTrigger value="bugs" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Bugs</span>
                {openBugs > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {openBugs}
                  </span>
                )}
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
          </Tabs>
        </div>
      </div>
    </>
  );
}

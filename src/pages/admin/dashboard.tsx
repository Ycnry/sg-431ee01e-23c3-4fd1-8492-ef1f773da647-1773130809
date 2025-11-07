
import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, XCircle, DollarSign, Users, Store, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("pending");

  const pendingFundis = [
    { id: "1", name: "Joseph Mushi", specialty: "Electrician", city: "Dar es Salaam", date: "2025-01-06" },
    { id: "2", name: "Maria Kimani", specialty: "Plumber", city: "Arusha", date: "2025-01-05" },
  ];

  const pendingShops = [
    { id: "1", name: "Karibu Hardware", city: "Mwanza", date: "2025-01-06" },
    { id: "2", name: "Msalaba Tools", city: "Dodoma", date: "2025-01-04" },
  ];

  const revenueData = {
    total: 12450000,
    thisMonth: 2850000,
    fundiSubscriptions: 8,
    shopSubscriptions: 5,
    promotedListings: 12,
    sponsoredEvents: 3,
  };

  const metaTitle = language === "en" ? "Admin Dashboard - Smart Fundi" : "Dashibodi ya Msimamizi - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage fundis, shops, events, and monitor revenue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(revenueData.total / 1000000).toFixed(1)}M TZS</div>
                <p className="text-xs text-muted-foreground">This month: {(revenueData.thisMonth / 1000000).toFixed(1)}M TZS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Fundis</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueData.fundiSubscriptions}</div>
                <p className="text-xs text-muted-foreground">+2 pending approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueData.shopSubscriptions}</div>
                <p className="text-xs text-muted-foreground">+2 pending approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueData.sponsoredEvents}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Fundi Verifications</CardTitle>
                  <CardDescription>Review and approve new technician registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingFundis.map((fundi) => (
                      <div key={fundi.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fundi.name}`} />
                            <AvatarFallback>{fundi.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{fundi.name}</h3>
                            <p className="text-sm text-muted-foreground">{fundi.specialty} • {fundi.city}</p>
                            <p className="text-xs text-muted-foreground">Applied: {fundi.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Shop Verifications</CardTitle>
                  <CardDescription>Review and approve new shop registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingShops.map((shop) => (
                      <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="rounded-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}`} />
                            <AvatarFallback className="rounded-lg">{shop.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{shop.name}</h3>
                            <p className="text-sm text-muted-foreground">{shop.city}</p>
                            <p className="text-xs text-muted-foreground">Applied: {shop.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Detailed revenue analysis by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Fundi Subscriptions</h3>
                        <p className="text-sm text-muted-foreground">5,000 TZS/month × {revenueData.fundiSubscriptions} fundis</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{(revenueData.fundiSubscriptions * 5000).toLocaleString()} TZS</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Shop Subscriptions</h3>
                        <p className="text-sm text-muted-foreground">15,000 TZS/month × {revenueData.shopSubscriptions} shops</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{(revenueData.shopSubscriptions * 15000).toLocaleString()} TZS</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Promoted Listings</h3>
                        <p className="text-sm text-muted-foreground">1,500 TZS/day × {revenueData.promotedListings} active</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{(revenueData.promotedListings * 1500).toLocaleString()} TZS</p>
                        <p className="text-xs text-muted-foreground">per day</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Sponsored Events</h3>
                        <p className="text-sm text-muted-foreground">25,000 TZS/event × {revenueData.sponsoredEvents} events</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{(revenueData.sponsoredEvents * 25000).toLocaleString()} TZS</p>
                        <p className="text-xs text-muted-foreground">this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Total Monthly Revenue (Est.)</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {((revenueData.fundiSubscriptions * 5000) + 
                          (revenueData.shopSubscriptions * 15000) + 
                          (revenueData.promotedListings * 1500 * 30) +
                          (revenueData.sponsoredEvents * 25000)).toLocaleString()} TZS
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Events</CardTitle>
                  <CardDescription>Upcoming trade events and workshops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Tanzania Construction Technology Expo 2025</h3>
                          <Badge className="bg-orange-500">Sponsored</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Diamond Jubilee Hall, Dar es Salaam</p>
                        <p className="text-xs text-muted-foreground">Jan 22, 2025</p>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold mb-1">Electrical Safety Training Workshop</h3>
                        <p className="text-sm text-muted-foreground">Vocational Training Center, Arusha</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 2025</p>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>

                    <Button className="w-full">Add New Event</Button>
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

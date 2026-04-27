import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockFundis, mockShops } from "@/lib/mockData";
import { 
  Star, MapPin, Calendar, Settings, 
  User, LogOut, Bell, Globe, Lock, ChevronRight,
  ClipboardList, CheckCircle2, Clock, XCircle
} from "lucide-react";

// Mock bookings data
const mockBookings = [
  {
    id: "1",
    fundiName: "John Mwangi",
    fundiPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    service: "Electrical Repair",
    date: "2026-04-25",
    status: "completed",
    price: 45000,
  },
  {
    id: "2",
    fundiName: "Peter Omondi",
    fundiPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    service: "Plumbing",
    date: "2026-04-28",
    status: "pending",
    price: 35000,
  },
  {
    id: "3",
    fundiName: "James Kileo",
    fundiPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    service: "Carpentry",
    date: "2026-04-10",
    status: "cancelled",
    price: 60000,
  },
];

export default function CustomerProfile() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setIsTabsSticky(tabsTop <= 60);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {language === "en" ? "Completed" : "Imekamilika"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            {language === "en" ? "Pending" : "Inasubiri"}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            {language === "en" ? "Cancelled" : "Imefutwa"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@example.com";
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2026;
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <Head>
        <title>{language === "en" ? "My Profile" : "Wasifu Wangu"} - Smart Fundi</title>
      </Head>

      <Header />

      <div className="min-h-screen bg-background pb-24">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 pt-8 pb-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm" />
              <Avatar className="relative h-28 w-28 border-4 border-blue-400 shadow-xl">
                <AvatarImage src={user?.photo} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-2xl font-bold text-white mt-4">{userName}</h1>
            
            <div className="flex items-center justify-center gap-4 mt-2 text-blue-100 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{language === "en" ? `Member since ${memberSince}` : `Mwanachama tangu ${memberSince}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Dar es Salaam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row - Overlapping */}
        <div className="px-4 -mt-12">
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-1 bg-card rounded-xl shadow-lg p-1 border">
            <div className="text-center py-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-foreground">{mockBookings.length}</div>
              <div className="text-xs text-muted-foreground">
                {language === "en" ? "Bookings" : "Booking"}
              </div>
            </div>
            <div className="text-center py-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                5
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs text-muted-foreground">
                {language === "en" ? "Reviews" : "Maoni"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsRef} className={`mt-6 ${isTabsSticky ? "sticky top-[60px] z-40 bg-background shadow-md" : ""}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/50 mx-0 rounded-none border-b">
              <TabsTrigger 
                value="bookings" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none"
              >
                <ClipboardList className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Bookings" : "Booking"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{language === "en" ? "Settings" : "Mipangilio"}</span>
              </TabsTrigger>
            </TabsList>

            {/* My Bookings Tab */}
            <TabsContent value="bookings" className="mt-0">
              {mockBookings.length > 0 ? (
                <div className="divide-y">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.fundiPhoto} alt={booking.fundiName} />
                          <AvatarFallback>{booking.fundiName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{booking.fundiName}</h4>
                              <p className="text-sm text-muted-foreground">{booking.service}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US")}
                            </span>
                            <span className="font-semibold text-blue-600">
                              TZS {booking.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-12 w-12 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Bookings Yet" : "Hakuna Booking Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mb-4">
                    {language === "en" 
                      ? "Find and book your first fundi today!"
                      : "Tafuta na weka booking ya fundi wako wa kwanza leo!"}
                  </p>
                  <Link href="/search">
                    <Button className="rounded-full">
                      {language === "en" ? "Find Fundi" : "Tafuta Fundi"}
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <div className="divide-y">
                {/* Edit Profile */}
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{language === "en" ? "Edit Profile" : "Hariri Wasifu"}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>

                {/* Change Password */}
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium">{language === "en" ? "Change Password" : "Badilisha Nywila"}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>

                {/* Language */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">{language === "en" ? "Language" : "Lugha"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">EN</span>
                    <Switch 
                      checked={language === "sw"} 
                      onCheckedChange={(checked) => setLanguage(checked ? "sw" : "en")}
                    />
                    <span className="text-sm text-muted-foreground">SW</span>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "Push Notifications" : "Arifa za Push"}</span>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "Get notified about bookings" : "Pata arifa kuhusu booking"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                {/* SMS Notifications */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "SMS Notifications" : "Arifa za SMS"}</span>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "Receive SMS updates" : "Pata arifa za SMS"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                {/* Logout */}
                <button 
                  onClick={handleSignOut}
                  className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-red-600">{language === "en" ? "Logout" : "Ondoka"}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-400" />
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
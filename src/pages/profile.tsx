import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Star, MapPin, Calendar, Settings, User, LogOut, Bell, Globe, Lock, 
  ChevronRight, ClipboardList, CheckCircle2, Clock, XCircle, Briefcase,
  Camera, Plus, Image, FileText, Award, Wrench, Phone, Edit, Trash2,
  Upload, X
} from "lucide-react";

// Mock bookings data for customers
const mockCustomerBookings = [
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

// Mock job requests for fundis
const mockFundiJobs = [
  {
    id: "1",
    customerName: "Sarah Mwamba",
    customerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    jobType: "Electrical Wiring",
    date: "2026-04-30",
    price: 75000,
    status: "pending",
    location: "Kinondoni, Dar es Salaam",
  },
  {
    id: "2",
    customerName: "Michael Kimaro",
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    jobType: "Socket Installation",
    date: "2026-04-28",
    price: 45000,
    status: "accepted",
    location: "Mikocheni, Dar es Salaam",
  },
  {
    id: "3",
    customerName: "Grace Mollel",
    customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    jobType: "Full House Wiring",
    date: "2026-04-20",
    price: 350000,
    status: "completed",
    location: "Mbezi Beach, Dar es Salaam",
  },
  {
    id: "4",
    customerName: "David Lyimo",
    customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    jobType: "Generator Repair",
    date: "2026-04-15",
    price: 120000,
    status: "cancelled",
    location: "Masaki, Dar es Salaam",
  },
];

// Mock portfolio items for fundis
const mockPortfolioItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
    caption: "Commercial building wiring project",
    type: "image",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    caption: "Solar panel installation",
    type: "image",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&h=400&fit=crop",
    caption: "Industrial electrical work",
    type: "image",
  },
];

// Mock certificates for fundis
const mockCertificates = [
  {
    id: "1",
    name: "Electrical Installation Certificate",
    issuingBody: "VETA Tanzania",
    uploadDate: "2024-06-15",
    fileType: "pdf",
  },
  {
    id: "2",
    name: "Safety Training Certificate",
    issuingBody: "OSHA Tanzania",
    uploadDate: "2025-01-20",
    fileType: "image",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  
  // Check user role - show Fundi dashboard if role is fundi
  const isFundi = user?.user_type === "fundi";
  
  if (isFundi) {
    return <FundiDashboard />;
  }
  
  return <CustomerProfile />;
}

// ============================================
// FUNDI DASHBOARD COMPONENT
// ============================================
function FundiDashboard() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [jobs, setJobs] = useState(mockFundiJobs);
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const [certificates, setCertificates] = useState(mockCertificates);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Settings form state
  const [formData, setFormData] = useState({
    name: user?.name || "John Electrician",
    specialty: "Electrical",
    bio: "Experienced electrician with 8+ years in residential and commercial wiring. Certified by VETA Tanzania.",
    hourlyRate: "25000",
    whatsapp: "+255 712 345 678",
    city: "Dar es Salaam",
  });

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

  const handleAcceptJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "accepted" } : job
    ));
  };

  const handleDeclineJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "cancelled" } : job
    ));
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
      case "accepted":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {language === "en" ? "Accepted" : "Imekubaliwa"}
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

  const fundiName = user?.name || "John Electrician";
  const initials = fundiName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const pendingJobs = jobs.filter(j => j.status === "pending").length;

  return (
    <>
      <Head>
        <title>{language === "en" ? "Fundi Dashboard" : "Dashibodi ya Fundi"} - Smart Fundi</title>
      </Head>

      <Header />

      <div className="min-h-screen bg-background pb-24">
        {/* Cover Banner */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Availability Toggle - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
            <span className={`text-xs font-medium ${isAvailable ? "text-green-600" : "text-red-600"}`}>
              {isAvailable 
                ? (language === "en" ? "Available" : "Ninapatikana")
                : (language === "en" ? "Busy" : "Nina Kazi")}
            </span>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={setIsAvailable}
              className={isAvailable ? "data-[state=checked]:bg-green-500" : "data-[state=unchecked]:bg-red-500"}
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-4 -mt-16 sm:-mt-20 relative z-10">
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col items-center text-center">
              {/* Profile Photo with Orange Border */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                <Avatar className="relative h-28 w-28 sm:h-32 sm:w-32 border-4 border-background">
                  <AvatarImage src={user?.photo} alt={fundiName} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 bg-orange-500 text-white rounded-full p-2 shadow-lg hover:bg-orange-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Name & Info */}
              <h1 className="text-2xl font-bold mt-4">{fundiName}</h1>
              
              <Badge className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                <Wrench className="h-3 w-3 mr-1" />
                {formData.specialty}
              </Badge>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{formData.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 mt-6">
          <div className="max-w-lg mx-auto grid grid-cols-3 gap-1 bg-card rounded-xl shadow-lg p-1 border">
            <div className="text-center py-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{completedJobs}</div>
              <div className="text-xs text-muted-foreground">
                {language === "en" ? "Jobs Done" : "Kazi Zilizokamilika"}
              </div>
            </div>
            <div className="text-center py-4 bg-background rounded-lg border-x">
              <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                4.8
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs text-muted-foreground">
                {language === "en" ? "Avg Rating" : "Wastani"}
              </div>
            </div>
            <div className="text-center py-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingJobs}</div>
              <div className="text-xs text-muted-foreground">
                {language === "en" ? "Pending" : "Zinasubiri"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsRef} className={`mt-6 ${isTabsSticky ? "sticky top-[60px] z-40 bg-background shadow-md" : ""}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-12 bg-muted/50 mx-0 rounded-none border-b">
              <TabsTrigger 
                value="jobs" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none text-xs sm:text-sm"
              >
                <Briefcase className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{language === "en" ? "Jobs" : "Kazi"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="showcase"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none text-xs sm:text-sm"
              >
                <Image className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{language === "en" ? "Showcase" : "Picha"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="certifications"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none text-xs sm:text-sm"
              >
                <Award className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{language === "en" ? "Certs" : "Vyeti"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none text-xs sm:text-sm"
              >
                <Settings className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{language === "en" ? "Settings" : "Mipangilio"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="mt-0">
              {jobs.length > 0 ? (
                <div className="divide-y">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={job.customerPhoto} alt={job.customerName} />
                          <AvatarFallback>{job.customerName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{job.customerName}</h4>
                              <p className="text-sm text-muted-foreground">{job.jobType}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </p>
                            </div>
                            {getStatusBadge(job.status)}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(job.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US")}
                            </span>
                            <span className="font-semibold text-orange-600">
                              TZS {job.price.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Action buttons for pending jobs */}
                          {job.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                                onClick={() => handleAcceptJob(job.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                {language === "en" ? "Accept" : "Kubali"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1 text-red-600 border-red-300 hover:bg-red-50 rounded-full"
                                onClick={() => handleDeclineJob(job.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                {language === "en" ? "Decline" : "Kataa"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-12 w-12 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No Jobs Yet" : "Hakuna Kazi Bado"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "When customers book you, their requests will appear here."
                      : "Wateja watakapokuweka booking, maombi yao yataonekana hapa."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Showcase Tab */}
            <TabsContent value="showcase" className="mt-0 p-4">
              <Button className="w-full mb-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "Add Work" : "Ongeza Kazi"}
              </Button>
              
              {portfolioItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden group">
                      <img 
                        src={item.image} 
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs truncate">{item.caption}</p>
                        </div>
                        <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <Image className="h-10 w-10 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "Show Off Your Work" : "Onyesha Kazi Zako"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "Upload photos of your completed projects to attract more customers."
                      : "Pakia picha za miradi yako iliyokamilika kuvutia wateja zaidi."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="mt-0 p-4">
              <Button className="w-full mb-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "Add Certificate" : "Ongeza Cheti"}
              </Button>
              
              {certificates.length > 0 ? (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                            {cert.fileType === "pdf" ? (
                              <FileText className="h-6 w-6 text-orange-600" />
                            ) : (
                              <Award className="h-6 w-6 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{cert.name}</h4>
                            <p className="text-xs text-muted-foreground">{cert.issuingBody}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === "en" ? "Uploaded" : "Imepakiwa"}: {new Date(cert.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          <button className="text-red-500 hover:text-red-600 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-10 w-10 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "Add Your Certificates" : "Ongeza Vyeti Vyako"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === "en" 
                      ? "Upload certificates to build trust with customers. This is optional."
                      : "Pakia vyeti kujenga uaminifu na wateja. Hii si lazima."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <div className="divide-y">
                {/* Edit Profile Section */}
                <div className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {language === "en" ? "Edit Profile" : "Hariri Wasifu"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">{language === "en" ? "Full Name" : "Jina Kamili"}</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialty">{language === "en" ? "Specialty" : "Fani"}</Label>
                      <Input 
                        id="specialty" 
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">{language === "en" ? "Bio" : "Maelezo"}</Label>
                      <Textarea 
                        id="bio" 
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rate">{language === "en" ? "Hourly Rate (TZS)" : "Bei kwa Saa (TZS)"}</Label>
                      <Input 
                        id="rate" 
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp">{language === "en" ? "WhatsApp Number" : "Nambari ya WhatsApp"}</Label>
                      <Input 
                        id="whatsapp" 
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">{language === "en" ? "City" : "Mji"}</Label>
                      <Input 
                        id="city" 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white mt-4">
                      {language === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}
                    </Button>
                  </div>
                </div>

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

                {/* Notifications */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "Notifications" : "Arifa"}</span>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "Get notified about new jobs" : "Pata arifa za kazi mpya"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                {/* Availability */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAvailable ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                      <Clock className={`h-5 w-5 ${isAvailable ? "text-green-600" : "text-red-600"}`} />
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "Availability" : "Upatikanaji"}</span>
                      <p className="text-xs text-muted-foreground">
                        {isAvailable 
                          ? (language === "en" ? "You're available for jobs" : "Unapatikana kwa kazi")
                          : (language === "en" ? "You're marked as busy" : "Umejiandikisha una shughuli")}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={isAvailable} 
                    onCheckedChange={setIsAvailable}
                    className={isAvailable ? "data-[state=checked]:bg-green-500" : ""}
                  />
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

// ============================================
// CUSTOMER PROFILE COMPONENT
// ============================================
function CustomerProfile() {
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
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
              <Avatar className="relative h-28 w-28 border-4 border-background shadow-xl">
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
              <div className="text-2xl font-bold text-foreground">{mockCustomerBookings.length}</div>
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
              {mockCustomerBookings.length > 0 ? (
                <div className="divide-y">
                  {mockCustomerBookings.map((booking) => (
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
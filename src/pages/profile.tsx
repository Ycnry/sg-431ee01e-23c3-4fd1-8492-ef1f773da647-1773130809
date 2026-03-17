import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Settings, Star, MessageSquare, Calendar, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+255 712 345 678",
    city: "Dar es Salaam",
    specialty: "Electrician",
    bio: "Experienced electrician with 10+ years in residential and commercial electrical work.",
    whatsapp: "+255 712 345 678",
  });

  const metaTitle = language === "en" ? "My Profile - Smart Fundi" : "Wasifu Wangu - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {language === "en" ? "My Profile" : "Wasifu Wangu"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" ? "Manage your account and preferences" : "Simamia akaunti na mapendeleo yako"}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  {language === "en" ? "Profile" : "Wasifu"}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2" />
                  {language === "en" ? "Reviews" : "Maoni"}
                </TabsTrigger>
                <TabsTrigger value="subscription">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {language === "en" ? "Subscription" : "Usajili"}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  {language === "en" ? "Settings" : "Mipangilio"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Profile Information" : "Taarifa za Wasifu"}</CardTitle>
                    <CardDescription>
                      {language === "en" ? "Update your profile details" : "Sasisha maelezo yako ya wasifu"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">
                        {language === "en" ? "Change Photo" : "Badilisha Picha"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{language === "en" ? "Full Name" : "Jina Kamili"}</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">{language === "en" ? "Email" : "Barua pepe"}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">{language === "en" ? "Phone Number" : "Nambari ya Simu"}</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">{language === "en" ? "City" : "Jiji"}</Label>
                        <Select value={profileData.city} onValueChange={(value) => setProfileData({...profileData, city: value})}>
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

                      <div>
                        <Label htmlFor="specialty">{language === "en" ? "Specialty" : "Ujuzi"}</Label>
                        <Select value={profileData.specialty} onValueChange={(value) => setProfileData({...profileData, specialty: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electrician">Electrician</SelectItem>
                            <SelectItem value="Plumber">Plumber</SelectItem>
                            <SelectItem value="Carpenter">Carpenter</SelectItem>
                            <SelectItem value="Mechanic">Mechanic</SelectItem>
                            <SelectItem value="Mason">Mason</SelectItem>
                            <SelectItem value="Painter">Painter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">{language === "en" ? "WhatsApp (Optional)" : "WhatsApp (Hiari)"}</Label>
                        <Input
                          id="whatsapp"
                          value={profileData.whatsapp}
                          onChange={(e) => setProfileData({...profileData, whatsapp: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">{language === "en" ? "Bio" : "Maelezo"}</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      />
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {language === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "My Reviews" : "Maoni Yangu"}</CardTitle>
                    <CardDescription>
                      {language === "en" ? "Reviews from your customers" : "Maoni kutoka kwa wateja wako"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium">Excellent work!</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Professional and efficient. Fixed my electrical issue quickly.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">- Sarah M. • 2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Subscription Status" : "Hali ya Usajili"}</CardTitle>
                    <CardDescription>
                      {language === "en" ? "Manage your subscription plan" : "Simamia mpango wako wa usajili"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div>
                          <p className="font-semibold text-green-700 dark:text-green-400">
                            {language === "en" ? "Active Subscription" : "Usajili Unaofanya Kazi"}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-500">
                            {language === "en" ? "Monthly Plan - 5,000 TZS" : "Mpango wa Mwezi - 5,000 TZS"}
                          </p>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{language === "en" ? "Next billing date" : "Tarehe ya malipo ijayo"}</span>
                          <span className="font-medium">Dec 7, 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{language === "en" ? "Payment method" : "Njia ya malipo"}</span>
                          <span className="font-medium">M-Pesa</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        {language === "en" ? "Cancel Subscription" : "Futa Usajili"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Account Settings" : "Mipangilio ya Akaunti"}</CardTitle>
                    <CardDescription>
                      {language === "en" ? "Manage your account preferences" : "Simamia mapendeleo yako ya akaunti"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{language === "en" ? "Notifications" : "Arifa"}</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{language === "en" ? "Email notifications" : "Arifa za barua pepe"}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{language === "en" ? "SMS notifications" : "Arifa za SMS"}</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">{language === "en" ? "Privacy" : "Faragha"}</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{language === "en" ? "Show phone number on profile" : "Onyesha nambari ya simu kwenye wasifu"}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{language === "en" ? "Allow messages from customers" : "Ruhusu ujumbe kutoka kwa wateja"}</span>
                        </label>
                      </div>
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {language === "en" ? "Save Settings" : "Hifadhi Mipangilio"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}
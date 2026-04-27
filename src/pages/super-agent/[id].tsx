import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockSuperAgents } from "@/lib/mockData";
import { Shield, MapPin, Users, Store, Phone, MessageSquare, ArrowLeft, CheckCircle2, TrendingUp, Mail } from "lucide-react";

export default function SuperAgentProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();

  const agent = mockSuperAgents.find(a => a.id === id);

  if (!agent) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pb-24 px-4">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {language === "en" ? "Super Agent Not Found" : "Wakala Mkuu Hapatikani"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === "en" ? "The super agent you're looking for doesn't exist." : "Wakala mkuu unayemtafuta hayupo."}
            </p>
            <Link href="/">
              <Button>{language === "en" ? "Back to Home" : "Rudi Nyumbani"}</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const totalOnboarded = agent.fundisOnboarded + agent.shopsOnboarded;
  const initials = agent.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <Head>
        <title>{agent.name} - Smart Fundi Super Agent</title>
        <meta name="description" content={`Super Agent profile for ${agent.name} in ${agent.region}`} />
      </Head>
      <Header />
      
      <main className="min-h-screen pb-24 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container max-w-3xl py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "en" ? "Back" : "Rudi"}
          </Button>

          <Card className="overflow-hidden shadow-lg">
            <div className="h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500" />
            
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative mx-auto sm:mx-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-75 blur-sm" />
                  <Avatar className="relative h-32 w-32 border-4 border-yellow-400">
                    <AvatarImage src={agent.photo} alt={agent.name} />
                    <AvatarFallback className="bg-yellow-100 text-yellow-800 font-bold text-3xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">{agent.name}</h1>
                    {agent.verified && (
                      <CheckCircle2 className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-3">
                    <Shield className="h-3 w-3 mr-1" />
                    {t("superAgent.badge")}
                  </Badge>

                  <div className="flex items-center gap-1.5 justify-center sm:justify-start text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">
                      {agent.region}
                      {agent.district && `, ${agent.district}`}
                    </span>
                  </div>

                  {agent.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {agent.bio}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-lg font-semibold mb-3">
                  {language === "en" ? "Onboarding Stats" : "Takwimu za Usajili"}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{agent.fundisOnboarded}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "en" ? "Fundis" : "Mafundi"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900">
                    <Store className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{agent.shopsOnboarded}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "en" ? "Shops" : "Maduka"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalOnboarded}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "en" ? "Total" : "Jumla"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("superAgent.contact")}
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agent.phone && (
                    <Button size="lg" variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <span className="truncate">{agent.phone}</span>
                    </Button>
                  )}
                  {agent.email && (
                    <Button size="lg" variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="truncate text-xs sm:text-sm">{agent.email}</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
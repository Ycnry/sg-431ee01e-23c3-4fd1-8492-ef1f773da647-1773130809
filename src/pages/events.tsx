import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { mockEvents } from "@/lib/mockData";

export default function EventsPage() {
  const { language } = useLanguage();

  const upcomingEvents = mockEvents.filter(e => new Date(e.date) >= new Date());
  const totalAttendees = mockEvents.reduce((sum, e) => sum + e.expectedAttendees, 0);
  const totalCities = new Set(mockEvents.map(e => e.location)).size;
  const sponsoredCount = mockEvents.filter(e => e.isSponsored).length;

  const metaTitle = language === "en" ? "Events - Smart Fundi" : "Matukio - Smart Fundi";

  const stats = [
    {
      icon: Calendar,
      value: upcomingEvents.length,
      label: language === "en" ? "Upcoming" : "Yanayokuja",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: Users,
      value: `${totalAttendees}+`,
      label: language === "en" ? "Attendees" : "Washiriki",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: MapPin,
      value: totalCities,
      label: language === "en" ? "Cities" : "Miji",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Sparkles,
      value: sponsoredCount,
      label: language === "en" ? "Featured" : "Maalum",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getEventTitle = (event: typeof mockEvents[0]) => {
    if (typeof event.title === "string") return event.title;
    return language === "en" ? event.title.en : event.title.sw;
  };

  const getEventDescription = (event: typeof mockEvents[0]) => {
    if (typeof event.description === "string") return event.description;
    return language === "en" ? event.description.en : event.description.sw;
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {language === "en" ? "Events" : "Matukio"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Matukio Yanayokuja Tanzania
            </p>
          </div>

          {/* Stats Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border border-border shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Listings */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {language === "en" ? "Upcoming Events" : "Matukio Yanayokuja"}
            </h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="bg-card border border-border shadow-sm overflow-hidden">
                    {event.imageUrl && (
                      <div className="h-32 w-full overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={getEventTitle(event)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {event.isSponsored && (
                            <Badge className="bg-orange-500 text-white text-xs mb-2">
                              {language === "en" ? "Featured" : "Maalum"}
                            </Badge>
                          )}
                          <h3 className="font-semibold text-foreground text-base leading-tight mb-2">
                            {getEventTitle(event)}
                          </h3>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>
                            {event.organizer && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {language === "en" ? "By" : "Na"}: {event.organizer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{event.expectedAttendees}+ {language === "en" ? "expected" : "watarajiwa"}</span>
                        </div>
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 h-auto"
                        >
                          {language === "en" ? "Register" : "Jiandikishe"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State - Friendly User Message */
              <Card className="bg-card border border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    Hakuna matukio yajayo kwa sasa
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Angalia tena baadaye kwa matukio mapya
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Host Your Event CTA */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {language === "en" ? "Host Your Event" : "Panga Tukio Lako"}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                {language === "en"
                  ? "Promote your workshop or trade fair to thousands of technicians."
                  : "Tangaza warsha au maonyesho yako kwa maelfu ya mafundi."}
              </p>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">25,000 TZS</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  {language === "en" ? "List Event" : "Orodhesha"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
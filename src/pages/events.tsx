
import Head from "next/head";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { mockEvents } from "@/lib/mockData";

export default function EventsPage() {
  const { t, language } = useLanguage();

  const upcomingEvents = mockEvents.filter(e => new Date(e.date) >= new Date());
  const pastEvents = mockEvents.filter(e => new Date(e.date) < new Date());

  const metaTitle = language === "en" ? "Trade Events & Workshops - Smart Fundi" : "Matukio ya Biashara - Smart Fundi";

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
            <h1 className="text-3xl font-bold mb-2">
              {language === "en" ? "Trade Events & Workshops" : "Matukio ya Biashara na Mafunzo"}
            </h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Discover networking events, training workshops, and trade fairs"
                : "Gundua matukio ya kuwasiliana, mafunzo, na maonyesho ya biashara"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-6">
                <Calendar className="h-8 w-8 mb-3" />
                <h3 className="text-2xl font-bold mb-1">{upcomingEvents.length}</h3>
                <p className="text-blue-100">
                  {language === "en" ? "Upcoming Events" : "Matukio Yajayo"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mb-3" />
                <h3 className="text-2xl font-bold mb-1">
                  {mockEvents.reduce((sum, e) => sum + e.expectedAttendees, 0)}+
                </h3>
                <p className="text-orange-100">
                  {language === "en" ? "Expected Attendees" : "Watarajiwa Kuhudhuria"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 mb-3" />
                <h3 className="text-2xl font-bold mb-1">
                  {new Set(mockEvents.map(e => e.location)).size}
                </h3>
                <p className="text-green-100">
                  {language === "en" ? "Cities" : "Miji"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {language === "en" ? "Upcoming Events" : "Matukio Yajayo"}
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "No upcoming events at the moment"
                      : "Hakuna matukio yajayo kwa sasa"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                {language === "en" ? "Host Your Event" : "Panga Tukio Lako"}
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                {language === "en"
                  ? "Reach thousands of skilled technicians and hardware suppliers. Promote your training workshop, trade fair, or networking event."
                  : "Fikia maelfu ya mafundi wenye ujuzi na wasambazaji wa vifaa. Tangaza warsha yako ya mafunzo, maonyesho ya biashara, au tukio la kuwasiliana."}
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-600">25,000 TZS per event</Badge>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
                  {language === "en" ? "List Your Event" : "Orodhesha Tukio Lako"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

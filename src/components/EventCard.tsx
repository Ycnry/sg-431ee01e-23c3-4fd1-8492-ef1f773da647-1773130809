
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { language } = useLanguage();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-orange-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Calendar className="h-16 w-16 text-blue-600 opacity-50" />
        </div>
        {event.sponsored && (
          <Badge className="absolute top-3 right-3 bg-orange-500">
            Sponsored
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">
          {event.title[language]}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description[language]}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{event.organizerName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

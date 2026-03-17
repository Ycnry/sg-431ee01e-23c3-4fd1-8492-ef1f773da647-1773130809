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
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title[language]} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {event.isSponsored && (
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-xs">
            Sponsored
          </Badge>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
          {event.title[language]}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
          {event.description[language]}
        </p>
        
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{event.organizer}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">
              {new Date(event.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric"
              })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
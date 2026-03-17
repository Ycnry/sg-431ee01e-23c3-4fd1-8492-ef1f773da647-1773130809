import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, Users, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { language } = useLanguage();

  return (
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10
        active:translate-y-0 active:shadow-lg
        ${event.isSponsored 
          ? "border-2 border-orange-500 featured-pulse" 
          : "hover:border-primary/30 hover-glow"
        }
      `}
    >
      {/* Image container with zoom effect */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title[language]} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sponsored badge */}
        {event.isSponsored && (
          <Badge 
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-xs animate-float flex items-center gap-1 shadow-lg"
          >
            <Sparkles className="h-3 w-3" />
            Sponsored
          </Badge>
        )}
        
        {/* Date badge */}
        <div 
          className={`
            absolute top-2 left-2 sm:top-3 sm:left-3 
            bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
            rounded-lg p-1.5 sm:p-2 shadow-lg
            transition-transform duration-300 group-hover:scale-105
          `}
        >
          <div className="text-center">
            <div className="text-xs font-medium text-primary uppercase">
              {new Date(event.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { month: "short" })}
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground leading-none">
              {new Date(event.date).getDate()}
            </div>
          </div>
        </div>
        
        {/* Hover CTA overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between text-white text-sm font-medium">
            <span>{language === "sw" ? "Tazama Zaidi" : "View Details"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 relative">
        {/* Shine effect */}
        <div className="absolute inset-0 shine-effect pointer-events-none" />
        
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-primary relative z-10">
          {event.title[language]}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 transition-transform duration-200 group-hover:-translate-y-0.5 relative z-10">
          {event.description[language]}
        </p>
        
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm relative z-10">
          <div className="flex items-center gap-2 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            <span className="truncate">{event.organizer}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            <span className="truncate">
              {new Date(event.date).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric"
              })}
            </span>
          </div>
          {event.expectedAttendees && (
            <div className="flex items-center gap-2 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
              <span className="truncate">
                {event.expectedAttendees.toLocaleString()} {language === "sw" ? "wanatarajiwa" : "expected"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
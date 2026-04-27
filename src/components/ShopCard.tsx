import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Phone, Star, MapPin, Clock, CheckCircle2, Sparkles, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shop } from "@/types";

interface ShopCardProps {
  shop: Shop;
  featured?: boolean;
}

export function ShopCard({ shop, featured }: ShopCardProps) {
  const { t } = useLanguage();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/shop/${shop.id}`} className="block">
      <Card 
        className={`
          group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer
          hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10
          active:translate-y-0 active:shadow-lg
          ${featured 
            ? "border-2 border-orange-500 featured-pulse bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20" 
            : "hover:border-primary/30 hover-glow"
          }
        `}
      >
        <div className="absolute inset-0 shine-effect pointer-events-none" />
        
        {featured && (
          <div className="absolute top-0 left-0 right-0 h-1 gradient-border-animate" />
        )}
        
        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Avatar 
              className={`
                h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-lg transition-all duration-300
                border-2 border-blue-100 dark:border-blue-900
                group-hover:ring-4 group-hover:ring-primary/20 group-hover:scale-105
                group-hover:border-primary/50
              `}
            >
              <AvatarImage 
                src={shop.image || shop.logo} 
                alt={shop.shopName || shop.name}
                className="rounded-lg transition-transform duration-500 group-hover:scale-110"
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm sm:text-base dark:bg-blue-900 dark:text-blue-300">
                <Store className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <h3 className="font-semibold text-base sm:text-lg truncate transition-colors duration-200 group-hover:text-primary">
                  {shop.shopName || shop.name}
                </h3>
                {shop.verified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                <MapPin className="h-3 w-3 shrink-0 transition-colors duration-200 group-hover:text-primary" />
                <span className="truncate">{shop.city}, {shop.ward}</span>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0 transition-colors duration-200 group-hover:text-green-500" />
                <span className="truncate">{shop.openingHours}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
            {shop.categories?.slice(0, 3).map((category, index) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className={`
                  text-[10px] sm:text-xs transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  group-hover:scale-105
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
            <div className="flex items-center gap-1 transition-transform duration-200 group-hover:scale-105">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium text-sm">{shop.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              ({shop.reviewCount} {t("common.reviews")})
            </span>
            {featured && (
              <Badge 
                variant="secondary" 
                className="ml-auto bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs animate-float flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleButtonClick}
              className={`
                flex-1 gap-1.5 sm:gap-2 h-10 sm:h-11 text-sm
                transition-all duration-200
                group-hover:shadow-lg group-hover:shadow-primary/25
                hover:scale-[1.02] active:scale-[0.98]
              `}
              variant="default"
            >
              <MessageSquare className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-rotate-6" />
              <span className="truncate">{t("action.message")}</span>
            </Button>
            {shop.whatsapp && (
              <Button 
                onClick={handleButtonClick}
                variant="outline" 
                size="icon" 
                className={`
                  h-10 w-10 sm:h-11 sm:w-11 shrink-0
                  transition-all duration-200
                  hover:bg-green-50 hover:border-green-500 hover:text-green-600
                  dark:hover:bg-green-950 dark:hover:border-green-400 dark:hover:text-green-400
                  hover:scale-110 active:scale-95
                `}
              >
                <Phone className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
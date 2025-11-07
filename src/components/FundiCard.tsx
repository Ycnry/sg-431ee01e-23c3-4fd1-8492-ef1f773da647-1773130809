
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Phone, Star, MapPin, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Fundi } from "@/types";

interface FundiCardProps {
  fundi: Fundi;
  featured?: boolean;
}

export function FundiCard({ fundi, featured }: FundiCardProps) {
  const { t } = useLanguage();

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? "border-orange-500 border-2" : ""}`}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-blue-100">
            <AvatarImage src={fundi.photo} alt={fundi.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {fundi.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{fundi.name}</h3>
              {fundi.verified && (
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{fundi.specialty}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{fundi.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{fundi.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({fundi.reviewCount} {t("common.reviews")})
          </span>
          {featured && (
            <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700">
              Featured
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" variant="default">
            <MessageSquare className="h-4 w-4" />
            {t("action.message")}
          </Button>
          {fundi.whatsapp && (
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

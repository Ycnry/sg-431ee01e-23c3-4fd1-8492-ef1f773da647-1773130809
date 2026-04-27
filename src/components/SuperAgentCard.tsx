import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { SuperAgent } from "@/types";
import { Shield, MapPin, Users, Store, MessageSquare } from "lucide-react";

interface SuperAgentCardProps {
  agent: SuperAgent;
  onContact?: (agent: SuperAgent) => void;
  onViewProfile?: (agent: SuperAgent) => void;
}

export function SuperAgentCard({ agent, onContact }: SuperAgentCardProps) {
  const { t, language } = useLanguage();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalOnboarded = agent.fundisOnboarded + agent.shopsOnboarded;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(agent);
  };

  return (
    <Link href={`/super-agent/${agent.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border border-border bg-card cursor-pointer">
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500" />
        
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-75 blur-sm" />
              <Avatar className="relative h-16 w-16 border-2 border-yellow-400">
                <AvatarImage src={agent.photo} alt={agent.name} />
                <AvatarFallback className="bg-yellow-100 text-yellow-800 font-bold">
                  {getInitials(agent.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-foreground text-base truncate">
                  {agent.name}
                </h3>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {t("superAgent.badge")}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-yellow-600" />
                <span>
                  {agent.region}
                  {agent.district && `, ${agent.district}`}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span>{agent.fundisOnboarded} {language === "en" ? "Fundis" : "Mafundi"}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Store className="h-3.5 w-3.5 text-green-500" />
                  <span>{agent.shopsOnboarded} {language === "en" ? "Shops" : "Maduka"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                {t("superAgent.totalOnboarded")}
              </span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {totalOnboarded}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              size="sm"
              onClick={handleContactClick}
              className="w-full text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              {t("superAgent.contact")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
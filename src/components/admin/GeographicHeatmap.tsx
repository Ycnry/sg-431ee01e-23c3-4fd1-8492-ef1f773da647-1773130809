import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";

interface CityData {
  city: string;
  users: number;
  fundis: number;
  shops: number;
}

interface GeographicHeatmapProps {
  data?: CityData[];
}

export function GeographicHeatmap({ data }: GeographicHeatmapProps) {
  const { language } = useLanguage();

  const defaultData: CityData[] = [
    { city: "Dar es Salaam", users: 2450, fundis: 180, shops: 28 },
    { city: "Arusha", users: 680, fundis: 45, shops: 8 },
    { city: "Mwanza", users: 520, fundis: 35, shops: 6 },
    { city: "Dodoma", users: 380, fundis: 25, shops: 4 },
    { city: "Mbeya", users: 290, fundis: 18, shops: 3 },
    { city: "Morogoro", users: 220, fundis: 15, shops: 2 },
  ];

  const chartData = data || defaultData;
  const maxUsers = Math.max(...chartData.map(d => d.users));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          {language === "sw" ? "Usambazaji wa Kijiografia" : "Geographic Distribution"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chartData.map((city, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{city.city}</span>
                <span className="text-muted-foreground">{city.users.toLocaleString()} {language === "sw" ? "watumiaji" : "users"}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(city.users / maxUsers) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{city.fundis} {language === "sw" ? "mafundi" : "fundis"}</span>
                <span>{city.shops} {language === "sw" ? "maduka" : "shops"}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
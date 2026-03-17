import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Users, Store } from "lucide-react";

interface SubscriptionData {
  month: string;
  fundis: number;
  shops: number;
}

interface SubscriptionChartProps {
  data?: SubscriptionData[];
}

export function SubscriptionChart({ data }: SubscriptionChartProps) {
  const { language } = useLanguage();

  const defaultData: SubscriptionData[] = [
    { month: "Jan", fundis: 120, shops: 25 },
    { month: "Feb", fundis: 145, shops: 28 },
    { month: "Mar", fundis: 180, shops: 32 },
    { month: "Apr", fundis: 210, shops: 38 },
    { month: "May", fundis: 245, shops: 42 },
    { month: "Jun", fundis: 280, shops: 48 },
  ];

  const chartData = data || defaultData;
  const maxValue = Math.max(...chartData.flatMap(d => [d.fundis, d.shops]));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          {language === "sw" ? "Ukuaji wa Usajili" : "Subscription Growth"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.month}</span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-500" /> {item.fundis}
                  </span>
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3 text-purple-500" /> {item.shops}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 h-4">
                <div
                  className="bg-blue-500 rounded-sm transition-all duration-500"
                  style={{ width: `${(item.fundis / maxValue) * 70}%` }}
                />
                <div
                  className="bg-purple-500 rounded-sm transition-all duration-500"
                  style={{ width: `${(item.shops / maxValue) * 70}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
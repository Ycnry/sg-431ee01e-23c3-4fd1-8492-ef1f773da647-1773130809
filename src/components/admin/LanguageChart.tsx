import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

interface LanguageData {
  language: string;
  users: number;
  percentage: number;
}

interface LanguageChartProps {
  data?: LanguageData[];
}

export function LanguageChart({ data }: LanguageChartProps) {
  const { language } = useLanguage();

  const defaultData: LanguageData[] = [
    { language: "Swahili", users: 3250, percentage: 72 },
    { language: "English", users: 1260, percentage: 28 },
  ];

  const chartData = data || defaultData;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          {language === "sw" ? "Lugha za Watumiaji" : "User Languages"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                className="text-blue-500"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={`${chartData[0]?.percentage * 2.51} 251`}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{chartData.reduce((a, b) => a + b.users, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-green-500" : "bg-blue-500"}`} />
                <span className="text-sm">{item.language}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{item.users.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm ml-2">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
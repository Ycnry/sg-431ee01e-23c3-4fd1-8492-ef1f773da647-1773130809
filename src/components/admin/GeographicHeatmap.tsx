
import { GeographicData } from "@/lib/adminData";
import { MapPin } from "lucide-react";

interface GeographicHeatmapProps {
  data: GeographicData[];
}

export function GeographicHeatmap({ data }: GeographicHeatmapProps) {
  const maxSignups = Math.max(...data.map(d => d.signups));
  
  const getHeatColor = (signups: number) => {
    const intensity = signups / maxSignups;
    if (intensity > 0.7) return "bg-blue-600";
    if (intensity > 0.4) return "bg-blue-500";
    if (intensity > 0.2) return "bg-blue-400";
    return "bg-blue-300";
  };

  const getHeatSize = (signups: number) => {
    const intensity = signups / maxSignups;
    if (intensity > 0.7) return "h-16 w-16";
    if (intensity > 0.4) return "h-12 w-12";
    if (intensity > 0.2) return "h-10 w-10";
    return "h-8 w-8";
  };

  const sortedData = [...data].sort((a, b) => b.signups - a.signups);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedData.map((location) => (
          <div
            key={location.city}
            className="flex items-center gap-4 p-4 bg-background border rounded-lg hover:bg-accent transition-colors"
          >
            <div className={`${getHeatColor(location.signups)} ${getHeatSize(location.signups)} rounded-full flex items-center justify-center transition-all`}>
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{location.city}</h4>
              <p className="text-sm text-muted-foreground">
                {location.signups.toLocaleString()} sign-ups
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {((location.signups / data.reduce((sum, d) => sum + d.signups, 0)) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">of total</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 justify-center pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-600"></div>
          <span className="text-xs text-muted-foreground">High Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-500"></div>
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-400"></div>
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-300"></div>
          <span className="text-xs text-muted-foreground">Very Low</span>
        </div>
      </div>
    </div>
  );
}

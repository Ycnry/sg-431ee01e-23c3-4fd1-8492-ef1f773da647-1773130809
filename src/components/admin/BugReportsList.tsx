import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bug, CheckCircle, Clock, AlertTriangle, Eye, Trash2 } from "lucide-react";

interface BugReport {
  id: string;
  title: string;
  description: string;
  reporter: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  category: string;
}

interface BugReportsListProps {
  reports?: BugReport[];
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BugReportsList({ reports, onResolve, onDelete }: BugReportsListProps) {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");

  const defaultReports: BugReport[] = [
    {
      id: "1",
      title: "Payment confirmation not showing",
      description: "After M-Pesa payment, confirmation message doesn't appear",
      reporter: "John Makamba",
      status: "open",
      priority: "high",
      createdAt: "2026-03-16",
      category: "Payments"
    },
    {
      id: "2",
      title: "Profile photo upload fails on slow connection",
      description: "When uploading profile photo on 3G, the upload times out",
      reporter: "Maria Joseph",
      status: "in_progress",
      priority: "medium",
      createdAt: "2026-03-15",
      category: "Upload"
    },
    {
      id: "3",
      title: "Search results not updating",
      description: "City filter in search doesn't work correctly",
      reporter: "Grace Mwita",
      status: "resolved",
      priority: "low",
      createdAt: "2026-03-14",
      category: "Search"
    }
  ];

  const bugReports = reports || defaultReports;
  const filteredReports = filter === "all" ? bugReports : bugReports.filter(r => r.status === filter);

  const getStatusBadge = (status: BugReport["status"]) => {
    const config = {
      open: { variant: "destructive" as const, icon: AlertTriangle, label: language === "sw" ? "Wazi" : "Open" },
      in_progress: { variant: "secondary" as const, icon: Clock, label: language === "sw" ? "Inashughulikiwa" : "In Progress" },
      resolved: { variant: "default" as const, icon: CheckCircle, label: language === "sw" ? "Imetatuliwa" : "Resolved" }
    };
    const { variant, icon: Icon, label } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: BugReport["priority"]) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      critical: "text-red-600"
    };
    return colors[priority];
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-500" />
            {language === "sw" ? "Ripoti za Hitilafu" : "Bug Reports"}
          </span>
          <Badge variant="outline">{bugReports.filter(r => r.status === "open").length} {language === "sw" ? "wazi" : "open"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? (language === "sw" ? "Zote" : "All") :
               f === "open" ? (language === "sw" ? "Wazi" : "Open") :
               f === "in_progress" ? (language === "sw" ? "Inashughulikiwa" : "In Progress") :
               (language === "sw" ? "Imetatuliwa" : "Resolved")}
            </Button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-medium">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                {getStatusBadge(report.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${getPriorityColor(report.priority)}`}>
                    {report.priority.toUpperCase()}
                  </span>
                  <span>{report.category}</span>
                  <span>{report.reporter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{report.createdAt}</span>
                  {report.status !== "resolved" && (
                    <Button size="sm" variant="ghost" onClick={() => onResolve?.(report.id)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete?.(report.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
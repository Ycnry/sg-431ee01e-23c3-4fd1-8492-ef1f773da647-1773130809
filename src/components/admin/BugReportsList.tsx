
import { useState } from "react";
import { BugReport, formatDate } from "@/lib/adminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface BugReportsListProps {
  reports: BugReport[];
  onResolve: (bugId: string) => void;
}

export function BugReportsList({ reports, onResolve }: BugReportsListProps) {
  const [filter, setFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");

  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(r => r.status === filter);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "resolved": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({reports.length})
        </Button>
        <Button
          variant={filter === "open" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("open")}
        >
          Open ({reports.filter(r => r.status === "open").length})
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in-progress")}
        >
          In Progress ({reports.filter(r => r.status === "in-progress").length})
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("resolved")}
        >
          Resolved ({reports.filter(r => r.status === "resolved").length})
        </Button>
      </div>

      <div className="space-y-3">
        {filteredReports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{report.userName}</span>
                    <span>•</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(report.priority)}>
                    {report.priority}
                  </Badge>
                  <Badge variant="outline">{report.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{report.description}</p>
              {report.status !== "resolved" && (
                <Button
                  size="sm"
                  onClick={() => onResolve(report.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Resolved
                </Button>
              )}
              {report.status === "resolved" && report.resolvedAt && (
                <div className="text-xs text-green-600">
                  Resolved on {formatDate(report.resolvedAt)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No {filter !== "all" ? filter : ""} bug reports found
          </div>
        )}
      </div>
    </div>
  );
}

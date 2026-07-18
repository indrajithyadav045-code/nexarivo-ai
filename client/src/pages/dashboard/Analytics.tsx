import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Zap, Activity } from "lucide-react";

export default function Analytics() {
  const metrics = [
    {
      icon: Activity,
      label: "Total Requests",
      value: "2,847",
      change: "+12.5%",
      positive: true,
    },
    {
      icon: Zap,
      label: "Tokens Used",
      value: "1.2M",
      change: "+8.2%",
      positive: true,
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "99.8%",
      change: "+0.3%",
      positive: true,
    },
    {
      icon: BarChart3,
      label: "Avg Response Time",
      value: "245ms",
      change: "-5.1%",
      positive: true,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-sm text-muted-foreground">Track your usage and performance metrics</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="p-6 bg-background border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    metric.positive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{metric.label}</h3>
                <p className="text-2xl font-bold">{metric.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-background border-border">
            <h3 className="font-bold mb-4">Usage Over Time</h3>
            <div className="h-64 bg-card/50 rounded-lg flex items-center justify-center text-muted-foreground">
              <p>Chart visualization would go here</p>
            </div>
          </Card>

          <Card className="p-6 bg-background border-border">
            <h3 className="font-bold mb-4">Agent Usage Distribution</h3>
            <div className="h-64 bg-card/50 rounded-lg flex items-center justify-center text-muted-foreground">
              <p>Chart visualization would go here</p>
            </div>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="p-6 bg-background border-border mt-6">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">Activity #{i}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <span className="text-xs bg-card px-2 py-1 rounded">Completed</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

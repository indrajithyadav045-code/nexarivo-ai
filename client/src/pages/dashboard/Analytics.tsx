import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Activity, BarChart3, Clock3, Loader2, TrendingUp, Zap } from "lucide-react";

const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export default function Analytics() {
  const summaryQuery = trpc.analytics.summary.useQuery(undefined, { refetchInterval: 15000 });
  const modelQuery = trpc.analytics.byModel.useQuery(undefined, { refetchInterval: 15000 });
  const recentQuery = trpc.analytics.recent.useQuery(undefined, { refetchInterval: 15000 });
  const dailyQuery = trpc.analytics.byDay.useQuery(undefined, { refetchInterval: 15000 });
  const summary = summaryQuery.data;
  const modelData = modelQuery.data ?? [];
  const dailyData = dailyQuery.data ?? [];
  const maxRequests = Math.max(...modelData.map((item) => Number(item.requests)), 1);
  const maxDailyRequests = Math.max(...dailyData.map((item) => Number(item.requests)), 1);

  const metrics = [
    { icon: Activity, label: "Total Requests", value: formatNumber(Number(summary?.totalRequests ?? 0)), detail: "Recorded AI calls" },
    { icon: Zap, label: "Tokens Used", value: formatNumber(Number(summary?.totalTokens ?? 0)), detail: "Input + output tokens" },
    { icon: TrendingUp, label: "Success Rate", value: `${Number(summary?.successRate ?? 0).toFixed(1)}%`, detail: "Successful responses" },
    { icon: Clock3, label: "Avg Response Time", value: `${Number(summary?.averageLatency ?? 0)}ms`, detail: "Across recorded calls" },
    { icon: BarChart3, label: "Estimated Spend", value: `$${(Number(summary?.estimatedCostMicros ?? 0) / 1_000_000).toFixed(2)}`, detail: "Platform usage estimate" },
  ];

  const isLoading = summaryQuery.isLoading || modelQuery.isLoading || recentQuery.isLoading || dailyQuery.isLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-sm text-muted-foreground">Live usage and performance metrics from your NEXARIVO-AI workspace.</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading && !summary ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground gap-2"><Loader2 className="animate-spin" size={18} /> Loading live analytics…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.label} className="p-6 bg-background border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center"><Icon size={20} className="text-accent" /></div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-accent/10 text-accent">Live</span>
                    </div>
                    <h3 className="text-sm text-muted-foreground mb-1">{metric.label}</h3>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{metric.detail}</p>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6 bg-background border-border mb-6">
              <div className="flex items-center justify-between mb-6"><div><h3 className="font-bold">Usage Over Time</h3><p className="text-xs text-muted-foreground mt-1">Daily AI requests recorded in your workspace</p></div><TrendingUp size={18} className="text-accent" /></div>
              {dailyData.length === 0 ? <p className="h-40 flex items-center justify-center text-sm text-muted-foreground">No daily usage data yet.</p> : <div className="h-44 flex items-end gap-2 overflow-x-auto">{dailyData.map((item) => { const requests = Number(item.requests); return <div key={String(item.day)} className="min-w-10 flex-1 h-full flex flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted-foreground">{requests}</span><div className="w-full rounded-t-md bg-gradient-to-t from-accent to-purple-400" style={{ height: `${Math.max((requests / maxDailyRequests) * 100, 5)}%` }} /><span className="text-[10px] text-muted-foreground whitespace-nowrap">{String(item.day).slice(5)}</span></div>; })}</div>}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-background border-border">
                <div className="flex items-center justify-between mb-6"><div><h3 className="font-bold">Model Usage</h3><p className="text-xs text-muted-foreground mt-1">Requests recorded by model</p></div><BarChart3 size={18} className="text-accent" /></div>
                {modelData.length === 0 ? <p className="h-48 flex items-center justify-center text-sm text-muted-foreground">No usage recorded yet. Send a message to start tracking.</p> : <div className="space-y-5">{modelData.map((item) => { const requests = Number(item.requests); return <div key={item.model}><div className="flex justify-between text-sm mb-2"><span className="font-medium">{item.model}</span><span className="text-muted-foreground">{formatNumber(requests)} requests</span></div><div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400" style={{ width: `${Math.max((requests / maxRequests) * 100, 4)}%` }} /></div><p className="text-xs text-muted-foreground mt-1">{formatNumber(Number(item.tokens))} tokens · ${(Number(item.estimatedCostMicros) / 1_000_000).toFixed(2)} estimated</p></div>; })}</div>}
              </Card>

              <Card className="p-6 bg-background border-border">
                <div className="flex items-center justify-between mb-6"><div><h3 className="font-bold">Recent Activity</h3><p className="text-xs text-muted-foreground mt-1">Latest recorded AI requests</p></div><Activity size={18} className="text-accent" /></div>
                {recentQuery.data?.length ? <div className="space-y-3">{recentQuery.data.map((event) => <div key={event.id} className="flex items-center justify-between py-3 border-b border-border last:border-0"><div><p className="font-medium text-sm">{event.model}</p><p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded ${event.status === "success" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>{event.status}</span><p className="text-xs text-muted-foreground mt-1">{event.latencyMs}ms</p></div></div>)}</div> : <p className="h-48 flex items-center justify-center text-sm text-muted-foreground">Your recent AI activity will appear here.</p>}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


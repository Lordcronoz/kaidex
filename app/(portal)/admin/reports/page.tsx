"use client";

import { MiniChart } from "@/components/portal/mini-chart";

const monthlyRevenue = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 9100 },
  { month: "Mar", value: 7800 },
  { month: "Apr", value: 10400 },
  { month: "May", value: 11200 },
  { month: "Jun", value: 9800 },
  { month: "Jul", value: 15100 },
];

const projectsByStatus = [
  { label: "Draft", count: 4, pct: 8 },
  { label: "In Progress", count: 23, pct: 49 },
  { label: "Review", count: 8, pct: 17 },
  { label: "Completed", count: 12, pct: 26 },
];

const topClients = [
  { name: "Beacon AI", revenue: "$28,400", projects: 5 },
  { name: "Meridian Labs", revenue: "$22,100", projects: 3 },
  { name: "Flux Systems", revenue: "$18,600", projects: 2 },
  { name: "Prism Analytics", revenue: "$14,200", projects: 1 },
];

const agentMetrics = [42, 48, 45, 52, 58, 55, 62, 59, 65, 68, 72, 75];

export default function ReportsPage() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analytics and reporting dashboards
        </p>
      </div>

      {/* Revenue breakdown — full width */}
      <div className="p-6 bg-card border border-border rounded-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-medium">Revenue — YTD</h2>
            <p className="text-3xl font-display mt-1">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <MiniChart data={monthlyRevenue.map((m) => m.value)} width={180} height={56} />
        </div>
        <div className="flex items-end gap-3 h-40">
          {monthlyRevenue.map((m) => {
            const max = Math.max(...monthlyRevenue.map((x) => x.value));
            const pct = (m.value / max) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground">
                  ${(m.value / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-foreground/15 rounded-sm hover:bg-foreground/30 transition-colors"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] font-mono text-muted-foreground">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: project distribution + top clients */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project distribution — horizontal bars */}
        <div className="p-6 bg-card border border-border rounded-md">
          <h2 className="text-sm font-medium mb-6">Projects by Status</h2>
          <div className="space-y-4">
            {projectsByStatus.map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{s.label}</span>
                  <span className="text-muted-foreground font-mono text-xs">{s.count} ({s.pct}%)</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/40 rounded-full transition-all"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="p-6 bg-card border border-border rounded-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium">Top Clients by Revenue</h2>
            <MiniChart data={agentMetrics} width={80} height={28} color="rgba(251, 191, 36, 0.8)" />
          </div>
          <div className="space-y-4">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.projects} projects</p>
                </div>
                <span className="font-mono text-sm">{c.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

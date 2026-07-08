"use client";

import { Users, FolderKanban, DollarSign, Activity } from "lucide-react";
import { StatCard } from "@/components/portal/stat-card";
import { MiniChart } from "@/components/portal/mini-chart";
import { StatusBadge } from "@/components/portal/status-badge";

const revenueData = [8200, 9100, 7800, 10400, 11200, 9800, 12600, 11900, 13400, 14200, 12800, 15100];
const clientGrowth = [18, 20, 22, 21, 24, 26, 25, 28, 30, 29, 32, 34];

const systemStatus = [
  { name: "API Server", status: "ONLINE", latency: "12ms" },
  { name: "Database", status: "ONLINE", latency: "3ms" },
  { name: "Auth Service", status: "ONLINE", latency: "8ms" },
  { name: "Worker Queue", status: "ONLINE", latency: "45ms" },
];

const recentAudit = [
  { id: "1", user: "sarah@meridian.io", action: "UPDATE", target: "Project", time: "5 min ago" },
  { id: "2", user: "admin@kaidex.io", action: "CREATE", target: "Invoice", time: "22 min ago" },
  { id: "3", user: "marcus@flux.co", action: "DELETE", target: "Deliverable", time: "1h ago" },
  { id: "4", user: "admin@kaidex.io", action: "UPDATE", target: "User", time: "2h ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cross-client overview and system status
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Clients"
          value={34}
          change="+6 this quarter"
          trend="up"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Active Projects"
          value={47}
          change="+12 vs last month"
          trend="up"
          icon={<FolderKanban className="w-4 h-4" />}
        />
        <StatCard
          label="Revenue (MTD)"
          value="$42.8k"
          change="+18% MoM"
          trend="up"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="System Uptime"
          value="99.97%"
          change="Last 30 days"
          trend="neutral"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Charts row — asymmetric 3-col layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-medium">Monthly Revenue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months</p>
            </div>
            <MiniChart data={revenueData} width={160} height={48} />
          </div>
          {/* Simple bar chart using CSS */}
          <div className="flex items-end gap-1.5 h-32">
            {revenueData.map((val, i) => {
              const max = Math.max(...revenueData);
              const pct = (val / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-foreground/20 rounded-sm hover:bg-foreground/40 transition-colors"
                    style={{ height: `${pct}%` }}
                    title={`$${(val).toLocaleString()}`}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono">
                    {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client growth */}
        <div className="p-6 bg-card border border-border rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Client Growth</h2>
            <MiniChart data={clientGrowth} width={80} height={28} color="rgba(52, 211, 153, 0.8)" />
          </div>
          <p className="text-4xl font-display mb-1">34</p>
          <p className="text-xs text-muted-foreground mb-6">total active clients</p>

          {/* System status */}
          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">System Status</h3>
            {systemStatus.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span>{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{s.latency}</span>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent audit log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Audit Activity</h2>
          <a href="/admin/audit" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
            View full log →
          </a>
        </div>
        <div className="border border-border rounded-md divide-y divide-border">
          {recentAudit.map((entry) => (
            <div key={entry.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground w-20">{entry.time}</span>
              <StatusBadge status={entry.action} variant={
                entry.action === "CREATE" ? "success" :
                entry.action === "UPDATE" ? "warning" :
                "error"
              } />
              <span className="text-muted-foreground">{entry.target}</span>
              <span className="ml-auto text-xs font-mono text-muted-foreground">{entry.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { FolderKanban, FileText, MessageSquare, Clock } from "lucide-react";
import { StatCard } from "@/components/portal/stat-card";
import { MiniChart } from "@/components/portal/mini-chart";
import { StatusBadge } from "@/components/portal/status-badge";

// Mock data — will be replaced with API calls
const recentProjects = [
  { id: "1", title: "AI Agent Fleet v2", status: "IN_PROGRESS", updated: "2h ago" },
  { id: "2", title: "Data Pipeline Optimization", status: "REVIEW", updated: "1d ago" },
  { id: "3", title: "Security Audit Q3", status: "COMPLETED", updated: "3d ago" },
];

const recentActivity = [
  { id: "1", text: "Deliverable uploaded: Architecture diagram v3", time: "35 min ago" },
  { id: "2", text: "Invoice #INV-2026-012 marked as paid", time: "2h ago" },
  { id: "3", text: "New message from Kaidex team", time: "4h ago" },
  { id: "4", text: "Project status changed: AI Agent Fleet v2 → In Progress", time: "1d ago" },
];

const weeklyActivity = [12, 18, 14, 22, 19, 25, 21, 28, 24, 30, 27, 32];

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Stats row — varied widths, not a uniform grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={3}
          change="+1 this month"
          trend="up"
          icon={<FolderKanban className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Invoices"
          value={2}
          change="$4,200 due"
          trend="neutral"
          icon={<FileText className="w-4 h-4" />}
        />
        <StatCard
          label="Unread Messages"
          value={5}
          change="3 new today"
          trend="up"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. Turnaround"
          value="2.4d"
          change="-0.8d vs last month"
          trend="up"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Two-column layout: projects + activity feed */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Projects — takes 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Projects</h2>
            <a href="/client/projects" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-md hover:border-foreground/20 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-foreground transition-colors">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Updated {project.updated}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed — takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Activity</h2>
            <MiniChart data={weeklyActivity} width={80} height={28} />
          </div>
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-md hover:bg-accent/30 transition-colors"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

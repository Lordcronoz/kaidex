"use client";

import { FolderKanban, FileText, MessageSquare, Clock } from "lucide-react";
import { StatCard } from "@/components/portal/stat-card";
import { MiniChart } from "@/components/portal/mini-chart";
import { StatusBadge } from "@/components/portal/status-badge";
import { useApi } from "@/hooks/use-api";

const weeklyActivity = [12, 18, 14, 22, 19, 25, 21, 28, 24, 30, 27, 32];

interface Project {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

interface ProjectsResponse {
  data: Project[];
  meta: { total: number };
}

interface InvoicesResponse {
  data: { id: string; status: string; amount: string }[];
  meta: { total: number };
}

interface MessagesResponse {
  data: { id: string }[];
  meta: { total: number };
}

export default function ClientDashboard() {
  const projects = useApi<ProjectsResponse>("/projects?limit=3&sortBy=updatedAt");
  const invoices = useApi<InvoicesResponse>("/invoices?limit=100");
  const messages = useApi<MessagesResponse>("/messages?limit=100");

  const projectData = projects.data?.data || [];
  const projectCount = projects.data?.meta?.total || 0;

  const pendingInvoices = invoices.data?.data?.filter(
    (i) => i.status === "SENT" || i.status === "OVERDUE"
  ) || [];

  const unreadMessages = messages.data?.meta?.total || 0;

  const isLoading = projects.loading || invoices.loading || messages.loading;

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={isLoading ? "—" : projectCount}
          change={isLoading ? "" : `${projectCount} total`}
          trend="up"
          icon={<FolderKanban className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Invoices"
          value={isLoading ? "—" : pendingInvoices.length}
          change={isLoading ? "" : `${pendingInvoices.length} outstanding`}
          trend="neutral"
          icon={<FileText className="w-4 h-4" />}
        />
        <StatCard
          label="Messages"
          value={isLoading ? "—" : unreadMessages}
          change={isLoading ? "" : "total"}
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

          {projects.loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-accent/30 rounded-md animate-pulse" />
              ))}
            </div>
          ) : projects.error ? (
            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
              {projects.error}
            </div>
          ) : projectData.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-md">
              No projects yet
            </div>
          ) : (
            <div className="space-y-3">
              {projectData.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-md hover:border-foreground/20 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-foreground transition-colors">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Updated {timeAgo(project.updatedAt)}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed — takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Activity</h2>
            <MiniChart data={weeklyActivity} width={80} height={28} />
          </div>
          <div className="p-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-md">
            Activity feed will populate as you use the platform.
          </div>
        </div>
      </div>
    </div>
  );
}

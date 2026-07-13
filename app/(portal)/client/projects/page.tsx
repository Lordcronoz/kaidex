"use client";

import { StatusBadge } from "@/components/portal/status-badge";
import { DataTable } from "@/components/portal/data-table";
import { FolderKanban } from "lucide-react";
import { useApi } from "@/hooks/use-api";

interface Deliverable {
  id: string;
  title: string;
  completed: boolean;
}

interface Project {
  id: string;
  title: string;
  status: string;
  deliverables: Deliverable[];
  _count?: { deliverables: number };
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  data: Project[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const columns = [
  {
    key: "title" as const,
    label: "Project",
    render: (p: Project) => (
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-accent rounded">
          <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <span className="font-medium">{p.title}</span>
      </div>
    ),
  },
  {
    key: "status" as const,
    label: "Status",
    render: (p: Project) => <StatusBadge status={p.status} />,
  },
  {
    key: "deliverables" as const,
    label: "Progress",
    render: (p: Project) => {
      const total = p.deliverables?.length || 0;
      const completed = p.deliverables?.filter((d) => d.completed).length || 0;
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden max-w-[100px]">
            <div
              className="h-full bg-foreground/60 rounded-full transition-all"
              style={{
                width: total > 0 ? `${(completed / total) * 100}%` : "0%",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {completed}/{total}
          </span>
        </div>
      );
    },
  },
  {
    key: "updatedAt" as const,
    label: "Updated",
    className: "text-muted-foreground",
    render: (p: Project) => <span>{timeAgo(p.updatedAt)}</span>,
  },
];

export default function ProjectsPage() {
  const { data, loading, error } = useApi<ProjectsResponse>("/projects");

  const projects = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your project status and deliverables
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>{data?.meta?.total || 0} projects</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-accent/30 rounded-md animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} data={projects} emptyMessage="No projects found" />
      )}
    </div>
  );
}

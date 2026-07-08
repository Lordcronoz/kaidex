"use client";

import { StatusBadge } from "@/components/portal/status-badge";
import { DataTable } from "@/components/portal/data-table";
import { FolderKanban } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  deliverables: number;
  completed: number;
  created: string;
  updated: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "AI Agent Fleet v2",
    status: "IN_PROGRESS",
    deliverables: 8,
    completed: 5,
    created: "2026-05-12",
    updated: "2h ago",
  },
  {
    id: "2",
    title: "Data Pipeline Optimization",
    status: "REVIEW",
    deliverables: 4,
    completed: 4,
    created: "2026-06-01",
    updated: "1d ago",
  },
  {
    id: "3",
    title: "Security Audit Q3",
    status: "COMPLETED",
    deliverables: 6,
    completed: 6,
    created: "2026-04-20",
    updated: "3d ago",
  },
  {
    id: "4",
    title: "Infrastructure Migration",
    status: "DRAFT",
    deliverables: 0,
    completed: 0,
    created: "2026-07-05",
    updated: "5h ago",
  },
];

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
    render: (p: Project) => (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden max-w-[100px]">
          <div
            className="h-full bg-foreground/60 rounded-full transition-all"
            style={{
              width: p.deliverables > 0
                ? `${(p.completed / p.deliverables) * 100}%`
                : "0%",
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {p.completed}/{p.deliverables}
        </span>
      </div>
    ),
  },
  {
    key: "updated" as const,
    label: "Updated",
    className: "text-muted-foreground",
  },
];

export default function ProjectsPage() {
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
          <span>{projects.length} projects</span>
        </div>
      </div>

      <DataTable columns={columns} data={projects} />
    </div>
  );
}

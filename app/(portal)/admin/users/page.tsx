"use client";

import { DataTable } from "@/components/portal/data-table";
import { StatusBadge } from "@/components/portal/status-badge";
import { Shield, ShieldCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
  projects: number;
  lastActive: string;
  status: string;
}

const users: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@meridian.io", role: "CLIENT", mfaEnabled: true, projects: 3, lastActive: "2h ago", status: "ACTIVE" },
  { id: "2", name: "Marcus Webb", email: "marcus@flux.co", role: "CLIENT", mfaEnabled: false, projects: 2, lastActive: "1d ago", status: "ACTIVE" },
  { id: "3", name: "Elena Rodriguez", email: "elena@beacon.ai", role: "CLIENT", mfaEnabled: true, projects: 5, lastActive: "30m ago", status: "ACTIVE" },
  { id: "4", name: "James Liu", email: "james@prism.io", role: "CLIENT", mfaEnabled: true, projects: 1, lastActive: "3d ago", status: "ACTIVE" },
  { id: "5", name: "Admin User", email: "admin@kaidex.io", role: "ADMIN", mfaEnabled: true, projects: 0, lastActive: "Just now", status: "ACTIVE" },
  { id: "6", name: "Demo Account", email: "demo@kaidex.io", role: "CLIENT", mfaEnabled: false, projects: 0, lastActive: "30d ago", status: "ARCHIVED" },
];

const columns = [
  {
    key: "name" as const,
    label: "User",
    render: (u: User) => (
      <div>
        <p className="font-medium">{u.name}</p>
        <p className="text-xs text-muted-foreground font-mono">{u.email}</p>
      </div>
    ),
  },
  {
    key: "role" as const,
    label: "Role",
    render: (u: User) => (
      <span className={`text-xs font-mono uppercase tracking-wider ${u.role === "ADMIN" ? "text-amber-500" : "text-muted-foreground"}`}>
        {u.role}
      </span>
    ),
  },
  {
    key: "mfaEnabled" as const,
    label: "MFA",
    render: (u: User) => (
      u.mfaEnabled
        ? <ShieldCheck className="w-4 h-4 text-emerald-500" aria-label="MFA enabled" />
        : <Shield className="w-4 h-4 text-muted-foreground/40" aria-label="MFA disabled" />
    ),
  },
  {
    key: "projects" as const,
    label: "Projects",
    className: "font-mono text-center",
  },
  {
    key: "status" as const,
    label: "Status",
    render: (u: User) => <StatusBadge status={u.status} />,
  },
  {
    key: "lastActive" as const,
    label: "Last Active",
    className: "text-muted-foreground",
  },
];

export default function UsersPage() {
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const mfaCount = users.filter((u) => u.mfaEnabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client and admin accounts
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs text-muted-foreground font-mono">Active</p>
            <p className="text-lg font-display">{activeCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono">MFA Enabled</p>
            <p className="text-lg font-display">{mfaCount}/{users.length}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}

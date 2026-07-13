"use client";

import { DataTable } from "@/components/portal/data-table";
import { StatusBadge } from "@/components/portal/status-badge";
import { Shield, ShieldCheck } from "lucide-react";
import { useApi } from "@/hooks/use-api";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { projects: number };
}

interface UsersResponse {
  data: User[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const columns = [
  {
    key: "name" as const,
    label: "User",
    render: (u: User) => (
      <div>
        <p className="font-medium">{u.name || "—"}</p>
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
    key: "createdAt" as const,
    label: "Projects",
    className: "font-mono text-center",
    render: (u: User) => <span>{u._count?.projects ?? 0}</span>,
  },
  {
    key: "updatedAt" as const,
    label: "Last Active",
    className: "text-muted-foreground",
    render: (u: User) => <span>{timeAgo(u.updatedAt)}</span>,
  },
];

export default function UsersPage() {
  const { data, loading, error } = useApi<UsersResponse>("/users");

  const users = data?.data || [];
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
            <p className="text-xs text-muted-foreground font-mono">Total</p>
            <p className="text-lg font-display">{loading ? "—" : data?.meta?.total || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono">MFA Enabled</p>
            <p className="text-lg font-display">{loading ? "—" : `${mfaCount}/${users.length}`}</p>
          </div>
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
        <DataTable columns={columns} data={users} emptyMessage="No users found" />
      )}
    </div>
  );
}

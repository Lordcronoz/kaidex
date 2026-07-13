"use client";

import { useState } from "react";
import { DataTable } from "@/components/portal/data-table";
import { StatusBadge } from "@/components/portal/status-badge";
import { useApi } from "@/hooks/use-api";

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  target: string;
  targetId: string;
  metadata: any;
  ipAddress: string | null;
  timestamp: string;
  user?: { email: string; name: string | null };
}

interface AuditResponse {
  data: AuditEntry[];
  meta: { total: number };
}

const filters = ["All", "CREATE", "UPDATE", "DELETE"];

function formatTimestamp(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

const columns = [
  {
    key: "timestamp" as const,
    label: "Timestamp",
    className: "font-mono text-xs",
    render: (e: AuditEntry) => <span>{formatTimestamp(e.timestamp)}</span>,
  },
  {
    key: "userId" as const,
    label: "User",
    className: "font-mono text-xs",
    render: (e: AuditEntry) => <span>{e.user?.email || e.userId}</span>,
  },
  {
    key: "action" as const,
    label: "Action",
    render: (e: AuditEntry) => (
      <StatusBadge
        status={e.action}
        variant={
          e.action === "CREATE" ? "success" :
          e.action === "UPDATE" ? "warning" :
          "error"
        }
      />
    ),
  },
  { key: "target" as const, label: "Resource" },
  {
    key: "targetId" as const,
    label: "ID",
    className: "font-mono text-xs text-muted-foreground",
  },
  {
    key: "ipAddress" as const,
    label: "IP Address",
    className: "font-mono text-xs text-muted-foreground",
    render: (e: AuditEntry) => <span>{e.ipAddress || "—"}</span>,
  },
];

export default function AuditPage() {
  const [filter, setFilter] = useState("All");
  const { data, loading, error } = useApi<AuditResponse>("/audit-logs");

  // Filter client-side by action type
  const allEntries = data?.data || [];
  const filtered = filter === "All" ? allEntries : allEntries.filter((e) => e.action === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all system activity and data changes
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
              filter === f
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {filtered.length} entries
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-accent/30 rounded-md animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No audit entries found" />
      )}
    </div>
  );
}

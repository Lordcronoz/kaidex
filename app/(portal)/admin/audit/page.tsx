"use client";

import { useState } from "react";
import { DataTable } from "@/components/portal/data-table";
import { StatusBadge } from "@/components/portal/status-badge";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  targetId: string;
  ip: string;
}

const auditLog: AuditEntry[] = [
  { id: "1", timestamp: "2026-07-08 15:22:01", user: "sarah@meridian.io", action: "UPDATE", target: "Project", targetId: "prj_abc123", ip: "192.168.1.42" },
  { id: "2", timestamp: "2026-07-08 15:00:33", user: "admin@kaidex.io", action: "CREATE", target: "Invoice", targetId: "inv_def456", ip: "10.0.0.1" },
  { id: "3", timestamp: "2026-07-08 14:45:12", user: "marcus@flux.co", action: "DELETE", target: "Deliverable", targetId: "dlv_ghi789", ip: "172.16.0.55" },
  { id: "4", timestamp: "2026-07-08 13:30:00", user: "admin@kaidex.io", action: "UPDATE", target: "User", targetId: "usr_jkl012", ip: "10.0.0.1" },
  { id: "5", timestamp: "2026-07-08 12:15:45", user: "elena@beacon.ai", action: "CREATE", target: "Message", targetId: "msg_mno345", ip: "203.0.113.10" },
  { id: "6", timestamp: "2026-07-08 11:02:18", user: "admin@kaidex.io", action: "CREATE", target: "Project", targetId: "prj_pqr678", ip: "10.0.0.1" },
  { id: "7", timestamp: "2026-07-08 10:30:00", user: "james@prism.io", action: "UPDATE", target: "Project", targetId: "prj_stu901", ip: "198.51.100.22" },
  { id: "8", timestamp: "2026-07-07 23:55:12", user: "sarah@meridian.io", action: "CREATE", target: "Deliverable", targetId: "dlv_vwx234", ip: "192.168.1.42" },
];

const filters = ["All", "CREATE", "UPDATE", "DELETE"];

const columns = [
  {
    key: "timestamp" as const,
    label: "Timestamp",
    className: "font-mono text-xs",
  },
  {
    key: "user" as const,
    label: "User",
    className: "font-mono text-xs",
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
    key: "ip" as const,
    label: "IP Address",
    className: "font-mono text-xs text-muted-foreground",
  },
];

export default function AuditPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? auditLog : auditLog.filter((e) => e.action === filter);

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

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}

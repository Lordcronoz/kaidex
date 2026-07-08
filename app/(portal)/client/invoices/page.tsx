"use client";

import { StatusBadge } from "@/components/portal/status-badge";
import { DataTable } from "@/components/portal/data-table";

interface Invoice {
  id: string;
  number: string;
  amount: string;
  status: string;
  dueDate: string;
  project: string;
}

const invoices: Invoice[] = [
  { id: "1", number: "INV-2026-014", amount: "$2,400.00", status: "SENT", dueDate: "Jul 20, 2026", project: "AI Agent Fleet v2" },
  { id: "2", number: "INV-2026-013", amount: "$1,800.00", status: "SENT", dueDate: "Jul 15, 2026", project: "Data Pipeline Optimization" },
  { id: "3", number: "INV-2026-012", amount: "$3,600.00", status: "PAID", dueDate: "Jun 30, 2026", project: "Security Audit Q3" },
  { id: "4", number: "INV-2026-011", amount: "$1,200.00", status: "PAID", dueDate: "Jun 15, 2026", project: "AI Agent Fleet v2" },
  { id: "5", number: "INV-2026-010", amount: "$4,800.00", status: "PAID", dueDate: "May 31, 2026", project: "Infrastructure Migration" },
  { id: "6", number: "INV-2026-009", amount: "$900.00", status: "OVERDUE", dueDate: "May 15, 2026", project: "Data Pipeline Optimization" },
];

const columns = [
  { key: "number" as const, label: "Invoice", className: "font-mono" },
  { key: "project" as const, label: "Project" },
  {
    key: "amount" as const,
    label: "Amount",
    className: "font-mono text-right",
    render: (i: Invoice) => <span className="font-mono">{i.amount}</span>,
  },
  {
    key: "status" as const,
    label: "Status",
    render: (i: Invoice) => <StatusBadge status={i.status} />,
  },
  {
    key: "dueDate" as const,
    label: "Due Date",
    className: "text-muted-foreground",
  },
];

export default function InvoicesPage() {
  const totalDue = invoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and download your invoices
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-mono">Outstanding</p>
          <p className="text-xl font-display">${totalDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <DataTable columns={columns} data={invoices} />
    </div>
  );
}

"use client";

import { StatusBadge } from "@/components/portal/status-badge";
import { DataTable } from "@/components/portal/data-table";
import { useApi } from "@/hooks/use-api";

interface Invoice {
  id: string;
  number: string;
  amount: string | number;
  currency: string;
  status: string;
  dueDate: string | null;
  user?: { name: string; email: string };
}

interface InvoicesResponse {
  data: Invoice[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

function formatCurrency(amount: string | number, currency = "USD") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(num);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const columns = [
  { key: "number" as const, label: "Invoice", className: "font-mono" },
  {
    key: "amount" as const,
    label: "Amount",
    className: "font-mono text-right",
    render: (i: Invoice) => <span className="font-mono">{formatCurrency(i.amount, i.currency)}</span>,
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
    render: (i: Invoice) => <span>{formatDate(i.dueDate)}</span>,
  },
];

export default function InvoicesPage() {
  const { data, loading, error } = useApi<InvoicesResponse>("/invoices");

  const invoices = data?.data || [];

  const totalDue = invoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => {
      const amt = typeof i.amount === "string" ? parseFloat(i.amount) : i.amount;
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

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
          <p className="text-xl font-display">
            {loading ? "—" : formatCurrency(totalDue)}
          </p>
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
        <DataTable columns={columns} data={invoices} emptyMessage="No invoices found" />
      )}
    </div>
  );
}

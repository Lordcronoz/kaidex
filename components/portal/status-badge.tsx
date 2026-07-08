interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

const variantStyles: Record<string, string> = {
  default: "bg-accent text-foreground",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// Auto-detect variant from status string
function detectVariant(status: string): string {
  const s = status.toLowerCase();
  if (["completed", "paid", "active", "online", "ok"].includes(s)) return "success";
  if (["in_progress", "in progress", "review", "pending", "sent"].includes(s)) return "warning";
  if (["overdue", "failed", "error", "cancelled", "offline"].includes(s)) return "error";
  if (["draft", "archived"].includes(s)) return "info";
  return "default";
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant || detectVariant(status);
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider border rounded-sm ${
        variantStyles[resolvedVariant] || variantStyles.default
      }`}
    >
      {label}
    </span>
  );
}

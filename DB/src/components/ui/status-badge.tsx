import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium leading-none transition-colors whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral:
          "border-border bg-muted/60 text-muted-foreground [--dot:var(--muted-foreground)]",
        success:
          "border-transparent bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[color-mix(in_oklab,var(--success)_90%,var(--foreground))] [--dot:var(--success)]",
        warning:
          "border-transparent bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color-mix(in_oklab,var(--warning)_90%,var(--foreground))] [--dot:var(--warning)]",
        danger:
          "border-transparent bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[color-mix(in_oklab,var(--destructive)_92%,var(--foreground))] [--dot:var(--destructive)]",
        info:
          "border-transparent bg-[color-mix(in_oklab,var(--info)_18%,transparent)] text-[color-mix(in_oklab,var(--info)_92%,var(--foreground))] [--dot:var(--info)]",
        primary:
          "border-transparent bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-[color-mix(in_oklab,var(--primary)_95%,var(--foreground))] [--dot:var(--primary)]",
      },
      size: {
        sm: "h-5 px-1.5 text-[10px]",
        md: "h-6 px-2 text-[11px]",
      },
      dot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm", dot: true },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

export function StatusBadge({
  className,
  tone,
  size,
  dot,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone, size, dot }), className)} {...props}>
      {dot !== false && (
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: "var(--dot)" }}
        />
      )}
      {children}
    </span>
  );
}
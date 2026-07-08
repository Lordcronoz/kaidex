"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export function StatCard({ label, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="group p-6 bg-card border border-border rounded-md hover:border-foreground/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && (
          <div className="p-2 bg-accent rounded-md text-muted-foreground group-hover:text-foreground transition-colors">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-display tracking-tight">{value}</p>
      {change && (
        <p
          className={`text-xs mt-2 font-mono ${
            trend === "up"
              ? "text-emerald-500"
              : trend === "down"
              ? "text-red-400"
              : "text-muted-foreground"
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
        </p>
      )}
    </div>
  );
}

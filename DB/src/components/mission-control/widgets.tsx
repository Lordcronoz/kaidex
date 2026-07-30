import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Clock,
  Command,
  FileText,
  Filter,
  Radio,
  Search,
  UserPlus,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Tone = "green" | "yellow" | "red";

const toneDot: Record<Tone, string> = {
  green: "bg-[var(--success)]",
  yellow: "bg-[var(--warning)]",
  red: "bg-destructive",
};
const toneText: Record<Tone, string> = {
  green: "text-[var(--success)]",
  yellow: "text-[var(--warning)]",
  red: "text-destructive",
};
const toneRing: Record<Tone, string> = {
  green: "ring-[color-mix(in_oklab,var(--success)_35%,transparent)]",
  yellow: "ring-[color-mix(in_oklab,var(--warning)_35%,transparent)]",
  red: "ring-[color-mix(in_oklab,var(--destructive)_35%,transparent)]",
};

/* ------------------------------------------------------------------ */
/*  Panel — shared bare surface                                       */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  meta,
  action,
  children,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card/60",
        className,
      )}
    >
      <header className="flex h-9 items-center gap-2 border-b border-border px-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h2>
        {meta && (
          <span className="text-[11px] tabular-nums text-muted-foreground/80">
            {meta}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">{action}</div>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Company Health Score                                           */
/* ------------------------------------------------------------------ */

const departments: {
  name: string;
  score: number;
  tone: Tone;
  note: string;
}[] = [
  { name: "Sales", score: 92, tone: "green", note: "Pipeline healthy" },
  { name: "Operations", score: 74, tone: "yellow", note: "2 substitutes needed" },
  { name: "Teachers", score: 68, tone: "yellow", note: "3 on leave today" },
  { name: "Finance", score: 58, tone: "red", note: "1 payment failed · 4 overdue" },
  { name: "Support", score: 71, tone: "yellow", note: "4 tickets > 8h" },
  { name: "Infrastructure", score: 96, tone: "green", note: "All services nominal" },
];

export function CompanyHealth() {
  const overall = Math.round(
    departments.reduce((a, d) => a + d.score, 0) / departments.length,
  );
  const worst = departments.reduce((a, b) => (a.score < b.score ? a : b));
  const overallTone: Tone = overall >= 85 ? "green" : overall >= 70 ? "yellow" : "red";

  return (
    <Panel
      title="Company Health"
      meta="Live · updated 3s ago"
      action={
        <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-[11px]">
          Drill in <ChevronRight className="size-3" />
        </Button>
      }
    >
      <div className="grid grid-cols-[220px_1fr] gap-0 divide-x divide-border">
        {/* Score dial */}
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="relative grid place-items-center">
            <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="color-mix(in oklab, var(--foreground) 8%, transparent)"
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={
                  overallTone === "green"
                    ? "var(--success)"
                    : overallTone === "yellow"
                      ? "var(--warning)"
                      : "var(--destructive)"
                }
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(overall / 100) * 326.7} 326.7`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div
                  className={cn(
                    "text-3xl font-semibold tabular-nums leading-none",
                    toneText[overallTone],
                  )}
                >
                  {overall}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {overallTone === "green"
                    ? "Nominal"
                    : overallTone === "yellow"
                      ? "Watch"
                      : "Action"}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-[11px] text-muted-foreground">
            Weakest link ·{" "}
            <span className={cn("font-medium", toneText[worst.tone])}>
              {worst.name}
            </span>
          </div>
        </div>

        {/* Departments */}
        <div className="grid grid-cols-2 divide-x divide-y divide-border">
          {departments.map((d) => (
            <button
              key={d.name}
              className="group relative flex items-center gap-3 px-4 py-3 text-left transition hover:bg-accent/40"
            >
              <div
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-md text-[11px] font-semibold tabular-nums ring-1 ring-inset",
                  toneRing[d.tone],
                  d.tone === "green" &&
                    "bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]",
                  d.tone === "yellow" &&
                    "bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] text-[var(--warning)]",
                  d.tone === "red" &&
                    "bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-destructive",
                )}
              >
                {d.score}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span className={cn("size-1.5 rounded-full", toneDot[d.tone])} />
                  {d.name}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {d.note}
                </div>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/60 opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Live Event Feed                                                */
/* ------------------------------------------------------------------ */

const events: {
  t: string;
  tone: Tone | "info";
  who: string;
  what: string;
  tag: string;
}[] = [
  { t: "09:42:11", tone: "yellow", who: "Ms. Adeyemi", what: "marked leave for today", tag: "Teachers" },
  { t: "09:42:14", tone: "green", who: "AI", what: "assigned substitute · Mr. Okafor", tag: "AI" },
  { t: "09:41:03", tone: "red", who: "Stripe", what: "payment failed · INV-3412 · $2,140", tag: "Finance" },
  { t: "09:39:47", tone: "yellow", who: "Parent · L. Chen", what: "escalated ticket #8821 (waiting 9h)", tag: "Support" },
  { t: "09:38:22", tone: "info", who: "System", what: "server latency +38ms · eu-west", tag: "Infra" },
  { t: "09:36:10", tone: "green", who: "AI", what: "generated contract · Northfield Y3 renewal", tag: "Sales" },
  { t: "09:35:02", tone: "yellow", who: "AI", what: "flagged churn risk · 4 students · Grade 10", tag: "CRM" },
  { t: "09:33:58", tone: "green", who: "Ops", what: "roll call complete · 92 of 96 classes", tag: "Ops" },
  { t: "09:31:11", tone: "info", who: "System", what: "SIS nightly sync completed · 12,412 rows", tag: "Infra" },
];

const toneBar: Record<Tone | "info", string> = {
  green: "bg-[var(--success)]",
  yellow: "bg-[var(--warning)]",
  red: "bg-destructive",
  info: "bg-[var(--info)]",
};

export function LiveEventFeed() {
  return (
    <Panel
      title="Live Event Feed"
      meta={
        <span className="inline-flex items-center gap-1.5">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--success)] opacity-60" />
            <span className="relative size-1.5 rounded-full bg-[var(--success)]" />
          </span>
          streaming
        </span>
      }
      action={
        <Button variant="ghost" size="icon" className="size-6" aria-label="Filter">
          <Filter className="size-3.5" />
        </Button>
      }
      className="min-h-[420px]"
    >
      <ol className="divide-y divide-border">
        {events.map((e, i) => (
          <li
            key={i}
            className="group flex items-start gap-3 px-3 py-2 text-sm hover:bg-accent/30"
          >
            <span
              className={cn("mt-1.5 h-3 w-0.5 shrink-0 rounded-full", toneBar[e.tone])}
            />
            <span className="w-16 shrink-0 pt-0.5 font-mono text-[10.5px] tabular-nums text-muted-foreground">
              {e.t}
            </span>
            <span className="min-w-0 flex-1 leading-snug">
              <span className="font-medium">{e.who}</span>{" "}
              <span className="text-muted-foreground">{e.what}</span>
            </span>
            <span className="mt-0.5 shrink-0 rounded border border-border px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {e.tag}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  3. AI Command Center                                              */
/* ------------------------------------------------------------------ */

const briefing: {
  tone: Tone;
  text: string;
  action: string;
}[] = [
  { tone: "red", text: "2 teachers require substitutes for periods 3 & 5", action: "Auto-assign" },
  { tone: "red", text: "1 payment needs manual review · INV-3412", action: "Review" },
  { tone: "yellow", text: "4 parents have waited more than 8 hours in Support", action: "Route to on-call" },
  { tone: "yellow", text: "Grade 10 churn risk: 4 students flagged this morning", action: "Open cohort" },
  { tone: "green", text: "Everything else is healthy across 96 classes and 8 services", action: "View report" },
];

export function AICommandCenter() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Panel
      title="AI Command Center"
      meta={
        <span className="inline-flex items-center gap-1">
          <Bot className="size-3" /> analyzed 12,481 events since 06:00
        </span>
      }
    >
      <div className="p-4">
        <div className="mb-3">
          <div className="text-lg font-semibold tracking-tight">
            {greeting}, Aaron.
          </div>
          <div className="text-[12px] text-muted-foreground">
            AI has already triaged today's operations. Here's what needs you.
          </div>
        </div>
        <ul className="space-y-1">
          {briefing.map((b, i) => (
            <li
              key={i}
              className="group flex items-center gap-3 rounded-md border border-transparent px-2 py-2 text-sm hover:border-border hover:bg-accent/30"
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  b.tone === "green"
                    ? "bg-[color-mix(in_oklab,var(--success)_18%,transparent)]"
                    : b.tone === "yellow"
                      ? "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)]"
                      : "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)]",
                )}
              >
                {b.tone === "green" ? (
                  <Check className={cn("size-3", toneText.green)} />
                ) : (
                  <span className={cn("size-1.5 rounded-full", toneDot[b.tone])} />
                )}
              </span>
              <span className="flex-1 leading-snug">{b.text}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 shrink-0 gap-1 px-2 text-[11px] text-muted-foreground group-hover:text-foreground"
              >
                {b.action}
                <ArrowRight className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Action Queue                                                   */
/* ------------------------------------------------------------------ */

type Priority = "Critical" | "High" | "Medium" | "Low";
const priorityStyle: Record<Priority, string> = {
  Critical: "text-destructive border-destructive/40 bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]",
  High: "text-[var(--warning)] border-[color-mix(in_oklab,var(--warning)_40%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]",
  Medium: "text-[var(--info)] border-[color-mix(in_oklab,var(--info)_35%,transparent)] bg-[color-mix(in_oklab,var(--info)_8%,transparent)]",
  Low: "text-muted-foreground border-border bg-accent/40",
};

const actions: {
  priority: Priority;
  problem: string;
  reason: string;
  suggestion: string;
}[] = [
  {
    priority: "Critical",
    problem: "Payment failed · INV-3412 · $2,140",
    reason: "Card declined 3x · retry window closing at 14:00",
    suggestion: "Send Stripe recovery link + WhatsApp reminder to parent",
  },
  {
    priority: "High",
    problem: "Substitute needed · Physics 11A · Period 3",
    reason: "Mr. Okafor already covering Period 2, cannot double-book",
    suggestion: "Assign Ms. Rahman (available, subject-matched)",
  },
  {
    priority: "High",
    problem: "Parent escalation · Ticket #8821",
    reason: "L. Chen waiting 9h 12m · SLA breach in 48m",
    suggestion: "Route to Support lead + auto-draft apology reply",
  },
  {
    priority: "Medium",
    problem: "Contract renewal · Northfield Academy Y3",
    reason: "Draft ready · awaiting your signature",
    suggestion: "Review clauses 4.2 and 7.1 (AI flagged)",
  },
  {
    priority: "Low",
    problem: "Bulk import · 12 new students",
    reason: "3 records missing guardian phone",
    suggestion: "Approve import, request missing fields via email",
  },
];

export function ActionQueue() {
  return (
    <Panel
      title="Action Queue"
      meta={`${actions.length} awaiting you`}
      action={
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]">
          Approve all safe
        </Button>
      }
      className="min-h-[420px]"
    >
      <ul className="divide-y divide-border">
        {actions.map((a, i) => (
          <li key={i} className="px-3 py-2.5">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className={cn(
                  "rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  priorityStyle[a.priority],
                )}
              >
                {a.priority}
              </span>
              <span className="truncate text-sm font-medium">{a.problem}</span>
            </div>
            <div className="mb-1 flex items-start gap-1.5 text-[11.5px] text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3 shrink-0" />
              <span>{a.reason}</span>
            </div>
            <div className="mb-2 flex items-start gap-1.5 text-[11.5px]">
              <Bot className="mt-0.5 size-3 shrink-0 text-primary" />
              <span className="text-foreground/85">{a.suggestion}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                className="h-6 gap-1 px-2 text-[11px]"
                variant="secondary"
              >
                <Check className="size-3" /> Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 gap-1 px-2 text-[11px] text-muted-foreground"
              >
                <X className="size-3" /> Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto h-6 px-2 text-[11px] text-muted-foreground"
              >
                Details
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Live Company Status                                            */
/* ------------------------------------------------------------------ */

const statuses: {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}[] = [
  { label: "Classes running", value: "92 / 96", detail: "4 on break", tone: "green" },
  { label: "Teachers online", value: "148", detail: "3 on leave", tone: "yellow" },
  { label: "Students online", value: "2,284", detail: "63 absent · 84 late", tone: "green" },
  { label: "Meetings healthy", value: "18 / 18", detail: "avg latency 94ms", tone: "green" },
  { label: "Notification queue", value: "412", detail: "flushed in ~40s", tone: "green" },
  { label: "Payment gateway", value: "Degraded", detail: "Stripe · 3 retries", tone: "yellow" },
  { label: "AI services", value: "Nominal", detail: "gateway p95 · 212ms", tone: "green" },
  { label: "Database", value: "Nominal", detail: "primary · 3 replicas", tone: "green" },
];

export function LiveStatus() {
  return (
    <Panel
      title="Live Company Status"
      meta="tick 1s"
      action={
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Radio className="size-3" /> uptime 99.98%
        </span>
      }
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4">
        {statuses.map((s) => (
          <div key={s.label} className="px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <span className={cn("size-1.5 rounded-full", toneDot[s.tone])} />
              {s.label}
            </div>
            <div
              className={cn(
                "mt-1 font-semibold tabular-nums leading-tight",
                s.value.length > 6 ? "text-sm" : "text-base",
                s.tone === "yellow" && toneText.yellow,
                s.tone === "red" && toneText.red,
              )}
            >
              {s.value}
            </div>
            <div className="text-[11px] text-muted-foreground">{s.detail}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Quick Actions                                                  */
/* ------------------------------------------------------------------ */

const quickActions = [
  { label: "Create Student", icon: UserPlus, keys: "S" },
  { label: "Assign Teacher", icon: Users, keys: "T" },
  { label: "Generate Contract", icon: FileText, keys: "C" },
  { label: "Open Mission Control", icon: Zap, keys: "M" },
  { label: "Find Substitute", icon: Bot, keys: "F" },
  { label: "Create Invoice", icon: Wallet, keys: "I" },
];

export function QuickActions() {
  return (
    <Panel title="Quick Actions" meta="G + key">
      <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-3">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className="group flex items-center gap-2.5 px-3 py-3 text-left transition hover:bg-accent/40"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-background text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary">
              <a.icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{a.label}</span>
              <span className="block text-[10.5px] text-muted-foreground">
                Shortcut · G {a.keys}
              </span>
            </span>
            <span className="kbd">{a.keys}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Search Everything                                              */
/* ------------------------------------------------------------------ */

const searchScopes = [
  "Students",
  "Teachers",
  "Invoices",
  "Meetings",
  "Contracts",
  "Tickets",
  "Payments",
  "Parents",
];

export function SearchEverything({ onOpen }: { onOpen?: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-2">
      <button
        onClick={onOpen}
        className="group flex w-full items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-left text-sm transition hover:border-primary/40"
      >
        <Search className="size-4 text-muted-foreground" />
        <span className="flex-1 text-muted-foreground">
          Search everything — students, teachers, invoices, meetings…
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <span className="kbd">
            <Command className="size-3" />
          </span>
          <span className="kbd">K</span>
        </span>
      </button>
      <div className="mt-2 flex flex-wrap items-center gap-1 px-1">
        {searchScopes.map((s) => (
          <button
            key={s}
            className="rounded border border-transparent px-1.5 py-0.5 text-[10.5px] text-muted-foreground transition hover:border-border hover:text-foreground"
          >
            {s}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <Clock className="size-3" /> Recent: INV-3412 · Ms. Adeyemi · #8821
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Department Navigation                                          */
/* ------------------------------------------------------------------ */

const workspaces = [
  { name: "Operations", count: "2 open", tone: "yellow" as Tone },
  { name: "Sales", count: "healthy", tone: "green" as Tone },
  { name: "Teachers", count: "3 on leave", tone: "yellow" as Tone },
  { name: "Students", count: "healthy", tone: "green" as Tone },
  { name: "Finance", count: "1 failed", tone: "red" as Tone },
  { name: "HR", count: "healthy", tone: "green" as Tone },
  { name: "Support", count: "4 waiting", tone: "yellow" as Tone },
  { name: "Analytics", count: "healthy", tone: "green" as Tone },
  { name: "AI", count: "12 runs/min", tone: "green" as Tone },
];

export function Workspaces() {
  return (
    <Panel title="Workspaces" meta="G then W">
      <div className="flex flex-wrap gap-1 p-2">
        {workspaces.map((w) => (
          <button
            key={w.name}
            className="group inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] transition hover:border-primary/40"
          >
            <span className={cn("size-1.5 rounded-full", toneDot[w.tone])} />
            <span className="font-medium">{w.name}</span>
            <span className="text-[10.5px] text-muted-foreground">{w.count}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}
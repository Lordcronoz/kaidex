import * as React from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  MoreHorizontal,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function TrendPill({
  value,
  positive = true,
}: {
  value: string;
  positive?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        positive
          ? "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]"
          : "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-destructive",
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {value}
    </span>
  );
}

function Sparkline({ tone = "primary" }: { tone?: "primary" | "success" | "warning" }) {
  const stroke =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
        ? "var(--warning)"
        : "var(--primary)";
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,28 L12,24 L24,26 L36,18 L48,20 L60,12 L72,15 L84,8 L96,11 L108,6 L120,10 L120,36 L0,36 Z"
        fill={`url(#grad-${tone})`}
      />
      <path
        d="M0,28 L12,24 L24,26 L36,18 L48,20 L60,12 L72,15 L84,8 L96,11 L108,6 L120,10"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatWidget({
  label,
  value,
  delta,
  positive = true,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning";
  hint?: string;
}) {
  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
        <div className="grid size-7 place-items-center rounded-md bg-accent text-muted-foreground">
          <Icon className="size-3.5" />
        </div>
        <CardDescription className="text-xs">{label}</CardDescription>
        <Button
          variant="ghost"
          size="icon"
          aria-label="More"
          className="ml-auto size-6 text-muted-foreground opacity-0 transition group-hover:opacity-100"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </div>
          <TrendPill value={delta} positive={positive} />
        </div>
        <Sparkline tone={tone} />
        {hint && (
          <div className="text-[11px] text-muted-foreground">{hint}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function SystemHealthWidget() {
  const services = [
    { name: "SIS sync", status: "Operational", tone: "success" as const, latency: "128ms" },
    { name: "AI Gateway", status: "Operational", tone: "success" as const, latency: "212ms" },
    { name: "Payments", status: "Degraded", tone: "warning" as const, latency: "480ms" },
    { name: "Notifications", status: "Operational", tone: "success" as const, latency: "94ms" },
  ];
  return (
    <Card>
      <CardHeader className="flex-row items-center space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium">System health</CardTitle>
          <CardDescription className="text-xs">
            Live status across integrations
          </CardDescription>
        </div>
        <Badge
          className="ml-auto gap-1 rounded-full border-0 bg-[color-mix(in_oklab,var(--success)_18%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--success)]"
        >
          <Activity className="size-3" /> 99.98% uptime
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  s.tone === "success" && "bg-[var(--success)]",
                  s.tone === "warning" && "bg-[var(--warning)]",
                )}
              />
              <span className="text-sm">{s.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
              <span>{s.latency}</span>
              <span
                className={cn(
                  "font-medium",
                  s.tone === "success" && "text-[var(--success)]",
                  s.tone === "warning" && "text-[var(--warning)]",
                )}
              >
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function UpcomingClassesWidget() {
  const classes = [
    { time: "09:00", title: "Advanced Physics", room: "Lab 3B", teacher: "MO" },
    { time: "10:30", title: "World Literature", room: "Room 214", teacher: "SR" },
    { time: "13:15", title: "Calculus II", room: "Room 108", teacher: "JT" },
    { time: "15:00", title: "AP Chemistry", room: "Lab 1A", teacher: "KL" },
  ];
  return (
    <Card>
      <CardHeader className="flex-row items-center space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium">Upcoming classes</CardTitle>
          <CardDescription className="text-xs">Today · 4 sessions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs">
          Full schedule
        </Button>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {classes.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/50"
          >
            <div className="w-12 text-xs font-medium tabular-nums text-muted-foreground">
              {c.time}
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{c.title}</div>
              <div className="truncate text-[11px] text-muted-foreground">{c.room}</div>
            </div>
            <Avatar className="size-6">
              <AvatarFallback className="bg-accent text-[10px]">{c.teacher}</AvatarFallback>
            </Avatar>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AIInsightsWidget() {
  const insights = [
    {
      title: "Attendance dip in Grade 11",
      body: "Attendance dropped 4.2% this week — mostly in afternoon sessions.",
      tag: "Anomaly",
    },
    {
      title: "Fee collection ahead of plan",
      body: "Q4 collection is 12% above forecast. Suggest closing reminders early.",
      tag: "Forecast",
    },
    {
      title: "3 courses at risk of low completion",
      body: "Recommend outreach to 24 students before Friday.",
      tag: "Action",
    },
  ];
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px 200px at 100% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%)",
        }}
      />
      <CardHeader className="relative flex-row items-center space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="grid size-7 place-items-center rounded-md text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">AI insights</CardTitle>
            <CardDescription className="text-xs">
              Curated by EduOS Copilot
            </CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs">
          Ask a question
        </Button>
      </CardHeader>
      <CardContent className="relative space-y-2">
        {insights.map((i) => (
          <div
            key={i.title}
            className="group rounded-lg border border-border/70 bg-background/40 p-3 transition hover:border-border hover:bg-accent/40"
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-4 rounded px-1 text-[10px] font-medium text-muted-foreground"
              >
                {i.tag}
              </Badge>
              <div className="text-sm font-medium">{i.title}</div>
            </div>
            <div className="text-[12px] leading-relaxed text-muted-foreground">
              {i.body}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TasksWidget() {
  const [tasks, setTasks] = React.useState([
    { id: 1, title: "Approve payroll for November", due: "Today", done: false, priority: "High" },
    { id: 2, title: "Review Fall 2026 admissions batch", due: "Tomorrow", done: false, priority: "Med" },
    { id: 3, title: "Publish parent newsletter draft", due: "Fri", done: false, priority: "Low" },
    { id: 4, title: "Sign vendor renewal — Canvas", due: "Nov 28", done: true, priority: "Med" },
  ]);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  return (
    <Card>
      <CardHeader className="flex-row items-center space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          <CardDescription className="text-xs">
            {tasks.filter((t) => !t.done).length} open · {tasks.length} total
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs">
          New task
        </Button>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-accent/50"
          >
            {t.done ? (
              <CheckCircle2 className="size-4 text-[var(--success)]" />
            ) : (
              <Circle className="size-4 text-muted-foreground group-hover:text-foreground" />
            )}
            <span
              className={cn(
                "flex-1 truncate text-sm",
                t.done && "text-muted-foreground line-through",
              )}
            >
              {t.title}
            </span>
            <Badge
              variant="outline"
              className="h-5 rounded px-1.5 text-[10px] font-medium text-muted-foreground"
            >
              {t.priority}
            </Badge>
            <span className="w-14 text-right text-[11px] tabular-nums text-muted-foreground">
              {t.due}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

export function NotificationsFeedWidget() {
  const events = [
    { who: "Sofia R.", what: "submitted Fall admission review", when: "just now", tone: "info" as const },
    { who: "System", what: "completed nightly SIS sync", when: "2h", tone: "success" as const },
    { who: "Ms. Adeyemi", what: "posted grades for Physics 201", when: "4h", tone: "info" as const },
    { who: "Finance", what: "flagged 2 overdue invoices", when: "6h", tone: "warning" as const },
    { who: "AI Copilot", what: "generated weekly parent digest", when: "1d", tone: "info" as const },
  ];
  return (
    <Card>
      <CardHeader className="flex-row items-center space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium">Activity</CardTitle>
          <CardDescription className="text-xs">Recent notifications</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                e.tone === "success" && "bg-[var(--success)]",
                e.tone === "warning" && "bg-[var(--warning)]",
                e.tone === "info" && "bg-[var(--info)]",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">
                <span className="font-medium">{e.who}</span>{" "}
                <span className="text-muted-foreground">{e.what}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                <Clock className="mr-1 inline size-3 align-[-2px]" />
                {e.when}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RevenueWidget() {
  return (
    <StatWidget
      label="Revenue · MTD"
      value="$284,910"
      delta="8.4%"
      positive
      icon={Wallet}
      tone="success"
      hint="Target $310k · 92% achieved"
    />
  );
}

export function ActiveTeachersWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
        <div className="grid size-7 place-items-center rounded-md bg-accent text-muted-foreground">
          <Users className="size-3.5" />
        </div>
        <CardDescription className="text-xs">Active teachers</CardDescription>
        <TrendPill value="2.1%" positive />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">148</div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Currently teaching</span>
            <span className="tabular-nums">92 / 148</span>
          </div>
          <Progress value={62} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ActiveStudentsWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
        <div className="grid size-7 place-items-center rounded-md bg-accent text-muted-foreground">
          <GraduationCap className="size-3.5" />
        </div>
        <CardDescription className="text-xs">Active students</CardDescription>
        <TrendPill value="0.6%" positive={false} />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">2,431</div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: "Present", value: "2,284", tone: "success" as const },
            { label: "Late", value: "84", tone: "warning" as const },
            { label: "Absent", value: "63", tone: "destructive" as const },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-md border border-border/70 bg-background/40 px-2 py-1.5"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  s.tone === "success" && "text-[var(--success)]",
                  s.tone === "warning" && "text-[var(--warning)]",
                  s.tone === "destructive" && "text-destructive",
                )}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EnrollmentWidget() {
  return (
    <StatWidget
      label="Enrollments · WTD"
      value="126"
      delta="14.2%"
      positive
      icon={BookOpen}
      tone="primary"
      hint="Fall 2026 intake"
    />
  );
}
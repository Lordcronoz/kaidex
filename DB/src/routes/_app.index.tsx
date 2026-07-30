import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/db";
import {
  CompanyHealth,
  LiveEventFeed,
  AICommandCenter,
  ActionQueue,
  LiveStatus,
  QuickActions,
  SearchEverything,
  Workspaces,
} from "@/components/mission-control/widgets";

// ── Server functions: fetch real data from PostgreSQL ───────────────

const getDashboardStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const [
      totalUsers,
      totalProjects,
      activeProjects,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalMessages,
      unreadMessages,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.project.count({
        where: { status: "IN_PROGRESS" },
      }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.invoice.count({ where: { status: "OVERDUE" } }),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { timestamp: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return {
      users: totalUsers,
      projects: { total: totalProjects, active: activeProjects },
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        overdue: overdueInvoices,
      },
      messages: { total: totalMessages, unread: unreadMessages },
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        target: log.target,
        targetId: log.targetId,
        userName: log.user.name ?? log.user.email,
        timestamp: log.timestamp.toISOString(),
        metadata: log.metadata,
      })),
    };
  },
);

// ── Route definition ─────────────────────────────────────────────────

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Mission Control · Kaidex DB" },
      {
        name: "description",
        content:
          "Kaidex Database Dashboard — real-time overview of users, projects, invoices, and system activity.",
      },
      { property: "og:title", content: "Mission Control · Kaidex DB" },
      {
        property: "og:description",
        content:
          "Company health, live events, and action queue — the database management dashboard for Kaidex.",
      },
    ],
  }),
  loader: async () => {
    const stats = await getDashboardStats();
    return { stats };
  },
  component: MissionControlPage,
});

function MissionControlPage() {
  const { stats } = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
      {/* Command header */}
      <header className="flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--success)] opacity-60" />
              <span className="relative size-1.5 rounded-full bg-[var(--success)]" />
            </span>
            Mission Control
            <span className="text-muted-foreground/60">/</span>
            <span className="tabular-nums">Kaidex Database</span>
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
            Everything you need to run today, in one screen.
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          {/* Live stats badges */}
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-primary">
            {stats.users} users
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-emerald-500">
            {stats.projects.active} active
          </span>
          {stats.invoices.overdue > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-destructive">
              {stats.invoices.overdue} overdue
            </span>
          )}
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono tabular-nums">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </header>

      <SearchEverything />
      <Workspaces />
      <CompanyHealth />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AICommandCenter />
        </div>
        <LiveStatus />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ActionQueue />
        <LiveEventFeed />
      </div>

      <QuickActions />

      {/* Recent Activity from DB */}
      {stats.recentActivity.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Recent Database Activity
          </h2>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-md border border-border/50 bg-background px-3 py-2 text-xs"
              >
                <span
                  className={`inline-flex rounded px-1.5 py-0.5 font-mono font-semibold uppercase ${
                    log.action === "CREATE"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : log.action === "DELETE"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {log.action}
                </span>
                <span className="text-muted-foreground">
                  {log.userName}
                </span>
                <span className="text-foreground">
                  {log.target} · {log.targetId.slice(0, 8)}
                </span>
                <span className="ml-auto font-mono text-muted-foreground/60">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
import * as React from "react";
import {
  Search,
  Bell,
  Sparkles,
  ChevronsUpDown,
  Check,
  Plus,
  LogOut,
  UserRound,
  Settings,
  LifeBuoy,
  Building2,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useShortcut } from "@/hooks/use-shortcut";
import { cn } from "@/lib/utils";

const ORGS = [
  { id: "1", name: "Northfield Academy", plan: "Enterprise", initials: "NA" },
  { id: "2", name: "Riverside University", plan: "Business", initials: "RU" },
  { id: "3", name: "St. Kilda School", plan: "Starter", initials: "SK" },
];

const NOTIFICATIONS = [
  {
    title: "Payroll approved",
    body: "November cycle · 128 employees",
    time: "2m",
    unread: true,
    tone: "success" as const,
  },
  {
    title: "3 admissions need review",
    body: "Fall 2026 · Grade 9 intake",
    time: "18m",
    unread: true,
    tone: "info" as const,
  },
  {
    title: "System health degraded",
    body: "SIS sync latency > 400ms",
    time: "1h",
    unread: false,
    tone: "warning" as const,
  },
];

export function TopNav() {
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [org, setOrg] = React.useState(ORGS[0]);

  // Keyboard-first shortcuts beyond ⌘K
  useShortcut("mod+k", () => setCmdOpen(true));
  useShortcut("mod+j", () => {
    // Ask AI shortcut — placeholder hook for future assistant panel.
  });
  useShortcut("/", () => setCmdOpen(true));

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/70 px-3 backdrop-blur-xl sm:px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Org switcher */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex h-8 items-center gap-2 rounded-md px-2 text-sm transition-colors",
              "hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Avatar className="size-5 rounded">
              <AvatarFallback className="rounded bg-primary/20 text-[10px] font-semibold text-primary">
                {org.initials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[10rem] truncate font-medium">{org.name}</span>
            <Badge variant="secondary" className="hidden h-4 rounded px-1 text-[10px] font-medium sm:inline-flex">
              {org.plan}
            </Badge>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-1">
          <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Organizations
          </div>
          {ORGS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOrg(o)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Avatar className="size-6 rounded-md">
                <AvatarFallback className="rounded-md bg-primary/15 text-[10px] font-semibold text-primary">
                  {o.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col text-left leading-tight">
                <span className="truncate">{o.name}</span>
                <span className="text-[10px] text-muted-foreground">{o.plan}</span>
              </div>
              {org.id === o.id && <Check className="size-4 text-primary" />}
            </button>
          ))}
          <Separator className="my-1" />
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <Plus className="size-4" /> Add organization
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <Building2 className="size-4" /> Manage organizations
          </button>
        </PopoverContent>
      </Popover>

      {/* Global search */}
      <div className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <button
          onClick={() => setCmdOpen(true)}
          className={cn(
            "group flex h-9 w-full items-center rounded-md border border-border bg-muted/40 pl-8 pr-2 text-left text-sm text-muted-foreground",
            "transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <span className="truncate">Search students, courses, invoices…</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </span>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          size="sm"
          className="h-8 gap-1.5 rounded-md text-xs font-medium shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
        >
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="kbd ml-1 hidden sm:inline-flex" style={{ background: "rgba(0,0,0,.25)", color: "inherit", borderColor: "rgba(255,255,255,.2)" }}>
            ⌘J
          </span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="hidden h-8 gap-1.5 rounded-md text-xs md:inline-flex"
          onClick={() => setCmdOpen(true)}
        >
          <Search className="size-3.5" />
          Command
          <span className="kbd">⌘K</span>
        </Button>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative size-8" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="text-sm font-medium">Notifications</div>
              <button className="text-[11px] text-muted-foreground hover:text-foreground">
                Mark all read
              </button>
            </div>
            <Separator />
            <ScrollArea className="max-h-80">
              <ul className="p-1">
                {NOTIFICATIONS.map((n, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent"
                  >
                    <span
                      className={cn(
                        "mt-1 size-2 shrink-0 rounded-full",
                        n.tone === "success" && "bg-[var(--success)]",
                        n.tone === "info" && "bg-[var(--info)]",
                        n.tone === "warning" && "bg-[var(--warning)]",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{n.title}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Separator />
            <div className="p-1">
              <button className="w-full rounded-md px-2 py-1.5 text-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                View all activity
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-md p-1 hover:bg-accent">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/20 text-[10px] font-semibold text-primary">
                  AC
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-2 px-2 py-2">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
                  AC
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Alex Chen</div>
                <div className="truncate text-xs text-muted-foreground">alex@northfield.edu</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <UserRound /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy /> Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}
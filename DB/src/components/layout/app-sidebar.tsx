import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Wallet,
  Building2,
  Sparkles,
  BarChart3,
  MessagesSquare,
  Settings,
  Star,
  Clock,
  Search,
  ChevronRight,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: { title: string; url: string }[];
};

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Inbox", url: "/inbox", icon: MessagesSquare, badge: "12" },
      { title: "Calendar", url: "/calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Academics",
    items: [
      {
        title: "Students",
        url: "/students",
        icon: GraduationCap,
        children: [
          { title: "Directory", url: "/students/directory" },
          { title: "Admissions", url: "/students/admissions" },
          { title: "Attendance", url: "/students/attendance" },
        ],
      },
      {
        title: "Teachers",
        url: "/teachers",
        icon: Users,
        children: [
          { title: "Directory", url: "/teachers/directory" },
          { title: "Assignments", url: "/teachers/assignments" },
        ],
      },
      {
        title: "Courses",
        url: "/courses",
        icon: BookOpen,
        children: [
          { title: "Catalog", url: "/courses/catalog" },
          { title: "Curriculum", url: "/courses/curriculum" },
          { title: "Assessments", url: "/courses/assessments" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Finance", url: "/finance", icon: Wallet },
      { title: "HR", url: "/hr", icon: Building2 },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "AI Studio", url: "/ai", icon: Sparkles, badge: "New" },
    ],
  },
];

const FAVORITES = [
  { title: "Grade 10 — Physics", url: "/courses/phy-10" },
  { title: "Fall Admissions", url: "/students/admissions" },
  { title: "Payroll · November", url: "/finance/payroll" },
];

const RECENT = [
  { title: "Attendance report", url: "/analytics/attendance" },
  { title: "Ms. Adeyemi profile", url: "/teachers/1" },
  { title: "Invoice #4821", url: "/finance/invoices/4821" },
];

function useIsActive(url: string) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(url + "/");
}

function NavItemRow({ item }: { item: NavItem }) {
  const active = useIsActive(item.url);
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const hasChildren = !!item.children?.length;
  const [open, setOpen] = React.useState(active);

  if (!hasChildren || collapsed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
          <Link to={item.url}>
            <item.icon className="size-4" />
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto h-5 rounded-md px-1.5 text-[10px] font-medium"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={active}>
            <item.icon className="size-4" />
            <span className="truncate">{item.title}</span>
            <ChevronRight
              className={cn(
                "ml-auto size-3.5 text-muted-foreground transition-transform duration-200",
                open && "rotate-90",
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <SidebarMenuSub>
            {item.children!.map((c) => (
              <SubRow key={c.url} title={c.title} url={c.url} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SubRow({ title, url }: { title: string; url: string }) {
  const active = useIsActive(url);
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={active}>
        <Link to={url}>{title}</Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-3">
        <div className="flex items-center gap-2 px-1.5 pt-1">
          <div
            className="grid size-8 shrink-0 place-items-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <GraduationCap className="size-4" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight">
                  EduOS
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  Northfield Academy
                </div>
              </div>
              <button
                className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                aria-label="Create"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="relative px-1.5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search modules…"
              className="h-8 rounded-md border-sidebar-border bg-sidebar-accent/40 pl-8 pr-10 text-xs placeholder:text-muted-foreground focus-visible:ring-1"
            />
            <span className="kbd absolute right-3 top-1/2 -translate-y-1/2">⌘K</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {!collapsed && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1.5">
                <Star className="size-3" /> Favorites
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {FAVORITES.map((f) => (
                    <SidebarMenuItem key={f.url}>
                      <SidebarMenuButton asChild size="sm">
                        <Link to={f.url}>
                          <span className="size-1.5 rounded-full bg-primary/70" />
                          <span className="truncate">{f.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1.5">
                <Clock className="size-3" /> Recent
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {RECENT.map((r) => (
                    <SidebarMenuItem key={r.url}>
                      <SidebarMenuButton asChild size="sm">
                        <Link to={r.url}>
                          <span className="truncate text-muted-foreground">
                            {r.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {NAV.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavItemRow key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11" tooltip="Alex Chen">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/20 text-[11px] font-medium text-primary">
                  AC
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-xs font-medium">Alex Chen</span>
                <span className="truncate text-[10px] text-muted-foreground">
                  Principal · Admin
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
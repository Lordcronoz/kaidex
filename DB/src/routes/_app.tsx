import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { getCurrentSession } from "@/lib/auth-middleware";
import { clearSessionCookie } from "@/lib/auth";

// Server function to get current session
const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = getCurrentSession();
  if (!session) return null;
  return {
    email: session.email,
    name: session.name,
    role: session.role,
  };
});

// Server function to log out
const logoutAction = createServerFn({ method: "POST" }).handler(async () => {
  const cookie = clearSessionCookie();
  return { setCookie: cookie };
});

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return { session };
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-dvh flex-col bg-background">
        <TopNav />
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
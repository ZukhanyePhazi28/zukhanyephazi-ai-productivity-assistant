import { Link, useRouterState } from "@tanstack/react-router";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/meeting-notes", icon: FileText },
  { title: "Task Planner", url: "/task-planner", icon: ListChecks },
  { title: "Research", url: "/research", icon: Search },
  { title: "AI Chatbot", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-semibold tracking-tight">
              AI Workplace
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Productivity Assistant
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>AI Disclaimer</span>}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

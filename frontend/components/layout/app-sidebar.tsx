"use client";

import { LayoutDashboard, FileText, Users, LogOut, ChevronUp, User2, BookOpen, DollarSign, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation structure with semantic grouping
const getNavigationByRole = (role: string) => {
  if (role === "admin") {
    return {
      primary: [
        { 
          title: "Dashboard", 
          url: "/dashboard/admin", 
          icon: LayoutDashboard,
          description: "Overview"
        },
      ],
      management: [
        { 
          title: "Applications", 
          url: "/dashboard/admin/applications", 
          icon: FileText,
          description: "Manage submissions"
        },
        { 
          title: "Users", 
          url: "/dashboard/admin/users", 
          icon: Users,
          description: "User accounts"
        },
      ],
      programs: [
        { 
          title: "Training", 
          url: "/dashboard/admin/training", 
          icon: BookOpen,
          description: "Educational courses"
        },
        { 
          title: "Funding", 
          url: "/dashboard/admin/funds", 
          icon: DollarSign,
          description: "Fund opportunities"
        },
        { 
          title: "Competitions", 
          url: "/dashboard/admin/competitions", 
          icon: Trophy,
          description: "Competition programs"
        },
        { 
          title: "Events", 
          url: "/dashboard/admin/events", 
          icon: Calendar,
          description: "Events & webinars"
        },
      ],
    };
  } else if (role === "staff") {
    return {
      primary: [
        { 
          title: "Dashboard", 
          url: "/dashboard/staff", 
          icon: LayoutDashboard,
          description: "Overview"
        },
      ],
      review: [
        { 
          title: "Applications", 
          url: "/dashboard/staff/applications", 
          icon: FileText,
          description: "Review submissions"
        },
        { 
          title: "Funding Applications", 
          url: "/dashboard/staff/funds", 
          icon: DollarSign,
          description: "Fund applications"
        },
      ],
      programs: [
        { 
          title: "Competitions", 
          url: "/dashboard/staff/competitions", 
          icon: Trophy,
          description: "Competition programs"
        },
        { 
          title: "Events", 
          url: "/dashboard/staff/events", 
          icon: Calendar,
          description: "Events & webinars"
        },
      ],
    };
  } else if (role === "applicant") {
    return {
      primary: [
        { 
          title: "Dashboard", 
          url: "/dashboard/applicant", 
          icon: LayoutDashboard,
          description: "Overview"
        },
      ],
      applications: [
        { 
          title: "My Applications", 
          url: "/dashboard/applicant/applications", 
          icon: FileText,
          description: "Your submissions"
        },
      ],
      opportunities: [
        { 
          title: "Training", 
          url: "/dashboard/applicant/training", 
          icon: BookOpen,
          description: "Learn & grow"
        },
        { 
          title: "Funding", 
          url: "/dashboard/applicant/funds", 
          icon: DollarSign,
          description: "Funding opportunities"
        },
        { 
          title: "Competitions", 
          url: "/dashboard/applicant/competitions", 
          icon: Trophy,
          description: "Compete & win"
        },
        { 
          title: "Events", 
          url: "/dashboard/applicant/events", 
          icon: Calendar,
          description: "Attend events"
        },
      ],
      account: [
        { 
          title: "Profile", 
          url: "/dashboard/applicant/profile", 
          icon: User2,
          description: "Your profile"
        },
      ],
    };
  } else {
    return {
      primary: [
        { 
          title: "Dashboard", 
          url: "/dashboard", 
          icon: LayoutDashboard,
          description: "Overview"
        },
      ],
    };
  }
};

// Helper function for exact URL matching to prevent Dashboard from always being active
const isExactMatch = (pathname: string, url: string): boolean => {
  // Exact match for dashboard pages
  if (url.endsWith('/page') || url.includes('[')) {
    return pathname === url;
  }
  // For main routes like /dashboard/admin, only match if it's exactly that or /
  if (url.match(/^\/dashboard\/\w+$/)) {
    return pathname === url;
  }
  // For other routes, check if pathname starts with the URL
  return pathname.startsWith(url) && pathname !== `/dashboard/${pathname.split('/')[2]}`;
};

// Component for rendering a navigation section with proper spacing and hierarchy
interface NavSectionProps {
  title: string;
  items: Array<{
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
  }>;
  pathname: string;
  isLast?: boolean;
}

function NavSection({ title, items, pathname, isLast }: NavSectionProps) {
  return (
    <>
      <SidebarGroup className="py-4">
        <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {items.map((item) => {
              const isActive = isExactMatch(pathname, item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`relative transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium shadow-sm dark:bg-blue-950 dark:text-blue-400"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1 truncate">{item.title}</span>
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l dark:bg-blue-400" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {!isLast && <SidebarSeparator className="my-2 mx-0 bg-slate-200 dark:bg-slate-700" />}
    </>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const navGroups = getNavigationByRole(user.role);
  const groupEntries = Object.entries(navGroups);
  const dashboardUrl = `/dashboard/${user.role}`;

  return (
    <Sidebar className="border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      {/* Header with Brand */}
      <SidebarHeader className="border-b border-slate-200 px-0 py-4 dark:border-slate-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="px-4">
              <Link href={dashboardUrl} className="flex items-center gap-3">
                <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none flex-1">
                  <span className="font-bold tracking-tight text-slate-900 dark:text-white">Startup Portal</span>
                  <span className="text-xs font-medium text-slate-500 capitalize dark:text-slate-400">
                    {user.role}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="flex-1 overflow-y-auto px-0">
        {groupEntries.map(([groupKey, items], index) => (
          <NavSection
            key={groupKey}
            title={groupKey.charAt(0).toUpperCase() + groupKey.slice(1).replace(/([A-Z])/g, ' $1')}
            items={items as any[]}
            pathname={pathname}
            isLast={index === groupEntries.length - 1}
          />
        ))}
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-slate-200 px-0 py-4 dark:border-slate-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="mx-2 px-3 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900 hover:bg-slate-100 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-white dark:hover:bg-slate-800"
                >
                  <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-sm">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</span>
                    <span className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${user.role}/profile`} className="cursor-pointer">
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

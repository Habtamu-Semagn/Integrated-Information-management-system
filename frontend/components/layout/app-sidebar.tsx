"use client";

import { LayoutDashboard, FileText, Users, LogOut, ChevronUp, User2, PlusCircle } from "lucide-react";
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Get user role from current route path
const getRoleFromPath = (pathname: string): string => {
  if (pathname.startsWith('/dashboard/admin')) {
    return 'admin';
  } else if (pathname.startsWith('/dashboard/staff')) {
    return 'staff';
  } else if (pathname.startsWith('/dashboard/applicant')) {
    return 'applicant';
  }
  return 'applicant';
};

const getNavigationByRole = (role: string) => {
  if (role === "admin") {
    return [
      { 
        title: "Dashboard", 
        url: "/dashboard/admin", 
        icon: LayoutDashboard, 
      },
      { 
        title: "Applications", 
        url: "/dashboard/admin/applications", 
        icon: FileText, 
      },
      { 
        title: "Users", 
        url: "/dashboard/admin/users", 
        icon: Users, 
      },
    ];
  } else if (role === "staff") {
    return [
      { 
        title: "Dashboard", 
        url: "/dashboard/staff", 
        icon: LayoutDashboard, 
      },
      { 
        title: "Applications", 
        url: "/dashboard/staff/applications", 
        icon: FileText, 
      },
    ];
  } else if (role === "applicant") {
    return [
      { 
        title: "Dashboard", 
        url: "/dashboard/applicant", 
        icon: LayoutDashboard, 
      },
      { 
        title: "My Applications", 
        url: "/dashboard/applicant/applications", 
        icon: FileText, 
      },
      { 
        title: "Profile", 
        url: "/dashboard/applicant/profile", 
        icon: User2, 
      },
    ];
  } else {
    return [
      { 
        title: "Dashboard", 
        url: "/dashboard", 
        icon: LayoutDashboard, 
      },
    ];
  }
};

// Roles and navigation are handled dynamically based on Auth state

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const navigation = getNavigationByRole(user.role);
  
  const dashboardUrl = `/dashboard/${user.role}`;

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboardUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Startup Portal</span>
                  <span className="text-xs capitalize">{user.role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${user.role}/profile`}>
                    <User2 className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

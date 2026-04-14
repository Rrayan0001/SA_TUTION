"use client";

import { usePathname } from "next/navigation";
import { 
  Orbit, 
  ClipboardCheck, 
  LayoutDashboard, 
  Settings2, 
  Users2 
} from "lucide-react";

import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mark-attendance", label: "Mark", icon: ClipboardCheck },
  { href: "/students", label: "Students", icon: Users2 },
  { href: "/admin", label: "Admin", icon: Settings2 }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="h-16 justify-center border-b border-slate-100 bg-white group-data-[collapsible=icon]:p-0">
         <div className="flex items-center gap-3 overflow-hidden px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex shrink-0 rounded-xl bg-slate-950 p-2 text-white shadow-sm group-data-[collapsible=icon]:p-1.5 items-center justify-center">
            <Orbit className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
          </div>
          <div className="transition-all duration-300 group-data-[collapsible=icon]:hidden">
            <p className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.4em] text-slate-500">Lumina</p>
            <p className="whitespace-nowrap text-sm font-bold tracking-tighter text-slate-950">Intelligence</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white py-4 group-data-[collapsible=icon]:px-0 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 group-data-[collapsible=icon]:sr-only">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={link.label} 
                      isActive={isActive}
                      className={
                        isActive 
                          ? "bg-slate-950 text-white shadow-soft hover:bg-slate-900 hover:text-white !h-12 group-data-[collapsible=icon]:!h-8" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 !h-12 group-data-[collapsible=icon]:!h-8"
                      }
                    >
                      <a href={link.href}>
                        <Icon className="!h-5 !w-5 group-data-[collapsible=icon]:!h-4 group-data-[collapsible=icon]:!w-4" />
                        <span className="font-medium text-sm ml-1">{link.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}

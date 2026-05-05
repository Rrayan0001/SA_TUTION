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
    <ShadcnSidebar collapsible="icon" className="border-r border-[#e0e0e0] bg-black text-white">
      <SidebarHeader className="h-16 justify-center border-b border-[#1a1a1a] bg-black group-data-[collapsible=icon]:p-0">
         <div className="flex items-center gap-3 overflow-hidden px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex shrink-0 items-center justify-center rounded-full bg-[#0066cc] p-2 text-white group-data-[collapsible=icon]:p-1.5">
            <Orbit className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
          </div>
          <div className="transition-all duration-300 group-data-[collapsible=icon]:hidden">
            <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.4em] text-white/60">RayanTution</p>
            <p className="whitespace-nowrap text-sm font-semibold tracking-tight text-white">Intelligence</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black py-4 group-data-[collapsible=icon]:px-0 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/45 group-data-[collapsible=icon]:sr-only">Application</SidebarGroupLabel>
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
                            ? "bg-[#0066cc] text-white hover:bg-[#0071e3] !h-12 group-data-[collapsible=icon]:!h-8" 
                            : "text-white/70 hover:bg-white/10 hover:text-white !h-12 group-data-[collapsible=icon]:!h-8"
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

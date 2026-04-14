import { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { MobileNav, MobileHeader } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f4f7fb] text-slate-900">
        <div className="pointer-events-none fixed inset-0 bg-hero-grid" />
        
        <AppSidebar />
        
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent w-full">
          <MobileHeader />
          <div className="px-4 py-3 hidden md:block">
            <SidebarTrigger className="h-8 w-8 text-slate-500 hover:text-slate-900" />
          </div>
          <div className="relative mx-auto w-full max-w-7xl px-4 pb-40 sm:px-6 lg:px-8 md:pb-8">
            {children}
          </div>
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

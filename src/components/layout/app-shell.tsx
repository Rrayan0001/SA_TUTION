import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav, MobileHeader } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-hero-grid" />
      
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="relative mx-auto w-full max-w-7xl px-4 py-4 pb-32 sm:px-6 lg:px-8 md:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

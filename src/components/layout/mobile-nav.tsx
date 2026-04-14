"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, LayoutDashboard, Orbit, Settings2, Users2 } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/mark-attendance", label: "Mark", icon: ClipboardCheck },
  { href: "/students", label: "Students", icon: Users2 },
  { href: "/admin", label: "Admin", icon: Settings2 }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-full px-5 py-2.5 transition-all duration-200",
              active
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-100 bg-white/80 px-4 backdrop-blur-lg md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-lg bg-slate-950 p-1.5 text-white shadow-sm">
          <Orbit className="h-4 w-4" />
        </div>
        <p className="text-sm font-bold tracking-tight text-slate-950 uppercase">Lumina</p>
      </div>
    </header>
  );
}

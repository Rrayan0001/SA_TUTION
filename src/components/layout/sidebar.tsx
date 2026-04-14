"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarCheck2, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardCheck, 
  LayoutDashboard, 
  Settings2, 
  Users2 
} from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mark-attendance", label: "Mark Attendance", icon: ClipboardCheck },
  { href: "/students", label: "Students", icon: Users2 },
  { href: "/admin", label: "Admin", icon: Settings2 }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "relative hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 rounded-xl bg-slate-900 p-2 text-white shadow-glow">
            <CalendarCheck2 className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Tuition Suite</p>
              <p className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900">Attendance Manager</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 font-medium transition-all duration-200",
                active
                  ? "bg-slate-900 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
              {!isCollapsed && (
                <span className="whitespace-nowrap transition-all duration-300">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}

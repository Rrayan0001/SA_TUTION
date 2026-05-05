import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "RayanTution | Educational Intelligence",
  description: "RayanTution — a premium intelligence dashboard for modern tuition management."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-soft"
          }}
        />
      </body>
    </html>
  );
}

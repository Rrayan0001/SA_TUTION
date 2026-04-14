import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "Tuition Attendance Manager",
  description: "Premium tuition attendance management dashboard built with Next.js and Prisma."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
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

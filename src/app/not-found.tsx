import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">Not Found</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">The page you requested does not exist.</h1>
        <p className="max-w-xl text-slate-500">
          Head back to the dashboard to continue managing attendance.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Return to dashboard</Link>
      </Button>
    </div>
  );
}

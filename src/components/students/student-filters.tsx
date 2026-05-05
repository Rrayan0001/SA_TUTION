import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type StudentFiltersProps = {
  classes: string[];
  query?: string;
  className?: string;
};

export function StudentFilters({ classes, query, className }: StudentFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <form className="grid gap-4 md:grid-cols-[1.5fr_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a7a]" />
            <Input name="q" defaultValue={query} placeholder="Search student by name" className="pl-11" />
          </div>
          <select
            name="class"
            defaultValue={className ?? ""}
            className="flex h-11 w-full rounded-pill border border-[#e0e0e0] bg-white px-4 py-2 text-[15px] text-[#1d1d1f] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/20"
          >
            <option value="">All classes</option>
            {classes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

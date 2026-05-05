import { Inbox } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        <div className="rounded-full border border-[#e0e0e0] bg-[#fafafc] p-4 text-[#7a7a7a]">
          <Inbox className="h-6 w-6" />
        </div>
        <CardTitle className="text-[#1d1d1f]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-center text-sm text-[#7a7a7a]">{description}</CardContent>
    </Card>
  );
}

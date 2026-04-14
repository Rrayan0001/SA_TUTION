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
        <div className="rounded-full bg-slate-100 p-4 text-slate-500">
          <Inbox className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-center text-sm text-slate-500">{description}</CardContent>
    </Card>
  );
}

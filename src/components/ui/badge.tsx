import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-[#e0e0e0] bg-[#f5f5f7] text-[#1d1d1f]",
        success: "border-[#c7e7cf] bg-[#edf7ef] text-[#1e7e34]",
        warning: "border-[#f0e1a2] bg-[#fff7db] text-[#8a6d00]",
        danger: "border-[#f2c1c1] bg-[#fff1f0] text-[#d0021b]",
        info: "border-[#d7e9fb] bg-[#f0f7ff] text-[#0066cc]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

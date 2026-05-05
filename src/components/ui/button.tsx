import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-pill text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#0066cc] text-white hover:bg-[#0071e3]",
        destructive:
          "bg-[#ff3b30] text-white hover:bg-[#ff2d55]",
        outline:
          "border border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]",
        secondary:
          "border border-[#e0e0e0] bg-[#fafafc] text-[#1d1d1f] hover:bg-white",
        ghost: "hover:bg-[#f5f5f7] hover:text-[#1d1d1f]",
        success: "bg-[#28a745] text-white hover:bg-[#1e7e34]",
        warning: "bg-[#ffcc00] text-[#111827] hover:bg-[#f5c400]",
        danger: "bg-[#ff3b30] text-white hover:bg-[#ff2d55]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

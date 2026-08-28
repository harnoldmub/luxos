import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-[3px] text-[0.78rem] font-medium uppercase tracking-label transition duration-300 ease-lux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or focus-visible:ring-offset-2 focus-visible:ring-offset-ivoire disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-or text-white shadow-soft hover:bg-encre",
        outline: "border border-encre/25 bg-transparent text-encre hover:border-or hover:text-or",
        dark: "bg-encre text-white hover:bg-or",
        ghost: "bg-transparent text-encre hover:text-or",
        light: "border border-white/30 bg-transparent text-white hover:border-or hover:text-or-clair"
      },
      size: {
        default: "h-12 px-6",
        lg: "h-[54px] px-8",
        sm: "h-10 px-4",
        icon: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/shadcn-utils";
import React from "react";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      white: "text-white",
      inverted: "text-primary-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }
  },
  defaultVariants: {
    variant: "p",
    color: "default",
    align: "left",
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, align, as, ...props }, ref) => {
    const Component = as || (variant === "p" || variant === "lead" || variant === "large" || variant === "small" || variant === "muted" ? "p" : "h1")

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant, color, align, className }))}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography";

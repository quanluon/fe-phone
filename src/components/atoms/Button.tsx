import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from "@/components/ui/Button"
import { cn } from "@/lib/shadcn-utils"
import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

const extendedButtonVariants = cva("", {
  variants: {
    shape: {
      default: "rounded-md",
      pill: "rounded-full",
      square: "rounded-none",
      circle: "rounded-full aspect-square p-0",
      xl: "rounded-[2rem]", // Super rounded for cards/large buttons
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col h-auto py-4 px-2 gap-1 text-xs",
    },
  },
  defaultVariants: {
    shape: "default",
    orientation: "horizontal",
  },
})

export interface ButtonProps
  extends ShadcnButtonProps,
    VariantProps<typeof extendedButtonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, shape, orientation, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(extendedButtonVariants({ shape, orientation }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

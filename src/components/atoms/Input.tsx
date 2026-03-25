import { Input as ShadcnInput } from "@/components/ui/Input"
import { cn } from "@/lib/shadcn-utils"
import React from "react"

export interface InputProps extends React.ComponentProps<"input"> {
  shape?: "default" | "pill" | "square"
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, shape = "default", ...props }, ref) => {
    const shapeClass = 
      shape === "pill" ? "rounded-full px-4" : 
      shape === "square" ? "rounded-none" : 
      "" // default is rounded-md from shadcn

    return (
      <ShadcnInput
        ref={ref}
        className={cn(shapeClass, className)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

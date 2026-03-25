import { Input as ShadcnInput } from "@/components/ui/Input"
import { cn } from "@/lib/shadcn-utils"
import React from "react"

export interface InputProps extends React.ComponentProps<"input"> {
  shape?: "default" | "pill" | "square"
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      shape = "default",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onLeftIconClick,
      onRightIconClick,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`

    const shapeClass =
      shape === "pill"
        ? "rounded-full px-4"
        : shape === "square"
          ? "rounded-none"
          : ""

    const hasLeftIcon = Boolean(leftIcon)
    const hasRightIcon = Boolean(rightIcon)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {hasLeftIcon && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                onLeftIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onLeftIconClick}
            >
              {leftIcon}
            </span>
          )}

          <ShadcnInput
            id={inputId}
            ref={ref}
            className={cn(
              shapeClass,
              hasLeftIcon && "pl-10",
              hasRightIcon && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />

          {hasRightIcon && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
                onRightIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

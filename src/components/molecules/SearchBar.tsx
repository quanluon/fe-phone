import { cn } from "@/lib/shadcn-utils"
import { Input } from "@/components/atoms/Input"
import { Search, SlidersHorizontal } from "lucide-react"
import React from "react"

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, placeholder = "Search Your needs", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          shape="pill"
          className="h-12 border-white/80 bg-white/85 pl-10 pr-12 shadow-soft backdrop-blur-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-700/50"
          {...props}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800"
          aria-label="Bộ lọc tìm kiếm"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"

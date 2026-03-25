"use client"

import { useCategories } from "@/hooks/useCategories"
import { cn } from "@/lib/shadcn-utils"
import { Category } from "@/types"
import { useRouter } from "next/navigation"
import React from "react"

export const CategoryTabs = () => {
  const { data: categories = [] } = useCategories()
  const router = useRouter()
  const [activeId, setActiveId] = React.useState<string>("all")

  const tabs = React.useMemo(() => {
    const dynamicTabs = categories.slice(0, 8)
    return [{ _id: "all", name: "Tất cả" } as Category, ...dynamicTabs]
  }, [categories])

  const handleClick = (categoryId: string) => {
    setActiveId(categoryId)
    if (categoryId === "all") {
      router.push("/products")
      return
    }
    router.push(`/products?category=${categoryId}`)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Danh mục nổi bật</h2>
      </div>

      <div className="-mx-1 flex w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {tabs.map((tab) => {
          const isActive = activeId === tab._id
          return (
            <button
              key={tab._id}
              onClick={() => handleClick(tab._id)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-white/70 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {tab.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

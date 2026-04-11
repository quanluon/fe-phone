"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar"
import { useAuthStore } from "@/stores/auth"
import { useWishlistStore } from "@/stores/wishlist"
import { Bell, Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export const HomeHeader = () => {
  const { user } = useAuthStore()
  const { items } = useWishlistStore()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }, [])

  const displayName = user?.firstName || user?.email?.split("@")[0] || ""

  return (
    <header className="surface-panel soft-grid rounded-[2rem] px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <Link href="/profile">
           <Avatar className="h-11 w-11 ring-2 ring-white/70">
             <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
             <AvatarFallback>U</AvatarFallback>
           </Avatar>
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{greeting}</p>
          <h1 className="truncate font-display text-xl font-semibold text-slate-900 sm:text-2xl">
            {displayName}
          </h1>
        </div>
      </div>

        <div className="flex items-center gap-2">
          <button
            className="relative rounded-full bg-white/80 p-2 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900"
            aria-label="Thông báo"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>
          <Link
            href="/wishlist"
            className="relative rounded-full bg-white/80 p-2 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900"
            aria-label="Sản phẩm yêu thích"
          >
            <Heart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {items.length > 9 ? "9+" : items.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="rounded-full bg-slate-900 p-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ưu đãi hôm nay</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Trả góp linh hoạt và giao nhanh 2h</p>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Danh mục nổi bật</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">iPhone, iPad, MacBook, Watch</p>
        </div>
        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Hỗ trợ</p>
          <p className="mt-1 text-sm font-semibold">Tư vấn chọn máy phù hợp ngay hôm nay</p>
        </div>
      </div>
    </header>
  )
}

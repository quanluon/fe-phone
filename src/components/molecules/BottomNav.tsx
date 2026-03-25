"use client"

import { cn } from "@/lib/shadcn-utils"
import { Home, Store, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const BottomNav = () => {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, href: "/", label: "Trang chủ" },
    { icon: Store, href: "/products", label: "Cửa hàng" },
    { icon: User, href: "/profile", label: "Tôi" },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-6">
      <nav className="surface-panel flex items-center gap-1 rounded-full p-1.5 sm:gap-2 sm:p-2">
        {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex min-w-[4.2rem] items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-all",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            )
        })}
      </nav>
    </div>
  )
}

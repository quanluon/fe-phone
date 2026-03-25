"use client"

import { cn } from "@/lib/shadcn-utils"
import { Home, ShoppingBag, Store, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const BottomNav = () => {
  const pathname = usePathname()
  const t = useTranslations("navigation.bottomNav")

  const navItems = [
    { icon: Home, href: "/", label: t("home") },
    { icon: Store, href: "/products", label: t("shop") },
    { icon: ShoppingBag, href: "/cart", label: t("cart") },
    { icon: User, href: "/profile", label: t("account") },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden drop-shadow-[0_28px_40px_rgba(2,6,23,0.45)]">
      <nav className="flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/95 px-2 py-1.5 shadow-[0_10px_24px_-16px_rgba(255,255,255,0.15)_inset]">
        {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 w-11 items-center justify-center rounded-full transition-all",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            )
        })}
      </nav>
    </div>
  )
}

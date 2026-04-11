import { Button } from "@/components/atoms/Button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-strong sm:px-8">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-20 top-0 h-44 w-44 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute -right-14 bottom-0 h-52 w-52 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid gap-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
            Weekly Spotlight
          </span>
          <h2 className="max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">
            iPhone 16 Pro và AirPods Pro 2 đang có ưu đãi đến 15%
          </h2>
          <p className="max-w-md text-sm leading-6 text-slate-200 sm:text-base">
            Combo AppleCare, trả góp linh hoạt và giao nhanh 2h tại nội thành.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm">
            <p className="text-slate-300">Mã ưu đãi</p>
            <p className="font-display text-xl font-semibold text-amber-200">NCMOBILE15</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-100">
            Miễn phí giao hàng cho đơn từ 5 triệu
          </div>
          <Link href="/products" className="mt-1">
            <Button
              shape="pill"
              className="h-10 bg-white px-5 text-slate-900 hover:bg-amber-100"
            >
              Mua ngay
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

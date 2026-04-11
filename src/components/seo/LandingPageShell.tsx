import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

type LandingFaq = {
  question: string;
  answer: string;
};

type LandingLink = {
  href: string;
  label: string;
};

type LandingPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  trustPoints: string[];
  relatedLinks: LandingLink[];
  faqs: LandingFaq[];
  products: Product[];
  emptyTitle: string;
  emptyDescription: string;
  viewAllHref?: string;
};

export function LandingPageShell({
  eyebrow,
  title,
  description,
  trustPoints,
  relatedLinks,
  faqs,
  products,
  emptyTitle,
  emptyDescription,
  viewAllHref,
}: LandingPageShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_-45px_rgba(15,23,42,0.35)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.5fr,1fr] lg:px-12 lg:py-12">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                {eyebrow}
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={viewAllHref || '/products'}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Xem sản phẩm phù hợp
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Xem toàn bộ danh mục
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Lý do nhiều người chọn mua</h2>
              <div className="grid gap-3">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-950">Danh sách nổi bật</h2>
                <p className="mt-2 text-sm text-slate-600">Trang đích này được tối ưu để người dùng tìm nhanh sản phẩm đúng nhu cầu và để Google dễ index hơn.</p>
              </div>
              {viewAllHref ? (
                <Link href={viewAllHref} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                  Xem tất cả
                </Link>
              ) : null}
            </div>

            {products.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <h3 className="text-lg font-semibold text-slate-900">{emptyTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{emptyDescription}</p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Quay lại danh mục tổng
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-slate-950">Lối đi nhanh</h2>
              <div className="mt-4 grid gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-slate-950">Câu hỏi thường gặp</h2>
              <div className="mt-4 space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <h3 className="text-sm font-semibold text-slate-900">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

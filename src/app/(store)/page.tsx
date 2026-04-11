import Link from 'next/link';
import React from 'react';
import { BottomNav } from '@/components/molecules/BottomNav';
import { CategoryTabs } from '@/components/organisms/CategoryTabs';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { NewArrivals } from '@/components/organisms/NewArrivals';
import { PromoBanner } from '@/components/organisms/PromoBanner';
import { getCategories, getNewProducts } from '@/lib/api/server-catalog';

export default async function HomePage() {
  const [newProducts, categories] = await Promise.all([getNewProducts(4), getCategories()]);
  const featuredCategories = categories.slice(0, 6);
  const featuredCollections = [
    { href: '/collections/iphone', label: 'iPhone cũ đẹp giá tốt' },
    { href: '/collections/ipad', label: 'iPad học tập và giải trí' },
    { href: '/collections/macbook', label: 'MacBook cho sinh viên và văn phòng' },
    { href: '/collections/apple-watch', label: 'Apple Watch cho sức khỏe và tập luyện' },
    { href: '/collections/airpods', label: 'AirPods chính hãng' },
    { href: '/collections/phu-kien', label: 'Phụ kiện Apple cần thiết' },
  ];

  return (
    <main className="min-h-screen pb-28 pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <HomeHeader />
        <PromoBanner />
        <CategoryTabs />
        <NewArrivals products={newProducts} />

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.3fr,0.7fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Apple chọn nhanh, dễ tin
              </span>
              <div className="space-y-3">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  iPhone, iPad, MacBook, Apple Watch, AirPods và phụ kiện Apple giá tốt
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Nguyen Cong Mobile là điểm đến để người dùng tìm iPhone, iPad, MacBook, Apple Watch và AirPods theo ngân sách.
                  Website được bố trí để bạn dễ tìm sản phẩm, dễ so sánh theo danh mục và dễ quay lại khi cần lên đời máy, mua phụ kiện
                  hoặc tìm hàng 99%.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Xem toàn bộ sản phẩm
                </Link>
                <Link
                  href="/collections/iphone"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Bắt đầu từ iPhone
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-slate-950 p-5 text-white">
              {[
                'Máy mới và máy 99% để chọn theo ngân sách.',
                'Tư vấn nhanh, dễ so sánh, dễ chốt cấu hình phù hợp.',
                'Tập trung hệ sinh thái Apple và phụ kiện cần thiết.',
                'Nội dung landing page giúp tìm kiếm và điều hướng rõ ràng hơn.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Máy 99%',
              description: 'Tập trung vào máy đẹp, hình thức tốt, để tối ưu chi phí nhưng vẫn có trải nghiệm ổn định.',
            },
            {
              title: 'Máy mới',
              description: 'Phù hợp cho người ưu tiên ngoại hình, pin và trải nghiệm đồng bộ mới nhất trong hệ sinh thái Apple.',
            },
            {
              title: 'Trả góp và thu cũ đổi mới',
              description: 'Tăng khả năng chốt đơn bằng thông tin dễ hiểu, giúp khách quay lại và ra quyết định nhanh hơn.',
            },
            {
              title: 'Bảo hành rõ ràng',
              description: 'Thông tin niềm tin nên xuất hiện sớm trên trang chủ để tăng CTR, giữ người dùng và hỗ trợ chuyển đổi.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-950">Danh mục nổi bật</h2>
                <p className="mt-2 text-sm text-slate-600">Mở rộng entry point để Google và người dùng có thêm cách vào website.</p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                Xem catalog
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Bộ sưu tập theo nhu cầu thật</h2>
            <p className="mt-2 text-sm text-slate-600">
              Đây là nhóm URL có thể chia sẻ lên Facebook, TikTok, Zalo hoặc dùng làm landing page cho organic và ads.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {featuredCollections.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  {collection.label}
                </Link>
              ))}
            </div>
          </article>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

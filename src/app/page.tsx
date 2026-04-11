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
    { href: '/collections/iphone', label: 'iPhone cu dep gia tot' },
    { href: '/collections/ipad', label: 'iPad hoc tap va giai tri' },
    { href: '/collections/macbook', label: 'MacBook cho sinh vien va van phong' },
    { href: '/collections/apple-watch', label: 'Apple Watch cho suc khoe va tap luyen' },
    { href: '/collections/airpods', label: 'AirPods chinh hang' },
    { href: '/collections/phu-kien', label: 'Phu kien Apple can thiet' },
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
                Apple chon nhanh, de tin
              </span>
              <div className="space-y-3">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  iPhone, iPad, MacBook, Apple Watch, AirPods va phu kien Apple gia tot
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Nguyen Cong Mobile la diem den de nguoi dung tim iPhone, iPad, MacBook, Apple Watch va AirPods theo ngan sach.
                  Website duoc bo tri de ban de tim san pham, de so sanh theo danh muc va de quay lai khi can len doi may, mua phu kien
                  hoac tim hang 99%.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Xem toan bo san pham
                </Link>
                <Link
                  href="/collections/iphone"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Bat dau tu iPhone
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-slate-950 p-5 text-white">
              {[
                'May moi va may 99% de chon theo ngan sach.',
                'Tu van nhanh, de so sanh, de chot cau hinh phu hop.',
                'Tap trung he sinh thai Apple va phu kien can thiet.',
                'Noi dung landing page giup tim kiem va dieu huong ro rang hon.',
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
              title: 'May 99%',
              description: 'Tap trung vao may dep, hinh thuc tot, de toi uu chi phi nhung van co trai nghiem on dinh.',
            },
            {
              title: 'May moi',
              description: 'Phu hop cho nguoi uu tien ngoai hinh, pin va trai nghiem dong bo moi nhat trong he sinh thai Apple.',
            },
            {
              title: 'Tra gop va thu cu doi moi',
              description: 'Tang kha nang chot don bang thong tin de hieu, giup khach quay lai va ra quyet dinh nhanh hon.',
            },
            {
              title: 'Bao hanh ro rang',
              description: 'Trust content can xuat hien som tren trang chu de tang CTR, giu nguoi dung va ho tro conversion.',
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
                <h2 className="font-display text-2xl font-semibold text-slate-950">Danh muc noi bat</h2>
                <p className="mt-2 text-sm text-slate-600">Mo rong entry point de Google va nguoi dung co them cach vao website.</p>
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
            <h2 className="font-display text-2xl font-semibold text-slate-950">Bo suu tap theo nhu cau that</h2>
            <p className="mt-2 text-sm text-slate-600">
              Day la nhom URL co the chia se len Facebook, TikTok, Zalo hoac dung lam landing page cho organic va ads.
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="max-w-4xl space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Vi sao trang chu can nhieu noi dung hon</h2>
            <p className="text-sm leading-7 text-slate-600">
              Trang chu khong chi de trang tri. Day la noi Google va nguoi dung can thay ro website ban dang ban gi, ai nen mua, muc gia ra sao
              va vi sao nen tin ban. Vi vay, phan noi dung nay duoc bo sung de tang kha nang index, tang CTR va giu nguoi dung o lai lau hon.
            </p>
            <p className="text-sm leading-7 text-slate-600">
              Ban co the tiep tuc mo rong bang cac bai huong dan mua, so sanh may, tip chon iPhone theo ngan sach, MacBook cho sinh vien va cac
              trang campaign theo tung mua ban hang.
            </p>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

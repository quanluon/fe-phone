"use client"

import { ProductCard } from "@/components/molecules/ProductCard"
import { useNewProducts } from "@/hooks/useProducts"
import Link from "next/link"
import React from "react"
import { useWishlistStore } from '@/stores/wishlist';
import { useCart } from '@/hooks/useCart';

export const NewArrivals = () => {
  const { data: products, isLoading } = useNewProducts(4)
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCart();

  if (isLoading) {
    return (
      <section className="space-y-4 pb-24">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Sản phẩm mới về</h2>
            <p className="text-sm text-slate-500">Đang cập nhật các mẫu đang được quan tâm.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-[1.75rem] bg-white/70" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4 pb-24">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">Sản phẩm mới về</h2>
          <p className="text-sm text-slate-500">Lựa chọn mới nhất được cập nhật hằng ngày.</p>
        </div>
        <Link
          href="/products?sort=createdAt&order=desc"
          className="text-sm font-semibold text-sky-800 transition hover:text-sky-700"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products?.data?.map((product) => (
          <div key={product._id} className="stagger-fade-in">
            <ProductCard 
            key={product._id} 
            product={product} 
            isInWishlist={isInWishlist(product._id)}
            onToggleWishlist={() => toggleWishlist(product)}
            onAddToCart={(p, v) => addToCart(p, v)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

import { ProductCard } from "@/components/molecules/ProductCard"
import Link from "next/link"
import React from "react"
import { Product } from "@/types";

export interface NewArrivalsProps {
  products: Product[];
}

export const NewArrivals = ({ products }: NewArrivalsProps) => {
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
        {products.map((product, index) => (
          <div key={product._id} className="stagger-fade-in">
            <ProductCard product={product} imagePriority={index === 0} />
          </div>
        ))}
      </div>
    </section>
  )
}

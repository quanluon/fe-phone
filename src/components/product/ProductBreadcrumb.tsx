'use client';

import { Product } from '@/types';
import Link from 'next/link';

interface ProductBreadcrumbProps {
  product: Product;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="rounded-full bg-white px-3 py-1.5 shadow-sm transition-colors hover:text-slate-900">
        Home
      </Link>
      <span>/</span>
      <Link href="/products" className="rounded-full bg-white px-3 py-1.5 shadow-sm transition-colors hover:text-slate-900">
        Products
      </Link>
      <span>/</span>
      <Link
        href={`/products?category=${product.category._id}`}
        className="rounded-full bg-white px-3 py-1.5 shadow-sm transition-colors hover:text-slate-900"
      >
        {product.category.name}
      </Link>
      <span>/</span>
      <span className="line-clamp-1 rounded-full bg-slate-900 px-3 py-1.5 text-white">{product.name}</span>
    </nav>
  );
}

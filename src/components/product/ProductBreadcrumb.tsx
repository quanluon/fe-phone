'use client';

import { Product } from '@/types';
import Link from 'next/link';

interface ProductBreadcrumbProps {
  product: Product;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>
      <span>/</span>
      <Link href="/products" className="hover:text-blue-600">
        Products
      </Link>
      <span>/</span>
      <Link
        href={`/products?category=${product.category._id}`}
        className="hover:text-blue-600"
      >
        {product.category.name}
      </Link>
      <span>/</span>
      <span className="text-gray-900">{product.name}</span>
    </nav>
  );
}


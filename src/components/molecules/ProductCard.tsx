"use client"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { formatCurrency, getImageUrl } from "@/lib/utils"
import { Product, ProductVariant } from "@/types"
import { Heart, Plus, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, variant: ProductVariant) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductCardProps) => {
  const [selectedVariant] = useState<ProductVariant>(product.variants[0])
  const discountPercent =
    selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100
        )
      : null

  return (
    <Card className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
          <Link href={`/products/${product._id}-${product.slug}`}>
            <Image
              src={getImageUrl(selectedVariant.images[0] || product.images[0])}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="absolute right-3 top-3">
             <Badge variant="secondary" className="gap-1 rounded-full bg-white/95 px-2 py-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>4.7</span>
             </Badge>
          </div>

          <Button
            shape="circle"
            variant="ghost" 
            className="absolute left-3 top-3 h-8 w-8 bg-white/95 backdrop-blur-md hover:bg-white"
            onClick={(e) => {
                e.preventDefault()
                onToggleWishlist?.(product)
            }}
          >
            <Heart
              className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-900"}
              size={16}
            />
          </Button>

          {discountPercent && (
            <div className="absolute bottom-3 left-3 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white">
              -{discountPercent}%
            </div>
          )}
          
           <Button
            shape="circle"
            className="absolute bottom-3 right-3 h-10 w-10 bg-slate-900 text-white shadow-sm transition-opacity group-hover:bg-slate-800"
            onClick={(e) => {
                e.preventDefault()
                onAddToCart?.(product, selectedVariant)
            }}
          >
            <Plus size={20} />
          </Button>
        </div>

        <div className="space-y-2 px-3 pb-4 pt-3">
           <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
             {product.brand.name}
           </p>
           <Link href={`/products/${product._id}-${product.slug}`}>
             <h3 className="line-clamp-2 min-h-[2.6rem] text-base font-semibold leading-snug text-slate-900 transition group-hover:text-sky-800">
               {product.name}
             </h3>
           </Link>
           {product.shortDescription && (
             <p className="line-clamp-2 text-sm text-slate-500">
               {product.shortDescription}
             </p>
           )}
           
           <div className="mt-2 rounded-2xl bg-slate-50 px-3 py-2">
             <div className="flex flex-col items-start gap-1 wrap">
                <span className="font-display text-lg font-semibold leading-none text-slate-900">
                  {formatCurrency(selectedVariant.price)}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="text-xs leading-none text-slate-400 line-through">
                    {formatCurrency(selectedVariant.originalPrice)}
                  </span>
                )}
             </div>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { trackSelectItem } from "@/lib/firebase/analytics"
import { CONTACT_INFO } from "@/lib/constants"
import { useCart } from "@/hooks/useCart"
import {
  formatCurrency,
  getImageUrl,
  getPrimaryVariant,
  getProductCardImage,
  shouldHideProductPrice,
} from "@/lib/utils"
import { Product, ProductVariant } from "@/types"
import { Heart, Plus, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { useRouter } from "next/navigation"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, variant: ProductVariant) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  imagePriority?: boolean
  analyticsListName?: string
  analyticsListId?: string
  analyticsIndex?: number
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  imagePriority = false,
  analyticsListName,
  analyticsListId,
  analyticsIndex,
}: ProductCardProps) => {
  const router = useRouter()
  const selectedVariant = getPrimaryVariant(product) || product.variants[0]
  const productHref = `/products/${product._id}-${product.slug}`
  const isContactOnly = shouldHideProductPrice(product, selectedVariant)
  const { addItem: addToCart } = useCart()
  const discountPercent =
    selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(
        ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100
      )
      : null

  const handlePrefetchProduct = () => {
    router.prefetch(productHref)
  }

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isContactOnly) {
      window.location.href = `tel:${CONTACT_INFO.phoneLink}`
      return
    }

    if (onAddToCart) {
      onAddToCart(product, selectedVariant)
      return
    }

    addToCart(product, selectedVariant)
  }

  return (
    <Card className="group relative flex h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
          <Link
            href={productHref}
            prefetch
            onMouseEnter={handlePrefetchProduct}
            onFocus={handlePrefetchProduct}
            onTouchStart={handlePrefetchProduct}
            onClick={() => {
              void trackSelectItem({
                product,
                variant: selectedVariant,
                currency: "VND",
                listName: analyticsListName,
                listId: analyticsListId,
                index: analyticsIndex,
              })
            }}
          >
            <Image
              src={getImageUrl(getProductCardImage(product, selectedVariant))}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={imagePriority}
            />
          </Link>

          <div className="flex gap-2 absolute right-3" style={{ bottom: '0.1rem' }}>
            <Button
              shape="circle"
              className="h-11 w-11 bg-slate-900 text-white shadow-sm transition-opacity group-hover:bg-slate-800"
              onClick={handleAddToCart}
            >
              <Plus size={20} />
            </Button>
          </div>

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
        </div>

        <div className="flex flex-1 flex-col space-y-2 px-3 pb-4 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {product.brand.name}
          </p>
          <Link
            href={productHref}
            prefetch
            onMouseEnter={handlePrefetchProduct}
            onFocus={handlePrefetchProduct}
            onTouchStart={handlePrefetchProduct}
            onClick={() => {
              void trackSelectItem({
                product,
                variant: selectedVariant,
                currency: "VND",
                listName: analyticsListName,
                listId: analyticsListId,
                index: analyticsIndex,
              })
            }}
          >
            <h3 className="line-clamp-2 min-h-[2.6rem] text-base font-semibold leading-snug text-slate-900 transition group-hover:text-sky-800">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="line-clamp-2 text-sm text-slate-500">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-auto space-y-3 pt-2">
            <div className="rounded-2xl bg-slate-50 px-3 py-2">
              <div className="flex flex-col items-start gap-1 wrap">
                <span className="font-display text-lg font-semibold leading-none text-slate-900">
                  {isContactOnly ? "Liên hệ" : formatCurrency(selectedVariant.price)}
                </span>
                {!isContactOnly && selectedVariant.originalPrice && (
                  <span className="text-xs leading-none text-slate-400 line-through">
                    {formatCurrency(selectedVariant.originalPrice)}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

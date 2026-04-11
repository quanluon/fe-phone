"use client";

import { ProductActions } from "@/components/product/ProductActions";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductContactSupport } from "@/components/product/ProductContactSupport";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductQuantitySelector } from "@/components/product/ProductQuantitySelector";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductWarrantyCollapse } from "@/components/product/ProductWarrantyCollapse";
import { Button } from "@/components/ui/Button";
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";
import { useCart } from "@/hooks/useCart";
import {
  trackBeginCheckout,
  trackShare,
  trackViewItem,
} from "@/lib/firebase/analytics";
import { useProduct } from "@/hooks/useProducts";
import {
  calculateDiscount,
  getImageUrl,
  getPrimaryVariant,
  getProductDisplayImages,
} from "@/lib/utils";
import { logger } from "@/lib/utils/logger";
import { useWishlistStore } from "@/stores/wishlist";
import { Product, ProductAttributeType, ProductVariant } from "@/types";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GuaranteeSection } from "./GuaranteeSection";

interface ProductDetailClientProps {
  initialProduct: Product | null;
}

function getInitialVariant(product: Product | null): ProductVariant | null {
  return getPrimaryVariant(product);
}

export function ProductDetail({ initialProduct }: ProductDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("product.detail");
  const tProduct = useTranslations("product");

  // Get product identifier from URL params
  const identifier = params.slug as string;

  // Extract _id from the identifier (format: _id-slug)
  const productId = identifier.split("-")[0];

  // Fetch product data using only the _id, but use initialProduct as fallback
  const { data: product, isLoading: productLoading } = useProduct(
    productId,
    initialProduct || undefined,
  );

  // Use server-side fetched data initially, then client-side data when available
  const productData = (product as Product) || initialProduct;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => getInitialVariant(initialProduct),
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [trackedViewItemKey, setTrackedViewItemKey] = useState<string | null>(
    null,
  );

  const { addItem: addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();

  // Set initial variant when product loads
  useEffect(() => {
    if (
      productData &&
      productData.variants &&
      productData.variants.length > 0 &&
      (!selectedVariant ||
        !productData.variants.some(
          (variant) => variant._id === selectedVariant._id,
        ))
    ) {
      setSelectedVariant(getInitialVariant(productData));
    }
  }, [productData, selectedVariant]);

  useEffect(() => {
    if (!productData || !selectedVariant) {
      return;
    }

    const trackingKey = `${productData._id}:${selectedVariant._id}`;
    if (trackedViewItemKey === trackingKey) {
      return;
    }

    setTrackedViewItemKey(trackingKey);
    void trackViewItem({
      product: productData,
      variant: selectedVariant,
      quantity: 1,
      currency: "VND",
    });
  }, [productData, selectedVariant, trackedViewItemKey]);

  const isInWishlistState = productData ? isInWishlist(productData._id) : false;
  const discount = selectedVariant?.originalPrice
    ? calculateDiscount(selectedVariant.price, selectedVariant.originalPrice)
    : 0;

  // Calculate available stock considering cart quantity
  const cartQuantity = selectedVariant
    ? getItemQuantity(productData._id, selectedVariant._id)
    : 0;
  const availableStock = selectedVariant
    ? selectedVariant.stock - cartQuantity
    : 0;

  const handleAddToCart = async () => {
    if (!productData || !selectedVariant) return;

    setIsAddingToCart(true);
    try {
      const result = addToCart(productData, selectedVariant, quantity);

      // If validation failed, the error toast is already shown by the store
      if (!result.isValid) {
        logger.warn(
          {
            productId: productData._id,
            variantId: selectedVariant._id,
            error: result.error,
          },
          "Cart validation failed",
        );
      }
    } catch (error) {
      logger.error(
        { error, productId: productData._id, variantId: selectedVariant?._id },
        "Error adding to cart",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!productData || !selectedVariant) return;

    setIsBuyingNow(true);
    try {
      const result = addToCart(productData, selectedVariant, quantity);

      // If validation succeeded, redirect to orders page
      if (result.isValid) {
        void trackBeginCheckout({
          product: productData,
          variant: selectedVariant,
          quantity,
          currency: "VND",
        });
        router.push("/orders/create");
      } else {
        logger.warn(
          {
            productId: productData._id,
            variantId: selectedVariant._id,
            error: result.error,
          },
          "Cart validation failed",
        );
      }
    } catch (error) {
      logger.error(
        { error, productId: productData._id, variantId: selectedVariant?._id },
        "Error buying now",
      );
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!productData) return;
    toggleWishlist(productData);
  };

  const handleShare = () => {
    if (!productData) return;

    if (navigator.share) {
      void trackShare({
        product: productData,
        variant: selectedVariant,
        method: "navigator_share",
        contentType: "product",
        pagePath: window.location.pathname,
        currency: "VND",
      });
      navigator.share({
        title: productData.name,
        text: productData.description,
        url: window.location.href,
      });
    } else {
      void trackShare({
        product: productData,
        variant: selectedVariant,
        method: "clipboard",
        contentType: "product",
        pagePath: window.location.pathname,
        currency: "VND",
      });
      navigator.clipboard.writeText(window.location.href);
      // Toast notification will be shown by the toast system
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsPreviewModalOpen(true);
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
    setTrackedViewItemKey(null);
  };

  const hasGuarantee = useMemo(() => {
    return productData?.attributes?.some(
      (attribute) => attribute.type === ProductAttributeType.GUARANTEE,
    );
  }, [productData]);

  // Loading state - only show if we don't have initial data
  if (productLoading && !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - only show if we have no data at all
  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {t("productNotFound")}
            </h1>
            <p className="text-gray-600 mb-8">
              {t("productNotFoundDescription")}
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.back()}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {t("goBack")}
              </Button>
              <Link href="/products">
                <Button variant="outline">{t("browseProducts")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have a selected variant
  if (!selectedVariant) {
    return null;
  }

  const allImages = getProductDisplayImages(productData, selectedVariant);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb product={productData} />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:text-slate-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-stretch lg:gap-12">
          {/* Component 1: Media & Commitments (Left Column) */}
          <div className="flex flex-col">
            <ProductImageGallery
              images={allImages}
              productName={productData.name}
              selectedIndex={selectedImageIndex}
              onIndexChange={setSelectedImageIndex}
              onImageClick={handleImageClick}
              priority
            />
            {/* Guarantee Section */}
            {hasGuarantee ? (
              <div className="py-5 lg:max-h-[18rem]">
                <GuaranteeSection product={productData} />
              </div>
            ) : (
              <ProductWarrantyCollapse product={productData} />
            )}
          </div>

          {/* Component 2: Selection & Actions (Right Column) */}
          <div className="lg:relative">
            <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:bg-white/40 lg:p-1 lg:backdrop-blur-sm scrollbar-hide">
              <div className="space-y-6 lg:p-5">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <ProductHeader product={productData} discount={discount} />

                  <div className="mt-5">
                    <ProductPrice variant={selectedVariant} />
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                    {productData.shortDescription}
                  </p>
                </div>

                <div className="space-y-5">
                  <ProductVariantSelector
                    product={productData}
                    selectedVariant={selectedVariant}
                    onVariantChange={handleVariantChange}
                  />

                  <ProductQuantitySelector
                    quantity={quantity}
                    availableStock={availableStock}
                    cartQuantity={cartQuantity}
                    onQuantityChange={setQuantity}
                  />

                  <ProductActions
                    availableStock={availableStock}
                    cartQuantity={cartQuantity}
                    isAddingToCart={isAddingToCart}
                    isBuyingNow={isBuyingNow}
                    isInWishlist={isInWishlistState}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onToggleWishlist={handleToggleWishlist}
                    onShare={handleShare}
                  />

                  <ProductContactSupport />

                  <ProductFeatures />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component 3: Description & Specifications (Bottom Section) */}
        <div className="mt-12">
          <ProductTabs product={productData} />
        </div>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          images={allImages.map((img) => getImageUrl(img))}
          currentIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
          productName={productData.name}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {selectedVariant.color}
              {selectedVariant.storage ? ` • ${selectedVariant.storage}` : ""}
            </p>
            <p className="text-base font-semibold text-slate-950">
              {selectedVariant.price.toLocaleString("vi-VN")}₫
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleAddToCart}
            disabled={availableStock === 0 || isAddingToCart}
          >
            {tProduct("addToCart")}
          </Button>
          <Button
            variant="brand"
            onClick={handleBuyNow}
            disabled={availableStock === 0 || isBuyingNow}
          >
            {tProduct("buyNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}

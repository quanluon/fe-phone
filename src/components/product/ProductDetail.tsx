"use client";

import { ProductActions } from "@/components/product/ProductActions";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductContactSupport } from "@/components/product/ProductContactSupport";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductQuantitySelector } from "@/components/product/ProductQuantitySelector";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector";
import { Button } from "@/components/ui/Button";
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";
import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProducts";
import { calculateDiscount, getImageUrl } from "@/lib/utils";
import { logger } from "@/lib/utils/logger";
import { useWishlistStore } from "@/stores/wishlist";
import { Product, ProductVariant } from "@/types";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductDetailClientProps {
  initialProduct: Product | null;
}

export function ProductDetail({
  initialProduct,
}: ProductDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("product.detail");

  // Get product identifier from URL params
  const identifier = params.slug as string;

  // Extract _id from the identifier (format: _id-slug)
  const productId = identifier.split("-")[0];

  // Fetch product data using only the _id, but use initialProduct as fallback
  const { data: product, isLoading: productLoading } = useProduct(productId);

  // Use server-side fetched data initially, then client-side data when available
  const productData = (product as Product) || initialProduct;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { addItem: addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();

  // Set initial variant when product loads
  useEffect(() => {
    if (
      productData &&
      productData.variants &&
      productData.variants.length > 0 &&
      !selectedVariant
    ) {
      setSelectedVariant(productData.variants[0]);
    }
  }, [productData, selectedVariant]);

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
          "Cart validation failed"
        );
      }
    } catch (error) {
      logger.error(
        { error, productId: productData._id, variantId: selectedVariant?._id },
        "Error adding to cart"
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
        router.push("/orders/create");
      } else {
        logger.warn(
          {
            productId: productData._id,
            variantId: selectedVariant._id,
            error: result.error,
          },
          "Cart validation failed"
        );
      }
    } catch (error) {
      logger.error(
        { error, productId: productData._id, variantId: selectedVariant?._id },
        "Error buying now"
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
      navigator.share({
        title: productData.name,
        text: productData.description,
        url: window.location.href,
      });
    } else {
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
  };

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

  const allImages = [
    ...selectedVariant.images,
    ...productData.images.filter(
      (img: string) => !selectedVariant.images.includes(img)
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <ProductBreadcrumb product={productData} />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <ProductImageGallery
            images={allImages}
            productName={productData.name}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            onImageClick={handleImageClick}
            product={productData}
          />

          {/* Product Info */}
          <div className="space-y-6 h-full overflow-y-auto">
            <ProductHeader product={productData} discount={discount} />

            <ProductPrice variant={selectedVariant} />

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {productData.shortDescription}
            </p>

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

        <ProductTabs product={productData} />

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
    </div>
  );
}

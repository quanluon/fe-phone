'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';
import { useCartWithTranslations } from '@/hooks/useCartWithTranslations';
import { useWishlistStore } from '@/stores/wishlist';
import { useUIStore } from '@/stores/ui';
import { useProduct } from '@/hooks/useProducts';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/lib/utils';
import { ProductVariant, Product, ProductAttribute } from '@/types';

export function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('product.detail');
  const tProduct = useTranslations('product');
  
  // Get product identifier from URL params
  const identifier = params.slug as string;
  
  // Extract _id from the identifier (format: _id-slug)
  const productId = identifier.split('-')[0];
  
  // Fetch product data using only the _id
  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId);
  
  // Type assertion to fix TypeScript issues
  const productData = product as unknown as Product;
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const { addItem: addToCart, getItemQuantity } = useCartWithTranslations();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();
  const { currency } = useUIStore();

  // Set initial variant when product loads
  useEffect(() => {
    if (productData && productData.variants && productData.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(productData.variants[0]);
    }
  }, [productData, selectedVariant]);

  const isInWishlistState = productData ? isInWishlist(productData._id) : false;
  const discount = selectedVariant?.originalPrice 
    ? calculateDiscount(selectedVariant.price, selectedVariant.originalPrice)
    : 0;

  // Calculate available stock considering cart quantity
  const cartQuantity = selectedVariant ? getItemQuantity(productData._id, selectedVariant._id) : 0;
  const availableStock = selectedVariant ? selectedVariant.stock - cartQuantity : 0;

  const handleAddToCart = async () => {
    if (!productData || !selectedVariant) return;
    
    setIsAddingToCart(true);
    try {
      const result = addToCart(productData, selectedVariant, quantity);
      
      // If validation failed, the error toast is already shown by the store
      if (!result.isValid) {
        console.warn('Cart validation failed:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
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

  // Helper function to group attributes by category
  const groupAttributesByCategory = (attributes: ProductAttribute[]) => {
    return attributes.reduce((groups, attribute) => {
      const category = attribute.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(attribute);
      return groups;
    }, {} as Record<string, ProductAttribute[]>);
  };

  // Loading state
  if (productLoading) {
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
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
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

  // Error state
  if (productError || !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('productNotFound')}</h1>
            <p className="text-gray-600 mb-8">
              {t('productNotFoundDescription')}
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.back()}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {t('goBack')}
              </Button>
              <Link href="/products">
                <Button variant="outline">{t('browseProducts')}</Button>
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
    ...productData.images.filter((img: string) => !selectedVariant.images.includes(img))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${productData.category._id}`} className="hover:text-blue-600">
            {productData.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{productData.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleImageClick(selectedImageIndex)}
            >
              <Image
                src={getImageUrl(allImages[selectedImageIndex])}
                alt={productData.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      handleImageClick(index);
                    }}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:border-blue-300 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${productData.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Badges */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{productData.brand.name}</span>
              {productData.isNew && (
                <Badge variant="success" size="sm">{tProduct('new')}</Badge>
              )}
              {productData.isFeatured && (
                <Badge variant="warning" size="sm">{tProduct('featured')}</Badge>
              )}
              {discount > 0 && (
                <Badge variant="danger" size="sm">{discount}% {tProduct('off')}</Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolidIcon key={star} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8) • 124 {t('reviewsCount')}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(selectedVariant.price, currency)}
              </span>
              {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(selectedVariant.originalPrice, currency)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {productData.shortDescription}
            </p>

            {/* Variant Selection */}
            <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{t('color')}</h3>
                <div className="flex gap-2">
                  {productData.variants.map((variant: ProductVariant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedImageIndex(0);
                      }}
                      className={`px-4 py-2 rounded-md border-2 transition-colors ${
                        selectedVariant._id === variant._id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{t('storage')}</h3>
                <div className="flex gap-2">
                  {Array.from(new Set(productData.variants.map((v: ProductVariant) => v.storage))).map((storage) => (
                    <button
                      key={storage as string}
                      onClick={() => {
                        const variant = productData.variants.find((v: ProductVariant) => v.storage === storage && v.color === selectedVariant.color);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className={`px-4 py-2 rounded-md border-2 transition-colors ${
                        selectedVariant.storage === storage
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {storage as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{t('quantity')}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {availableStock > 0 ? (
                    <span>
                      {availableStock} {t('available')}
                      {cartQuantity > 0 && (
                        <span className="text-blue-600 ml-1">
                          ({cartQuantity} {t('product.inCartCount')})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-red-600">
                      {cartQuantity > 0 ? tProduct('allItemsInCart') : tProduct('outOfStock')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={availableStock === 0 || isAddingToCart}
                className="flex-1"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {availableStock === 0 
                  ? (cartQuantity > 0 ? tProduct('allItemsInCart') : tProduct('outOfStock'))
                  : isAddingToCart 
                    ? t('adding') 
                    : t('addToCart')
                }
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleWishlist}
                className="px-4"
              >
                {isInWishlistState ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                className="px-4"
              >
                <ShareIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('freeShipping')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('warranty')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('returns')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('description')}
                </button>
                <button 
                  onClick={() => setActiveTab('specifications')}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'specifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('specifications')}
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  {t('reviews')} (124)
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: productData.description }}
                  />
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  {Object.entries(groupAttributesByCategory(productData.attributes)).map(([category, attributes]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {attributes.map((attribute, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{attribute.name}</span>
                            <span className="text-gray-900 font-medium">
                              {attribute.value}
                              {attribute.unit && <span className="text-gray-500 ml-1">{attribute.unit}</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          images={allImages.map(img => getImageUrl(img))}
          currentIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
          productName={productData.name}
        />

      </div>
    </div>
  );
}

'use client';

import { NextImage } from '@/components/ui';
import { getImageUrl } from '@/lib/utils';
import { GuaranteeSection } from './GuaranteeSection';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onImageClick: (index: number) => void;
  product: Product;
}

export function ProductImageGallery({
  images,
  productName,
  selectedIndex,
  onIndexChange,
  onImageClick,
  product,
}: ProductImageGalleryProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1 flex flex-col">
        {/* Main Image */}
        <div
          className="flex-shrink-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center"
          onClick={() => onImageClick(selectedIndex)}
        >
          <NextImage
            src={getImageUrl(images[selectedIndex])}
            alt={productName}
            width={400}
            height={400}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex-shrink-0 flex gap-2 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border-2 transition-all hover:border-blue-300 ${
                  selectedIndex === index
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}
              >
                <NextImage
                  src={getImageUrl(image)}
                  alt={`${productName} ${index + 1}`}
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Guarantee Section */}
        <div className="flex-1 overflow-y-auto">
          {product && <GuaranteeSection product={product} />}
        </div>
      </div>
    </div>
  );
}


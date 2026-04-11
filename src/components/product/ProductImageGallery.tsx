"use client";

import { NextImage } from "@/components/ui";
import { getImageUrl } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onImageClick: (index: number) => void;
  priority?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  selectedIndex,
  onIndexChange,
  onImageClick,
  priority = false,
}: ProductImageGalleryProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 flex-col space-y-4">
        {/* Main Image */}
        <div
          className="flex min-h-[24rem] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm transition-opacity hover:opacity-95 lg:min-h-0"
          onClick={() => onImageClick(selectedIndex)}
        >
          <NextImage
            src={getImageUrl(images[selectedIndex])}
            alt={productName}
            width={800}
            height={800}
            className="w-full h-full object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
          />
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex flex-shrink-0 gap-2 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all hover:border-blue-300 ${
                  selectedIndex === index
                    ? "border-blue-500"
                    : "border-slate-200"
                }`}
              >
                <NextImage
                  src={getImageUrl(image)}
                  alt={`${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

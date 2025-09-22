import { Card, NextImage } from "@/components/ui";
import { Category } from "@/types";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  className,
}) => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const content = (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center p-4">
        {/* Icon */}
        {category.image ? (
          <NextImage
            src={category.image}
            alt={category.name}
            width={100}
            height={100}
          />
        ) : (
          <DevicePhoneMobileIcon />
        )}

        {/* Category Name */}
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Card>
  );

  if (onClick) {
    return content;
  }

  return <Link href={`/products?category=${category._id}`}>{content}</Link>;
};

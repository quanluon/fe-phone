import { Card, NextImage } from "@/components/ui";
import { Category } from "@/types";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "antd";
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
    onClick?.();
  };

  const content = (
    <Tooltip title={category.description || category.name} placement="top">
      <Card
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl shadow-md shadow-top ${className}`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center text-center p-4">
          {/* Icon */}
          <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
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
          </div>

          {/* Category Name */}
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </Card>
    </Tooltip>
  );

  if (onClick) {
    return content;
  }

  return <Link href={`/products?category=${category._id}`}>{content}</Link>;
};

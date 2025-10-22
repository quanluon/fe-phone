'use client';

import { Product, ProductAttribute, ProductAttributeType } from '@/types';
import { getAttributeCategoryKey } from '@/lib/utils/attributeCategories';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations('product.detail');
  const tAttributeCategories = useTranslations('product.attributeCategories');
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  // Helper function to group attributes by category
  const groupAttributesByCategory = (attributes: ProductAttribute[]) => {
    return attributes.reduce((groups, attribute) => {
      const categoryKey = getAttributeCategoryKey(attribute.category || 'other');
      if (!groups[categoryKey]) {
        groups[categoryKey] = [];
      }
      groups[categoryKey].push(attribute);
      return groups;
    }, {} as Record<string, ProductAttribute[]>);
  };

  // Helper function to get translated category name
  const getTranslatedCategoryName = (categoryKey: string) => {
    try {
      return tAttributeCategories(categoryKey as keyof typeof tAttributeCategories);
    } catch {
      return categoryKey;
    }
  };

  return (
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-6">
              {Object.entries(
                groupAttributesByCategory(
                  product.attributes.filter(
                    (attr: ProductAttribute) =>
                      attr.type !== ProductAttributeType.GUARANTEE
                  )
                )
              ).map(([category, attributes]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {getTranslatedCategoryName(category)}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attributes.map((attribute, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600">{attribute.name}</span>
                        <span className="text-gray-900 font-medium">
                          {attribute.value}
                          {attribute.unit && (
                            <span className="text-gray-500 ml-1">
                              {attribute.unit}
                            </span>
                          )}
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
  );
}


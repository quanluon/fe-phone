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
    <div>
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex gap-3 overflow-x-auto px-4 py-4 sm:px-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('description')}
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'specifications'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('specifications')}
            </button>
          </nav>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-none">
              <div
                className="leading-7 text-slate-600"
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
                <div key={category} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h3 className="mb-4 text-lg font-semibold text-slate-950">
                    {getTranslatedCategoryName(category)}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {attributes.map((attribute, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-4 rounded-2xl bg-white px-4 py-3"
                      >
                        <span className="text-sm text-slate-500">{attribute.name}</span>
                        <span className="text-right text-sm font-semibold text-slate-900">
                          {attribute.value}
                          {attribute.unit && (
                            <span className="ml-1 text-slate-500">
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

'use client';

import { Product, ProductAttribute, ProductAttributeType } from '@/types';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface GuaranteeSectionProps {
  product: Product;
}

export function GuaranteeSection({ product }: GuaranteeSectionProps) {
  const t = useTranslations('product.guarantee');

  // Memoize guarantee attributes to ensure proper re-rendering
  const guaranteeAttributes = useMemo(() => {
    if (!product || !product.attributes || product.attributes.length === 0) {
      return [];
    }
    
    const filtered = product.attributes.filter(
      (attr: ProductAttribute) => 
        attr.type === ProductAttributeType.GUARANTEE
    );
    
    return filtered;
  }, [product?.attributes]);

  // Memoize grouped guarantees
  const groupedGuarantees = useMemo(() => {
    return guaranteeAttributes.reduce((groups, attribute) => {
      const category = attribute.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(attribute);
      return groups;
    }, {} as Record<string, ProductAttribute[]>);
  }, [guaranteeAttributes]);

  // Don't render if no guarantee attributes
  if (guaranteeAttributes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-green-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t('title')}
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedGuarantees).map(([category, attributes]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 capitalize">
              {category === 'warranty' && t('warranty')}
              {category === 'quality' && t('quality')}
              {category === 'service' && t('service')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attributes.map((attribute, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      {attribute.name}
                    </span>
                    {attribute.value && (
                      <span className="text-sm text-gray-600 ml-1">
                        - {attribute.value}
                        {attribute.unit && (
                          <span className="text-gray-500 ml-1">
                            {attribute.unit}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 font-medium">
          {t('commitment')}
        </p>
      </div>
    </div>
  );
}

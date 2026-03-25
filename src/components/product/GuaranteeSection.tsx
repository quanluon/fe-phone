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
  }, [product]);

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
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/70 p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
        <h3 className="text-lg font-semibold text-slate-950">
          {t('title')}
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedGuarantees).map(([category, attributes]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800 capitalize">
              {category === 'warranty' && t('warranty')}
              {category === 'quality' && t('quality')}
              {category === 'service' && t('service')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attributes.map((attribute, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/90 p-3"
                >
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-900">
                      {attribute.name}
                    </span>
                    {attribute.value && (
                      <span className="ml-1 text-sm text-slate-600">
                        - {attribute.value}
                        {attribute.unit && (
                          <span className="ml-1 text-slate-500">
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

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-3">
        <p className="text-sm font-medium text-emerald-900">
          {t('commitment')}
        </p>
      </div>
    </div>
  );
}

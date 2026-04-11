'use client';

import { Product, ProductAttribute, ProductAttributeType } from '@/types';
import { getAttributeCategoryKey } from '@/lib/utils/attributeCategories';
import { useTranslations } from 'next-intl';
import { Collapse, Typography } from 'antd';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;

interface ProductInformationCollapseProps {
  product: Product;
}

export function ProductInformationCollapse({ product }: ProductInformationCollapseProps) {
  const t = useTranslations('product.detail');
  const tAttributeCategories = useTranslations('product.attributeCategories');

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

  const productAttributes = product.attributes.filter(
    (attr: ProductAttribute) => attr.type !== ProductAttributeType.GUARANTEE
  );

  return (
    <div className="mt-6 flex flex-col gap-4">
      <Collapse
        defaultActiveKey={['description']}
        ghost
        expandIconPosition="end"
        className="product-detail-collapse !bg-transparent"
      >
        <Panel 
          header={
            <div className="flex items-center gap-2 py-1">
              <InfoCircleOutlined className="text-slate-500" />
              <span className="font-bold text-slate-900">{t('description')}</span>
            </div>
          } 
          key="description"
          className="!mb-4 !rounded-[2rem] border border-slate-200 !bg-white !shadow-sm overflow-hidden"
        >
          <div className="px-1 py-1 sm:px-2">
            <div className="prose prose-slate max-w-none">
              <div
                className="leading-7 text-slate-600 prose-img:rounded-3xl prose-img:shadow-lg prose-a:text-blue-600 hover:prose-a:text-blue-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </Panel>

        {productAttributes.length > 0 && (
          <Panel 
            header={
              <div className="flex items-center gap-2 py-1">
                <SettingOutlined className="text-slate-500" />
                <span className="font-bold text-slate-900">{t('specifications')}</span>
              </div>
            } 
            key="specifications"
            className="!rounded-[2rem] border border-slate-200 !bg-white !shadow-sm overflow-hidden"
          >
            <div className="space-y-6 px-1 py-2 sm:px-2">
              {Object.entries(groupAttributesByCategory(productAttributes)).map(([category, attributes]) => (
                <div key={category} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 text-base font-bold text-slate-950">
                    {getTranslatedCategoryName(category)}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {attributes.map((attribute, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-4 rounded-xl bg-white px-4 py-3 shadow-sm border border-slate-100"
                      >
                        <span className="text-xs text-slate-500 font-medium">{attribute.name}</span>
                        <span className="text-right text-xs font-bold text-slate-900">
                          {attribute.value}
                          {attribute.unit && (
                            <span className="ml-0.5 text-slate-400 font-normal">
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
          </Panel>
        )}
      </Collapse>
      
      <style jsx global>{`
        .product-detail-collapse .ant-collapse-item > .ant-collapse-header {
          padding: 16px 24px !important;
          align-items: center !important;
        }
        .product-detail-collapse .ant-collapse-content > .ant-collapse-content-box {
          padding: 0 24px 24px !important;
        }
        .product-detail-collapse .ant-collapse-item {
            margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}

'use client';

import { Product, ProductAttribute, ProductAttributeType } from '@/types';
import { Collapse } from 'antd';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon, CubeIcon } from '@heroicons/react/24/outline';

const { Panel } = Collapse;

interface ProductWarrantyCollapseProps {
  product: Product;
}

export function ProductWarrantyCollapse({ product }: ProductWarrantyCollapseProps) {
  
  const guaranteeAttributes = product.attributes.filter(
    (attr: ProductAttribute) => attr.type === ProductAttributeType.GUARANTEE
  );

  const commitments = [
    {
      icon: TruckIcon,
      title: 'Giao hàng miễn phí',
      description: 'Dành cho một số đơn hàng và giao hàng hoả tốc nội thành.',
    },
    {
      icon: ArrowPathIcon,
      title: 'Đổi trả dễ dàng',
      description: 'Hỗ trợ đổi màu, dung lượng và bảo hành sau mua.',
    },
    {
      icon: CubeIcon,
      title: 'Kho hàng minh bạch',
      description: 'Hiển thị tồn kho thực tế trước khi đặt hàng.',
    },
  ];

  return (
    <div className="mt-6">
      <Collapse
        defaultActiveKey={['warranty']}
        ghost
        expandIconPosition="end"
        className="warranty-collapse !bg-transparent"
      >
        <Panel 
          header={
            <div className="flex items-center gap-2 py-1">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-slate-900">Bảo hành & Cam kết</span>
            </div>
          } 
          key="warranty"
          className="!rounded-[2rem] border border-slate-200 !bg-white !shadow-sm overflow-hidden"
        >
          <div className="space-y-4 px-1 py-1">
            {/* Standard Commitments */}
            <div className="grid gap-3">
              {commitments.map((item, idx) => (
                <div key={idx} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantee Attributes from data */}
            {guaranteeAttributes.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {guaranteeAttributes.map((attr, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-500">{attr.name}</span>
                    <span className="font-semibold text-slate-900 text-right">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </Collapse>

      <style jsx global>{`
        .warranty-collapse .ant-collapse-item > .ant-collapse-header {
          padding: 16px 24px !important;
          align-items: center !important;
        }
        .warranty-collapse .ant-collapse-content > .ant-collapse-content-box {
          padding: 0 24px 24px !important;
        }
      `}</style>
    </div>
  );
}

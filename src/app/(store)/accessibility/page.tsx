import type { Metadata } from 'next';
import { CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Khả Năng Tiếp Cận',
  description: 'Cam kết cải thiện khả năng tiếp cận của website Nguyen Cong Mobile cho mọi người dùng.',
  alternates: {
    canonical: '/accessibility',
  },
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Khả Năng Tiếp Cận</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {CONTACT_INFO.name} cam kết từng bước cải thiện khả năng tiếp cận của website để người dùng có thể tìm kiếm sản phẩm, đọc thông tin
            và liên hệ hỗ trợ thuận tiện hơn trên nhiều thiết bị.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
            <p>Chúng tôi ưu tiên khả năng đọc nội dung, độ tương phản, cấu trúc tiêu đề rõ ràng và điều hướng dễ hiểu.</p>
            <p>Nếu bạn gặp khó khăn khi sử dụng website, vui lòng liên hệ để chúng tôi hỗ trợ trực tiếp và tiếp tục cải thiện trải nghiệm.</p>
            <p>
              Liên hệ hỗ trợ:
              {' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium text-sky-700 hover:text-sky-800">
                {CONTACT_INFO.email}
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

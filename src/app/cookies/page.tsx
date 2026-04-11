import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Cookie',
  description: 'Thông tin về việc website sử dụng cookie để cải thiện trải nghiệm và đo lường hiệu quả.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Chính Sách Cookie</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Website sử dụng cookie và các công nghệ tương tự để ghi nhớ phiên làm việc, cải thiện trải nghiệm duyệt web, đo lường hiệu quả nội
            dung và tối ưu hoạt động tiếp thị.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
            <p>Cookie có thể được dùng để ghi nhớ cài đặt, trạng thái đăng nhập, giỏ hàng và hành vi sử dụng cơ bản trên website.</p>
            <p>Bạn có thể tắt hoặc xóa cookie trong trình duyệt, tuy nhiên một số tính năng của website có thể bị ảnh hưởng.</p>
            <p>Chúng tôi chỉ sử dụng cookie trong phạm vi phục vụ trải nghiệm, phân tích vận hành và cải thiện hiệu quả nội dung.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import { CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Điều Khoản Dịch Vụ',
  description: 'Điều khoản dịch vụ khi truy cập, đặt hàng và sử dụng website Nguyen Cong Mobile.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Điều Khoản Dịch Vụ</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Khi truy cập và sử dụng website của {CONTACT_INFO.name}, bạn đồng ý với các điều khoản liên quan đến việc xem thông tin sản phẩm,
            gửi yêu cầu mua hàng, liên hệ tư vấn và sử dụng các tiện ích trên website.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
            <p>Thông tin sản phẩm, giá bán và tình trạng hàng có thể thay đổi theo thời điểm thực tế.</p>
            <p>Người dùng cần cung cấp thông tin liên hệ chính xác để việc xác nhận đơn hàng và hỗ trợ được thực hiện nhanh chóng.</p>
            <p>Website có quyền cập nhật nội dung, chính sách và điều khoản để phù hợp với hoạt động kinh doanh và quy định hiện hành.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description:
    'Chính sách quyền riêng tư và hướng dẫn xóa dữ liệu người dùng tại Nguyen Cong Mobile.',
  alternates: {
    canonical: '/privacy',
  },
};

const sections = [
  {
    title: '1. Thông tin chung',
    content: [
      'Nguyen Cong Mobile thu thập thông tin cơ bản của khách hàng để hỗ trợ đặt hàng, giao hàng, xác nhận đơn, chăm sóc sau bán và cải thiện trải nghiệm sử dụng website.',
      'Thông tin có thể bao gồm họ tên, email, số điện thoại, địa chỉ giao hàng và các dữ liệu cần thiết để xử lý đơn hàng.',
    ],
  },
  {
    title: '2. Mục đích sử dụng dữ liệu',
    content: [
      'Thông tin của bạn được sử dụng để tiếp nhận và xử lý đơn hàng, liên hệ xác nhận sản phẩm, hỗ trợ bảo hành, giải đáp yêu cầu và gửi thông tin cập nhật liên quan đến đơn hàng.',
      'Chúng tôi không bán, cho thuê hoặc chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba cho mục đích thương mại không liên quan.',
    ],
  },
  {
    title: '3. Bảo mật thông tin',
    content: [
      'Website và hệ thống quản trị nội bộ áp dụng các biện pháp kỹ thuật và quy trình vận hành phù hợp để hạn chế truy cập trái phép, mất mát dữ liệu hoặc sử dụng sai mục đích.',
      'Chỉ những bộ phận cần thiết cho việc xử lý đơn hàng, hỗ trợ khách hàng và vận hành hệ thống mới được phép tiếp cận dữ liệu liên quan.',
    ],
  },
  {
    title: '4. Chia sẻ với đối tác',
    content: [
      'Trong trường hợp cần thiết để hoàn tất đơn hàng, chúng tôi có thể chia sẻ một phần thông tin với đơn vị vận chuyển, cổng thanh toán hoặc nhà cung cấp dịch vụ kỹ thuật liên quan.',
      'Các bên liên quan chỉ được sử dụng dữ liệu trong phạm vi cần thiết để hoàn tất dịch vụ cho bạn.',
    ],
  },
  {
    title: '5. Quyền của người dùng',
    content: [
      'Bạn có quyền yêu cầu xem, sửa đổi, cập nhật hoặc xóa dữ liệu cá nhân mà chúng tôi đang lưu trữ, trong phạm vi phù hợp với quy định pháp luật và nghĩa vụ vận hành của doanh nghiệp.',
      'Nếu cần chỉnh sửa thông tin tài khoản hoặc dữ liệu đơn hàng, bạn có thể liên hệ trực tiếp với chúng tôi qua email hoặc số điện thoại bên dưới.',
    ],
  },
  {
    title: '6. Hướng dẫn xóa dữ liệu người dùng',
    content: [
      `Để yêu cầu xóa dữ liệu, vui lòng gửi email đến ${CONTACT_INFO.email} hoặc liên hệ qua số điện thoại ${CONTACT_INFO.phone}.`,
      'Trong yêu cầu, vui lòng cung cấp email, số điện thoại hoặc thông tin đơn hàng liên quan để chúng tôi xác minh và xử lý nhanh hơn.',
      'Sau khi xác minh thông tin, chúng tôi sẽ thực hiện việc xóa hoặc ẩn danh dữ liệu không còn cần thiết trong thời gian hợp lý.',
    ],
  },
  {
    title: '7. Liên hệ',
    content: [
      `Email: ${CONTACT_INFO.email}`,
      `Điện thoại: ${CONTACT_INFO.phone}`,
      'Nếu bạn có câu hỏi về chính sách bảo mật hoặc quy trình xử lý dữ liệu, vui lòng liên hệ với chúng tôi để được hỗ trợ.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] sm:px-8">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Chính sách bảo mật
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Chính sách quyền riêng tư và xóa dữ liệu người dùng
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Trang này được sử dụng để công bố cách Nguyen Cong Mobile thu thập, sử dụng, bảo vệ và xử lý yêu cầu xóa dữ liệu của người dùng
            khi đặt hàng hoặc sử dụng website.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Gửi email yêu cầu xóa dữ liệu
            </a>
            <a
              href={`tel:${CONTACT_INFO.phoneLink}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Gọi {CONTACT_INFO.phone}
            </a>
          </div>
        </section>

        <section className="space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
              <h2 className="font-display text-2xl font-semibold text-slate-950">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.content.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-slate-600 sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-6 py-6 text-sm leading-7 text-amber-900 shadow-sm sm:px-8">
          Facebook App Dashboard có thể dùng chính URL này cho cả hai trường:
          {' '}
          <strong>Privacy Policy URL</strong>
          {' '}
          và
          {' '}
          <strong>Data Deletion Instructions URL</strong>.
          Nếu cần, bạn có thể dán link:
          {' '}
          <Link href="/privacy" className="font-semibold underline underline-offset-4">
            /privacy
          </Link>
          .
        </section>
      </div>
    </main>
  );
}

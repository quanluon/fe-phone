import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Chinh sach quyen rieng tu',
  description:
    'Chinh sach quyen rieng tu va huong dan xoa du lieu nguoi dung tai Nguyen Cong Mobile.',
  alternates: {
    canonical: '/privacy',
  },
};

const sections = [
  {
    title: '1. Thong tin chung',
    content: [
      'Nguyen Cong Mobile thu thap thong tin co ban cua khach hang de ho tro dat hang, giao hang, xac nhan don, cham soc sau ban va cai thien trai nghiem su dung website.',
      'Thong tin co the bao gom ho ten, email, so dien thoai, dia chi giao hang va cac du lieu can thiet de xu ly don hang.',
    ],
  },
  {
    title: '2. Muc dich su dung du lieu',
    content: [
      'Thong tin cua ban duoc su dung de tiep nhan va xu ly don hang, lien he xac nhan san pham, ho tro bao hanh, giai dap yeu cau va gui thong tin cap nhat lien quan den don hang.',
      'Chung toi khong ban, cho thue hoac chia se du lieu ca nhan cua ban cho ben thu ba cho muc dich thuong mai khong lien quan.',
    ],
  },
  {
    title: '3. Bao mat thong tin',
    content: [
      'Website va he thong quan tri noi bo ap dung cac bien phap ky thuat va quy trinh van hanh phu hop de han che truy cap trai phep, mat mat du lieu hoac su dung sai muc dich.',
      'Chi nhung bo phan can thiet cho viec xu ly don hang, ho tro khach hang va van hanh he thong moi duoc phep tiep can du lieu lien quan.',
    ],
  },
  {
    title: '4. Chia se voi doi tac',
    content: [
      'Trong truong hop can thiet de hoan tat don hang, chung toi co the chia se mot phan thong tin voi don vi van chuyen, cong thanh toan hoac nha cung cap dich vu ky thuat lien quan.',
      'Cac ben lien quan chi duoc su dung du lieu trong pham vi can thiet de hoan tat dich vu cho ban.',
    ],
  },
  {
    title: '5. Quyen cua nguoi dung',
    content: [
      'Ban co quyen yeu cau xem, sua doi, cap nhat hoac xoa du lieu ca nhan ma chung toi dang luu tru, trong pham vi phu hop voi quy dinh phap luat va nghia vu van hanh cua doanh nghiep.',
      'Neu can chinh sua thong tin tai khoan hoac du lieu don hang, ban co the lien he truc tiep voi chung toi qua email hoac so dien thoai ben duoi.',
    ],
  },
  {
    title: '6. Huong dan xoa du lieu nguoi dung',
    content: [
      `De yeu cau xoa du lieu, vui long gui email den ${CONTACT_INFO.email} hoac lien he qua so dien thoai ${CONTACT_INFO.phone}.`,
      'Trong yeu cau, vui long cung cap email, so dien thoai hoac thong tin don hang lien quan de chung toi xac minh va xu ly nhanh hon.',
      'Sau khi xac minh thong tin, chung toi se thuc hien viec xoa hoac an danh du lieu khong con can thiet trong thoi gian hop ly.',
    ],
  },
  {
    title: '7. Lien he',
    content: [
      `Email: ${CONTACT_INFO.email}`,
      `Dien thoai: ${CONTACT_INFO.phone}`,
      'Neu ban co cau hoi ve chinh sach bao mat hoac quy trinh xu ly du lieu, vui long lien he voi chung toi de duoc ho tro.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20 pt-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] sm:px-8">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Privacy Policy
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Chinh sach quyen rieng tu va xoa du lieu nguoi dung
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Trang nay duoc su dung de cong bo cach Nguyen Cong Mobile thu thap, su dung, bao ve va xu ly yeu cau xoa du lieu cua nguoi dung
            khi dat hang hoac su dung website.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Gui email yeu cau xoa du lieu
            </a>
            <a
              href={`tel:${CONTACT_INFO.phoneLink}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Goi {CONTACT_INFO.phone}
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
          Facebook App Dashboard co the dung chinh URL nay cho ca hai truong:
          {' '}
          <strong>Privacy Policy URL</strong>
          {' '}
          va
          {' '}
          <strong>Data Deletion Instructions URL</strong>.
          Neu can, ban co the dan link:
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

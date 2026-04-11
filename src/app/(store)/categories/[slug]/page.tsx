import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingPageShell } from '@/components/seo/LandingPageShell';
import { DEFAULT_PRODUCTS_PAGE_SIZE, getCategories, getCategoryBySlug, getProducts } from '@/lib/api/server-catalog';
import { buildCategoryMetaDescription } from '@/lib/catalog-seo';
import { CONTACT_INFO } from '@/lib/constants';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, getDefaultMetaDescription } from '@/lib/seo';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: `Khong tim thay danh muc | ${CONTACT_INFO.name}`,
      description: getDefaultMetaDescription(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = buildCategoryMetaDescription(category);

  return {
    title: `${category.name} gia tot`,
    description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | ${CONTACT_INFO.name}`,
      description,
      url: `/categories/${category.slug}`,
      locale: 'vi_VN',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const productsResponse = await getProducts({
    category: category._id,
    sort: 'createdAt',
    order: 'desc',
    limit: DEFAULT_PRODUCTS_PAGE_SIZE,
  });

  const faq = [
    {
      question: `Danh muc ${category.name} phu hop voi ai?`,
      answer: `Danh muc ${category.name} phu hop cho nguoi can mot diem bat dau ro rang de so sanh san pham theo nhu cau va ngan sach.`,
    },
    {
      question: `Tai sao nen xem ${category.name} tren landing page rieng?`,
      answer: `Trang danh muc rieng giup tap trung noi dung, lien ket noi bo va danh sach san pham lien quan, tu do de tim va de index hon.`,
    },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Trang chu', path: '/' },
    { name: 'Danh muc san pham', path: '/products' },
    { name: category.name, path: `/categories/${category.slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LandingPageShell
        eyebrow="Danh muc san pham"
        title={`${category.name} Apple gia tot, de tim, de chon`}
        description={category.description || `Tong hop san pham thuoc danh muc ${category.name}, toi uu cho nhu cau tim kiem, so sanh va ra quyet dinh mua nhanh hon.`}
        trustPoints={[
          'Danh muc co URL rieng de index, phu hop cho organic traffic theo nhu cau cu the.',
          'Ket hop noi dung mo ta, FAQ va danh sach san pham thuc te de tang chat luong landing page.',
          'Ho tro dieu huong ve catalog tong va cac bo suu tap lien quan de giam dead-end UX.',
        ]}
        relatedLinks={[
          { href: '/products', label: 'Toan bo san pham' },
          { href: '/collections/iphone', label: 'Bo suu tap iPhone' },
          { href: '/collections/phu-kien', label: 'Bo suu tap phu kien Apple' },
        ]}
        faqs={faq}
        products={productsResponse?.data ?? []}
        emptyTitle={`Danh muc ${category.name} dang duoc cap nhat`}
        emptyDescription="San pham co the tam thoi het hang hoac chua dong bo xong. Ban van co the xem catalog tong hoac cac bo suu tap Apple noi bat."
        viewAllHref={`/products?category=${category._id}`}
      />
    </>
  );
}

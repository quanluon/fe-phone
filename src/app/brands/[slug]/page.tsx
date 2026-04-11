import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingPageShell } from '@/components/seo/LandingPageShell';
import { DEFAULT_PRODUCTS_PAGE_SIZE, getBrandBySlug, getBrands, getProducts } from '@/lib/api/server-catalog';
import { buildBrandMetaDescription } from '@/lib/catalog-seo';
import { CONTACT_INFO } from '@/lib/constants';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, getDefaultMetaDescription } from '@/lib/seo';

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: `Khong tim thay thuong hieu | ${CONTACT_INFO.name}`,
      description: getDefaultMetaDescription(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = buildBrandMetaDescription(brand);

  return {
    title: `${brand.name} gia tot`,
    description,
    alternates: {
      canonical: `/brands/${brand.slug}`,
    },
    openGraph: {
      title: `${brand.name} | ${CONTACT_INFO.name}`,
      description,
      url: `/brands/${brand.slug}`,
      locale: 'vi_VN',
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const productsResponse = await getProducts({
    brand: brand._id,
    sort: 'createdAt',
    order: 'desc',
    limit: DEFAULT_PRODUCTS_PAGE_SIZE,
  });

  const faq = [
    {
      question: `Thuong hieu ${brand.name} co gi dang chu y?`,
      answer: `Trang thuong hieu ${brand.name} giup gom san pham theo mot logic ro rang, thuan tien cho nguoi dung so sanh va theo doi cac dong may phu hop.`,
    },
    {
      question: `Trang brand rieng co loi gi cho SEO?`,
      answer: 'URL thuong hieu rieng giup phu hop voi cac truy van tim kiem theo ten thuong hieu, dong thoi tao them diem vao index cho site.',
    },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Trang chu', path: '/' },
    { name: 'Thuong hieu', path: '/products' },
    { name: brand.name, path: `/brands/${brand.slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LandingPageShell
        eyebrow="Thuong hieu noi bat"
        title={`San pham ${brand.name} de tim va de so sanh`}
        description={brand.description || `Tong hop cac san pham ${brand.name} dang co mat tren website, de nguoi dung tim nhanh theo thuong hieu va de Google nhan dien trang dich ro rang hon.`}
        trustPoints={[
          'Trang thuong hieu giup mo rong phu index cho tu khoa theo brand.',
          'Noi dung + FAQ + listing thuc te tao landing page huu ich hon so voi mot filter tam thoi.',
          'Dieu huong sang bo suu tap va catalog tong de tang session depth.',
        ]}
        relatedLinks={[
          { href: '/products', label: 'Toan bo san pham' },
          { href: '/collections/macbook', label: 'MacBook cho hoc tap va cong viec' },
          { href: '/collections/iphone', label: 'iPhone gia tot' },
        ]}
        faqs={faq}
        products={productsResponse?.data ?? []}
        emptyTitle={`Chua co san pham ${brand.name} san sang`}
        emptyDescription="Danh sach thuong hieu nay dang duoc cap nhat. Ban van co the xem catalog tong hoac cac bo suu tap noi bat."
        viewAllHref={`/products?brand=${brand._id}`}
      />
    </>
  );
}

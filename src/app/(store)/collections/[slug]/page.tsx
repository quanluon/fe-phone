import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingPageShell } from '@/components/seo/LandingPageShell';
import { COLLECTION_LANDING_PAGES, getCollectionLandingPage } from '@/lib/catalog-seo';
import { DEFAULT_PRODUCTS_PAGE_SIZE, getProducts } from '@/lib/api/server-catalog';
import { CONTACT_INFO } from '@/lib/constants';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, getDefaultMetaDescription } from '@/lib/seo';

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COLLECTION_LANDING_PAGES.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionLandingPage(slug);

  if (!collection) {
    return {
      title: `Khong tim thay bo suu tap | ${CONTACT_INFO.name}`,
      description: getDefaultMetaDescription(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: collection.title,
    description: collection.metaDescription,
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
    openGraph: {
      title: `${collection.shortTitle} | ${CONTACT_INFO.name}`,
      description: collection.metaDescription,
      url: `/collections/${collection.slug}`,
      locale: 'vi_VN',
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionLandingPage(slug);

  if (!collection) {
    notFound();
  }

  const productsResponse = await getProducts({
    productType: collection.productType,
    sort: 'createdAt',
    order: 'desc',
    limit: DEFAULT_PRODUCTS_PAGE_SIZE,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Trang chu', path: '/' },
    { name: 'Bo suu tap', path: '/products' },
    { name: collection.shortTitle, path: `/collections/${collection.slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd(collection.faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LandingPageShell
        eyebrow="Bo suu tap Apple"
        title={collection.title}
        description={collection.description}
        trustPoints={[
          'Tap trung may dep, gia de chon, de so sanh theo ngan sach.',
          'Noi dung trang duoc toi uu cho nhu cau tim iPhone, iPad, MacBook va phu kien Apple.',
          'Ho tro tu van nhanh, trade-in va chon phien ban phu hop muc dich su dung.',
        ]}
        relatedLinks={[
          { href: '/products', label: 'Danh muc tong hop Apple' },
          { href: '/collections/macbook', label: 'MacBook cho hoc tap va cong viec' },
          { href: '/collections/airpods', label: 'AirPods va phu kien am thanh' },
          { href: '/collections/phu-kien', label: 'Xem them phu kien Apple' },
        ]}
        faqs={collection.faq}
        products={productsResponse?.data ?? []}
        emptyTitle={`Chua co san pham ${collection.shortTitle} phu hop`}
        emptyDescription="Danh sach hien tai dang duoc cap nhat. Ban van co the xem catalog tong hoac thu cac landing page lien quan."
        viewAllHref={`/products?productType=${collection.productType}`}
      />
    </>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { ProductDetail } from '../../../components/product';
import { CONTACT_INFO } from '@/lib/constants';
import { getPrimaryVariant, getProductByIdentifier, getProductPath } from '@/lib/api/server-catalog';
import { buildBreadcrumbJsonLd, getDefaultMetaDescription, stripHtmlTags, toAbsoluteUrl, truncateForMeta } from '@/lib/seo';
import { Product } from '@/types';

export const revalidate = 300;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function buildProductMetadata(product: Product, slug: string): Metadata {
  const title = product.metaTitle || product.name;
  const description = truncateForMeta(
    stripHtmlTags(product.metaDescription || product.shortDescription || product.description) || getDefaultMetaDescription()
  );
  const ogImages = (product.images?.length ? product.images : ['/images/placeholder.svg']).slice(0, 4).map((image) => ({
    url: toAbsoluteUrl(image),
    width: 1200,
    height: 630,
    alt: product.name,
  }));

  return {
    title,
    description,
    alternates: {
      canonical: getProductPath({ _id: product._id, slug }),
    },
    keywords: [
      product.name,
      product.brand.name,
      product.category.name,
      'Apple products',
      'điện thoại Apple',
      'mua online',
    ],
    openGraph: {
      type: 'website',
      url: getProductPath({ _id: product._id, slug }),
      siteName: CONTACT_INFO.name,
      title,
      description,
      locale: 'vi_VN',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

function buildProductJsonLd(product: Product, slug: string) {
  const primaryVariant = getPrimaryVariant(product);
  const totalStock = product.variants.reduce((sum, variant) => sum + Math.max(variant.stock, 0), 0);
  const productUrl = toAbsoluteUrl(getProductPath({ _id: product._id, slug }));
  const primaryImage = product.images?.length ? product.images.map((image) => toAbsoluteUrl(image)) : [toAbsoluteUrl('/images/placeholder.svg')];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: product._id,
    sku: primaryVariant?._id || product._id,
    name: product.name,
    description: stripHtmlTags(product.shortDescription || product.description),
    image: primaryImage,
    category: product.category.name,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: primaryVariant?.price ?? product.basePrice,
      availability: totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdentifier(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${CONTACT_INFO.name}`,
      description: getDefaultMetaDescription(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildProductMetadata(product, slug);
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductByIdentifier(slug);
  const jsonLd = product ? buildProductJsonLd(product, slug) : null;
  const breadcrumbJsonLd = product
    ? buildBreadcrumbJsonLd([
        { name: 'Trang chu', path: '/' },
        { name: 'San pham', path: '/products' },
        { name: product.category.name, path: `/categories/${product.category.slug}` },
        { name: product.name, path: getProductPath({ _id: product._id, slug }) },
      ])
    : null;

  return (
    <>
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      ) : null}
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ProductDetail initialProduct={product} />
    </>
  );
}

'use client';

import { logEvent } from 'firebase/analytics';
import { Product, ProductVariant } from '@/types';
import { logger } from '@/lib/utils/logger';
import { getSiteUrl } from '@/lib/seo';
import { getFirebaseAnalytics } from './client';

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
};

type ProductEventPayload = {
  product: Product;
  variant?: ProductVariant | null;
  quantity?: number;
  currency?: string;
};

let lastTrackedPageViewKey = '';
const trackedEventKeys = new Set<string>();

function getCanonicalCurrency(currency?: string) {
  return currency || 'VND';
}

function getVariantLabel(variant?: ProductVariant | null) {
  if (!variant) {
    return undefined;
  }

  return [variant.name, variant.color, variant.storage, variant.size, variant.connectivity]
    .filter(Boolean)
    .join(' / ');
}

export function mapProductToAnalyticsItem({
  product,
  variant,
  quantity = 1,
  currency = 'VND',
}: ProductEventPayload): AnalyticsItem {
  const resolvedVariant =
    variant ||
    product.variants.find((item) => item.isActive && item.stock > 0) ||
    product.variants[0];
  const price = resolvedVariant?.price ?? product.basePrice;

  return {
    item_id: resolvedVariant?._id || product._id,
    item_name: product.name,
    item_brand: product.brand?.name,
    item_category: product.category?.name,
    item_variant: getVariantLabel(resolvedVariant),
    price,
    quantity,
    currency: getCanonicalCurrency(currency),
  };
}

async function safeLogEvent(name: string, params: Record<string, unknown>) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) {
      return;
    }

    logEvent(analytics, name, params);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn({ error, name }, 'Firebase Analytics event skipped');
    }
  }
}

function shouldTrackOnce(key: string) {
  if (trackedEventKeys.has(key)) {
    return false;
  }

  trackedEventKeys.add(key);
  return true;
}

export async function trackCustomEvent(name: string, params: Record<string, unknown>) {
  await safeLogEvent(name, params);
}

export async function trackPageView(params: {
  pagePath: string;
  pageTitle?: string;
  locale?: string;
}) {
  const pageLocation = new URL(params.pagePath, getSiteUrl()).toString();
  const dedupeKey = `${pageLocation}|${params.pageTitle || ''}`;

  if (dedupeKey === lastTrackedPageViewKey) {
    return;
  }

  lastTrackedPageViewKey = dedupeKey;

  await safeLogEvent('page_view', {
    page_location: pageLocation,
    page_path: params.pagePath,
    page_title: params.pageTitle || (typeof document !== 'undefined' ? document.title : undefined),
    language: params.locale,
  });
}

export async function trackWebVital(params: {
  name: string;
  value: number;
  rating?: string;
  id?: string;
  delta?: number;
  pagePath: string;
}) {
  await safeLogEvent('web_vital', {
    metric_name: params.name,
    metric_value: Math.round(params.value),
    metric_rating: params.rating,
    metric_id: params.id,
    metric_delta: params.delta ? Math.round(params.delta) : undefined,
    page_path: params.pagePath,
  });
}

export async function trackPagePerformance(params: {
  pagePath: string;
  pageTitle?: string;
  dnsMs?: number;
  tcpMs?: number;
  tlsMs?: number;
  ttfbMs?: number;
  domInteractiveMs?: number;
  domCompleteMs?: number;
  loadEventMs?: number;
}) {
  const eventKey = `page_performance:${params.pagePath}:${params.pageTitle || ''}`;
  if (!shouldTrackOnce(eventKey)) {
    return;
  }

  await safeLogEvent('page_performance', {
    page_path: params.pagePath,
    page_title: params.pageTitle,
    dns_ms: params.dnsMs,
    tcp_ms: params.tcpMs,
    tls_ms: params.tlsMs,
    ttfb_ms: params.ttfbMs,
    dom_interactive_ms: params.domInteractiveMs,
    dom_complete_ms: params.domCompleteMs,
    load_event_ms: params.loadEventMs,
  });
}

export async function trackSessionEngagement(params: {
  pagePath: string;
  durationSec: number;
  maxScrollPercent: number;
}) {
  await safeLogEvent('session_engagement', {
    page_path: params.pagePath,
    duration_sec: Math.max(1, Math.round(params.durationSec)),
    max_scroll_percent: params.maxScrollPercent,
  });
}

export async function trackScrollDepth(params: {
  pagePath: string;
  percent: number;
}) {
  await safeLogEvent('scroll_depth', {
    page_path: params.pagePath,
    scroll_percent: params.percent,
  });
}

export async function trackViewItem(payload: ProductEventPayload) {
  const item = mapProductToAnalyticsItem(payload);

  await safeLogEvent('view_item', {
    currency: item.currency,
    value: item.price,
    items: [item],
  });
}

export async function trackViewItemList(params: {
  products: Product[];
  listName: string;
  listId?: string;
  currency?: string;
}) {
  const eventKey = `view_item_list:${params.listId || params.listName}:${params.products.map((product) => product._id).join(',')}`;
  if (!shouldTrackOnce(eventKey)) {
    return;
  }

  await safeLogEvent('view_item_list', {
    item_list_name: params.listName,
    item_list_id: params.listId,
    items: params.products.map((product, index) => ({
      ...mapProductToAnalyticsItem({
        product,
        quantity: 1,
        currency: params.currency,
      }),
      index,
    })),
  });
}

export async function trackSelectItem(params: ProductEventPayload & {
  listName?: string;
  listId?: string;
  index?: number;
}) {
  const item = mapProductToAnalyticsItem(params);

  await safeLogEvent('select_item', {
    item_list_name: params.listName,
    item_list_id: params.listId,
    items: [
      {
        ...item,
        index: params.index,
      },
    ],
  });
}

export async function trackAddToCart(payload: ProductEventPayload) {
  const item = mapProductToAnalyticsItem(payload);

  await safeLogEvent('add_to_cart', {
    currency: item.currency,
    value: (item.price || 0) * (item.quantity || 1),
    items: [item],
  });
}

export async function trackBeginCheckout(payload: ProductEventPayload) {
  const item = mapProductToAnalyticsItem(payload);

  await safeLogEvent('begin_checkout', {
    currency: item.currency,
    value: (item.price || 0) * (item.quantity || 1),
    items: [item],
  });
}

export async function trackSearch(params: {
  query: string;
  resultsCount?: number;
  source?: string;
  pagePath?: string;
}) {
  const trimmedQuery = params.query.trim();
  if (!trimmedQuery) {
    return;
  }

  await safeLogEvent('search', {
    search_term: trimmedQuery,
    results_count: params.resultsCount,
    source: params.source,
    page_path: params.pagePath,
  });
}

export async function trackFilterChange(params: {
  pagePath: string;
  sortBy?: string;
  category?: string;
  brand?: string;
  productType?: string;
  minPrice?: string;
  maxPrice?: string;
  hasSearch?: boolean;
  resultsCount?: number;
}) {
  await safeLogEvent('filter_products', {
    page_path: params.pagePath,
    sort_by: params.sortBy,
    category: params.category,
    brand: params.brand,
    product_type: params.productType,
    min_price: params.minPrice,
    max_price: params.maxPrice,
    has_search: params.hasSearch,
    results_count: params.resultsCount,
  });
}

export async function trackWishlistChange(params: ProductEventPayload & {
  action: 'add' | 'remove';
}) {
  const item = mapProductToAnalyticsItem(params);

  await safeLogEvent(params.action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
    currency: item.currency,
    value: item.price,
    items: [item],
  });
}

export async function trackShare(params: ProductEventPayload & {
  method?: string;
  contentType?: string;
  pagePath?: string;
}) {
  const item = mapProductToAnalyticsItem(params);

  await safeLogEvent('share', {
    method: params.method,
    content_type: params.contentType || 'product',
    item_id: item.item_id,
    item_name: item.item_name,
    page_path: params.pagePath,
  });
}

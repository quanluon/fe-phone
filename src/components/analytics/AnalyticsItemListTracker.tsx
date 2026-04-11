'use client';

import { useEffect } from 'react';
import { Product } from '@/types';
import { trackViewItemList } from '@/lib/firebase/analytics';
import { isFirebaseAnalyticsEnabled } from '@/lib/firebase/client';

interface AnalyticsItemListTrackerProps {
  products: Product[];
  listName: string;
  listId?: string;
  currency?: string;
}

export function AnalyticsItemListTracker({
  products,
  listName,
  listId,
  currency = 'VND',
}: AnalyticsItemListTrackerProps) {
  useEffect(() => {
    if (!isFirebaseAnalyticsEnabled() || products.length === 0) {
      return;
    }

    void trackViewItemList({
      products,
      listName,
      listId,
      currency,
    });
  }, [currency, listId, listName, products]);

  return null;
}

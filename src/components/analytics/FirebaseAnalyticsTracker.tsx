'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { trackPagePerformance, trackPageView, trackScrollDepth, trackSessionEngagement, trackWebVital } from '@/lib/firebase/analytics';
import { isFirebaseAnalyticsEnabled } from '@/lib/firebase/client';

interface FirebaseAnalyticsTrackerProps {
  locale?: string;
}

export function FirebaseAnalyticsTracker({ locale }: FirebaseAnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionStartRef = useRef(Date.now());
  const maxScrollPercentRef = useRef(0);
  const scrollMilestonesRef = useRef<Set<number>>(new Set());

  const pagePath = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useReportWebVitals((metric) => {
    if (!pathname || !isFirebaseAnalyticsEnabled()) {
      return;
    }

    void trackWebVital({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
      pagePath,
    });
  });

  useEffect(() => {
    if (!pathname || !isFirebaseAnalyticsEnabled()) {
      return;
    }

    void trackPageView({
      pagePath,
      pageTitle: typeof document !== 'undefined' ? document.title : undefined,
      locale,
    });
  }, [locale, pagePath, pathname]);

  useEffect(() => {
    if (!pathname || !isFirebaseAnalyticsEnabled() || typeof window === 'undefined') {
      return;
    }

    sessionStartRef.current = Date.now();
    maxScrollPercentRef.current = 0;
    scrollMilestonesRef.current = new Set();

    const updateScrollDepth = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = documentHeight > 0
        ? Math.min(100, Math.round((window.scrollY / documentHeight) * 100))
        : 100;

      maxScrollPercentRef.current = Math.max(maxScrollPercentRef.current, scrollPercent);

      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollMilestonesRef.current.has(milestone)) {
          scrollMilestonesRef.current.add(milestone);
          void trackScrollDepth({
            pagePath,
            percent: milestone,
          });
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void trackSessionEngagement({
          pagePath,
          durationSec: (Date.now() - sessionStartRef.current) / 1000,
          maxScrollPercent: maxScrollPercentRef.current,
        });
      }
    };

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigationEntry) {
      void trackPagePerformance({
        pagePath,
        pageTitle: typeof document !== 'undefined' ? document.title : undefined,
        dnsMs: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        tcpMs: navigationEntry.connectEnd - navigationEntry.connectStart,
        tlsMs: navigationEntry.secureConnectionStart > 0
          ? navigationEntry.connectEnd - navigationEntry.secureConnectionStart
          : undefined,
        ttfbMs: navigationEntry.responseStart - navigationEntry.requestStart,
        domInteractiveMs: navigationEntry.domInteractive,
        domCompleteMs: navigationEntry.domComplete,
        loadEventMs: navigationEntry.loadEventEnd,
      });
    }

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    updateScrollDepth();

    return () => {
      window.removeEventListener('scroll', updateScrollDepth);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void trackSessionEngagement({
        pagePath,
        durationSec: (Date.now() - sessionStartRef.current) / 1000,
        maxScrollPercent: maxScrollPercentRef.current,
      });
    };
  }, [pagePath, pathname]);

  return null;
}

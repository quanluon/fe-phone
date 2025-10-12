/**
 * Server-side fetch utilities with proper error handling for Vercel deployment
 */

interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

/**
 * Safe server-side fetch with timeout and error handling
 */
export async function safeServerFetch<T = unknown>(
  url: string,
  options: RequestInit & FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  const { timeout = 5000, retries = 0, ...fetchOptions } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Remove Next.js specific options for server-side fetch
      const { next: _, ...cleanFetchOptions } = fetchOptions;
      
      const response = await fetch(url, {
        ...cleanFetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...cleanFetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        return {
          data: null,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: unknown) {
      const isLastAttempt = attempt === retries;
      
      if (error instanceof Error && error.name === 'AbortError') {
        const errorMsg = `Request timeout after ${timeout}ms`;
        if (isLastAttempt) {
          return { data: null, error: errorMsg };
        }
        console.warn(`${errorMsg}, retrying... (attempt ${attempt + 1}/${retries + 1})`);
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Unknown fetch error';
        if (isLastAttempt) {
          return { data: null, error: errorMsg };
        }
        console.warn(`Fetch error: ${errorMsg}, retrying... (attempt ${attempt + 1}/${retries + 1})`);
      }

      // Wait before retry (exponential backoff)
      if (!isLastAttempt) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  return { data: null, error: 'Max retries exceeded' };
}

/**
 * Get API base URL with validation
 */
export function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL not set, using fallback');
    return 'http://localhost:3001';
  }

  // Remove trailing slash and /api if present
  const cleanUrl = apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  return cleanUrl;
}

/**
 * Build API URL safely
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Check if we're running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're running on Vercel
 */
export function isVercel(): boolean {
  return !!process.env.VERCEL;
}

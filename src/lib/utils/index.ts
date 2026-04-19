import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Product, ProductVariant } from '@/types';
import { logger } from './logger';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format price with discount
export function formatPrice(price: number, originalPrice?: number): string {
  if (originalPrice && originalPrice > price) {
    return `${formatCurrency(price)} ${formatCurrency(originalPrice)}`;
  }
  return formatCurrency(price);
}

// Calculate discount percentage
export function calculateDiscount(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  set: (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage error
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Zustand persist storage adapter for SSR compatibility
export const createPersistStorage = () => {
  return {
    getItem: (name: string) => {
      if (typeof window === 'undefined') return null;
      try {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: unknown): void => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch {
        // Handle storage error silently
      }
    },
    removeItem: (name: string): void => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(name);
      } catch {
        // Handle storage error silently
      }
    },
  };
};

// Session storage helpers
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  set: (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage error
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(key);
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.clear();
  },
};

// URL helpers
export function buildUrl(baseUrl: string, params: Record<string, unknown>): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

// Image helpers
export function getImageUrl(imagePath: string): string {
  return imagePath;
  
  // if (imagePath.startsWith('http')) {
  //   return imagePath;
  // }
  // return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imagePath}`;
}

const LOW_QUALITY_IMAGE_PATTERN =
  /(thumb|thumbnail|small|swatch|icon|sprite|tiny|preview|placeholder|blur|low[\-_]?res|low[\-_]?quality)/i;
const HIGH_QUALITY_IMAGE_PATTERN =
  /(original|master|zoom|large|hi[\-_]?res|high[\-_]?res|retina|full[\-_]?size|gallery)/i;

function scoreImageCandidate(imageUrl: string, index: number): number {
  let score = Math.max(0, 100 - index);

  if (HIGH_QUALITY_IMAGE_PATTERN.test(imageUrl)) {
    score += 40;
  }

  if (LOW_QUALITY_IMAGE_PATTERN.test(imageUrl)) {
    score -= 90;
  }

  const sizeMatches = [...imageUrl.matchAll(/(\d{2,4})[xX](\d{2,4})/g)];
  for (const match of sizeMatches) {
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!Number.isNaN(width) && !Number.isNaN(height)) {
      score += Math.min(width, height) / 20;
    }
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const widthHints = ['w', 'width', 'wid', 'imwidth'];
    for (const key of widthHints) {
      const rawValue = parsedUrl.searchParams.get(key);
      const width = Number(rawValue);
      if (!Number.isNaN(width) && width > 0) {
        score += Math.min(width, 2000) / 20;
      }
    }
  } catch {
    // Ignore malformed URLs and keep string-based scoring only.
  }

  return score;
}

function dedupeImageUrls(images: string[]): string[] {
  return [...new Set(images.filter(Boolean))];
}

function rankImageUrls(images: string[]): string[] {
  return dedupeImageUrls(images).sort(
    (left, right) => scoreImageCandidate(right, 0) - scoreImageCandidate(left, 0),
  );
}

export function getPrimaryVariant(product?: Product | null): ProductVariant | null {
  if (!product?.variants?.length) {
    return null;
  }

  return (
    product.variants.find((variant) => variant.isActive && variant.stock > 0) ||
    product.variants[0] ||
    null
  );
}

export function shouldHideProductPrice(
  product?: Product | null,
  variant?: Partial<ProductVariant> | null,
): boolean {
  if (!product) {
    return false;
  }

  if (product.isHiddenPrice) {
    return true;
  }

  const targetVariant = variant || getPrimaryVariant(product);
  return (targetVariant?.price ?? product.basePrice ?? 0) <= 0;
}

export function getProductDisplayImages(
  product?: Product | null,
  variant?: Partial<ProductVariant> | null,
): string[] {
  const primaryVariant = variant || getPrimaryVariant(product);
  const rankedVariantImages = rankImageUrls(primaryVariant?.images || []);
  const rankedProductImages = rankImageUrls(product?.images || []);

  return dedupeImageUrls([...rankedVariantImages, ...rankedProductImages]);
}

export function getProductCardImage(
  product?: Product | null,
  variant?: Partial<ProductVariant> | null,
): string {
  return getProductDisplayImages(product, variant)[0] || DEFAULT_IMAGE;
}

// Default placeholder image path
export const DEFAULT_IMAGE = '/images/placeholder.svg';

// Handle image error by setting src to default placeholder
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const img = event.currentTarget;
  
  // Prevent infinite loops and repeated error handling
  if (img.dataset.errorHandled === 'true') {
    return;
  }
  
  // Mark as error handled to prevent repeated processing
  img.dataset.errorHandled = 'true';
  
  // Only set placeholder if it's not already the placeholder
  if (img.src !== DEFAULT_IMAGE && !img.src.includes('placeholder.svg')) {
    try {
      img.src = DEFAULT_IMAGE;
    } catch (error) {
      // If even the placeholder fails, hide the image element
      logger.warn({ error }, 'Failed to load placeholder image');
      img.style.display = 'none';
    }
  }
  
  // Stop event propagation to prevent further error handling
  event.stopPropagation();
  event.preventDefault();
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Date helpers
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Array helpers
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

// Error helpers
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/too-many-requests': 'Bạn đã thử quá nhiều lần trong thời gian ngắn. Vui lòng chờ một lúc rồi thử lại.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại và thử lại.',
  'auth/wrong-password': 'Mật khẩu không đúng. Vui lòng thử lại.',
  'auth/user-not-found': 'Không tìm thấy tài khoản với email này.',
  'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.',
  'auth/invalid-email': 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.',
  'auth/email-already-in-use': 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
  'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn.',
  'auth/network-request-failed': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.',
  'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất.',
  'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép popup và thử lại.',
  'auth/cancelled-popup-request': 'Yêu cầu đăng nhập trước đó đã bị hủy. Vui lòng thử lại.',
  'auth/account-exists-with-different-credential':
    'Email này đã tồn tại với một phương thức đăng nhập khác. Vui lòng dùng đúng phương thức đã đăng ký trước đó.',
  'auth/operation-not-allowed': 'Phương thức đăng nhập này hiện chưa được bật. Vui lòng liên hệ quản trị viên.',
  'auth/requires-recent-login': 'Vui lòng đăng nhập lại rồi thử thực hiện thao tác này.',
  'auth/invalid-action-code': 'Liên kết hoặc mã xác nhận không còn hợp lệ. Vui lòng yêu cầu lại.',
  'auth/expired-action-code': 'Liên kết hoặc mã xác nhận đã hết hạn. Vui lòng yêu cầu lại.',
  'auth/missing-password': 'Vui lòng nhập mật khẩu.',
  'auth/missing-email': 'Vui lòng nhập email.',
};

function extractAuthErrorCode(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  if ('code' in error && typeof error.code === 'string' && error.code.startsWith('auth/')) {
    return error.code;
  }

  if ('message' in error && typeof error.message === 'string') {
    const matchedCode = error.message.match(/auth\/[a-z-]+/i);
    if (matchedCode?.[0]) {
      return matchedCode[0].toLowerCase();
    }
  }

  return null;
}

function getFriendlyAuthErrorMessage(error: unknown): string | null {
  const errorCode = extractAuthErrorCode(error);
  if (!errorCode) {
    return null;
  }

  return AUTH_ERROR_MESSAGES[errorCode] || null;
}

export function getErrorMessage(error: unknown,defaultMessage: string = 'An unexpected error occurred'): string {
  const friendlyAuthMessage = getFriendlyAuthErrorMessage(error);
  if (friendlyAuthMessage) {
    return friendlyAuthMessage;
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as { response?: { data?: { message?: string } } };
    if (errorWithResponse.response?.data?.message) {
      const backendMessage = errorWithResponse.response.data.message;
      const matchedCode = backendMessage.match(/auth\/[a-z-]+/i)?.[0]?.toLowerCase();

      if (matchedCode && AUTH_ERROR_MESSAGES[matchedCode]) {
        return AUTH_ERROR_MESSAGES[matchedCode];
      }

      return backendMessage;
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message?: string };
    if (errorWithMessage.message) {
      return errorWithMessage.message;
    }
  }
  return defaultMessage;
}

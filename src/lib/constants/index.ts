import { 
  ShoppingCartIcon, 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon, 
  DeviceTabletIcon,
  ClockIcon,
  SpeakerWaveIcon,
  TvIcon,
  PuzzlePieceIcon,
  HomeIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  HeartIcon as HeartOutlineIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Navigation items
export const NAV_ITEMS = [
  { label: 'Top Popular', href: '/products?sortBy=created_at_desc' },
  // { label: 'Flash Sale', href: '/products?isFeatured=true' },
  // { label: 'TV & Video', href: '/products?productType=accessories' },
  { label: 'Cell Phone', href: '/products?productType=iphone' },
  { label: 'iPad & Tablets', href: '/products?productType=ipad' },
  // { 
  //   label: 'Pages', 
  //   href: '/pages',
  //   children: [
  //     { label: 'About Us', href: '/about' },
  //     { label: 'Contact', href: '/contact' },
  //     { label: 'FAQ', href: '/faq' },
  //     { label: 'Privacy Policy', href: '/privacy' },
  //     { label: 'Terms of Service', href: '/terms' },
  //   ]
  // },
  // { 
  //   label: 'Blogs', 
  //   href: '/blogs',
  //   children: [
  //     { label: 'Latest News', href: '/blogs' },
  //     { label: 'Tech Reviews', href: '/blogs/tech-reviews' },
  //     { label: 'Product Guides', href: '/blogs/guides' },
  //   ]
  // },
];


// Product type labels
export const PRODUCT_TYPE_LABELS = {
  iphone: 'iPhone',
  ipad: 'iPad',
  imac: 'iMac',
  macbook: 'MacBook',
  watch: 'Apple Watch',
  airpods: 'AirPods',
  accessories: 'Accessories',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

// Pagination
export const PAGINATION_LIMITS = [12, 24, 48, 96];

// Default pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND', symbol: '₫' },
  { value: 'USD', label: 'USD', symbol: '$' },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

// Country options
export const COUNTRY_OPTIONS = [
  { value: 'VN', label: 'Vietnam' },
  { value: 'US', label: 'United States' },
];

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Common icons
export const ICONS = {
  cart: ShoppingCartIcon,
  user: UserIcon,
  search: MagnifyingGlassIcon,
  menu: Bars3Icon,
  close: XMarkIcon,
  chevronDown: ChevronDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  star: StarIcon,
  heart: HeartIcon,
  heartOutline: HeartOutlineIcon,
  bag: ShoppingBagIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  trash: TrashIcon,
  eye: EyeIcon,
  share: ShareIcon,
  check: CheckIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  error: XCircleIcon,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation durations
export const ANIMATION_DURATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

// Z-index values
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

// API endpoints
export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  brands: '/api/brands',
  auth: {
    login: '/auth',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  cart: 'cart-storage',
  wishlist: 'wishlist-storage',
  auth: 'auth-storage',
  ui: 'ui-storage',
};

// Validation rules
export const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },
  phone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number',
    },
  },
};

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied.',
  notFound: 'The requested resource was not found.',
  serverError: 'Internal server error. Please try again later.',
  validation: 'Please check your input and try again.',
  generic: 'Something went wrong. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  login: 'Login successful!',
  register: 'Registration successful!',
  logout: 'Logout successful!',
  profileUpdate: 'Profile updated successfully!',
  passwordChange: 'Password changed successfully!',
  itemAddedToCart: 'Item added to cart!',
  itemRemovedFromCart: 'Item removed from cart!',
  itemAddedToWishlist: 'Item added to wishlist!',
  itemRemovedFromWishlist: 'Item removed from wishlist!',
};

// Promotional messages
export const PROMOTIONAL_MESSAGES = {
  freeDelivery: 'Get free delivery on orders over $100',
  flashSale: 'Flash Sale - Limited Time Offer!',
  newArrivals: 'Check out our latest products!',
  bestSellers: 'These top picks are flying off the shelves!',
};

// Social media links
export const SOCIAL_LINKS ={}
//  {
//   facebook: 'https://facebook.com',
//   instagram: 'https://instagram.com',
//   youtube: 'https://youtube.com',
// };

// Contact information
export const CONTACT_INFO = {
  name: 'NC Mobile',
  title: 'NC Mobile - Apple Products & Accessories',
  email: 'ncmobile@support.com',
  phone: '+1 (555) 123-4567',
  address: '123 Commerce Street, Business City, BC 12345',
  hours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
};

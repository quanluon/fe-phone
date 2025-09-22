import { AxiosError } from "axios";

// API Response Types
export type ApiErrorResponse = AxiosError<{ message?: string }> 
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Product Types
export interface ProductAttribute {
  name: string;
  value: string;
  unit?: string;
  category?: string; // e.g., "Display", "Performance", "Camera", etc.
}

export interface ProductVariant {
  _id: string;
  name: string;
  color: string;
  colorCode: string;
  storage?: string;
  size?: string;
  connectivity?: string;
  simType?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  attributes: ProductAttribute[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string; // Rich text content (HTML)
  shortDescription?: string; // Plain text
  category: Category;
  brand: Brand;
  productType: ProductType;
  variants: ProductVariant[];
  basePrice: number;
  originalBasePrice?: number;
  images: string[];
  features: string[];
  attributes: ProductAttribute[]; // Structured attributes
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ProductType {
  IPHONE = "iphone",
  IPAD = "ipad",
  IMAC = "imac",
  MACBOOK = "macbook",
  WATCH = "watch",
  AIRPODS = "airpods",
  ACCESSORIES = "accessories",
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
}

// Brand Types
export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart Validation Types
export interface CartValidationError {
  type: "insufficient_stock" | "out_of_stock" | "invalid_quantity";
  message: string;
  currentStock: number;
  requestedQuantity: number;
  currentCartQuantity?: number;
}

export interface CartValidationResult {
  isValid: boolean;
  error?: CartValidationError;
  maxAllowedQuantity: number;
}

// User Types
export interface User {
  _id: string;
  cognitoId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  type: "customer" | "admin";
  status: "active" | "inactive" | "suspended";
  profileImage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthUser {
  _id: string;
  cognitoId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  fullName?: string;
  type: "customer" | "admin";
  status: "active" | "inactive" | "suspended";
  profileImage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  brand?: string;
  productType?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  storage?: string;
  size?: string;
  search?: string;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc"
    | "created_at_desc";
  isFeatured?: boolean;
  isNew?: boolean;
}

// API Query Types
export interface ProductQuery extends ProductFilters {
  page?: number;
  limit?: number;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
  onAddToWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export interface CategoryCardProps {
  category: Category;
  icon?: React.ReactNode;
  onClick?: () => void;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  icon?: React.ReactNode;
}

// Theme Types
export type Theme = "light" | "dark";

// Language Types
export type Language = "en" | "vi";

// Currency Types
export type Currency = "USD" | "VND";

// Country Types
export type Country = "US" | "VN";

// Auth Types
export interface AuthUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Order Types
export interface OrderItem {
  product: Product;
  variant?: Partial<ProductVariant>
  quantity: number;
  price: number;
  originalPrice?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name?: string;
    email?: string;
    phone: string;
    userId?: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode?: string;
  };
  notes?: string;
  totalAmount: number;
  originalTotalAmount?: number;
  discountAmount?: number;
  shippingFee?: number;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface CreateOrderRequest {
  customer: {
    name?: string;
    email?: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode?: string;
  };
  notes?: string;
  paymentMethod?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Hero Types
export * from "./hero";

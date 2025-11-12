export type UserRole = 'customer' | 'reseller' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role: UserRole;
  password?: string; // For simulation
  walletBalance?: number;
  savedShippingInfo?: ShippingInfo;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string; // User ID of the reseller
  logoUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Changed from imageUrl to support a gallery
  category: string;
  storeId: string; // Link to the store
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
}

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

export interface Advertisement {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}

// New Types for Order Management
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'Online' | 'Bank' | 'Wallet';

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string; // This will store the primary image for the order
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO Date string
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  discountAmount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO Date string
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO Date string
}

// New Types for Wallet Transactions
export type WalletTransactionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface WalletTransaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  status: WalletTransactionStatus;
  createdAt: string; // ISO Date string
}

export interface ValueProposition {
  id: string;
  icon: 'Gift' | 'ShieldCheck' | 'Truck';
  title: string;
  description: string;
}

export type ResellerApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ResellerApplication {
  id: string;
  userId: string;
  userEmail: string;
  reason: string;
  status: ResellerApplicationStatus;
  createdAt: string; // ISO Date string
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  authorImageUrl: string;
  link: string;
}
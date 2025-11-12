import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Product, CartItem, User, Store, CarouselSlide, Advertisement, UserRole, Order, OrderStatus, OrderItem, ShippingInfo, PaymentMethod, Review, Announcement, WalletTransaction, WalletTransactionStatus, ValueProposition, Article, Coupon } from '../types';
import toast from 'react-hot-toast';

// --- API SIMULATION ---
const simulateApiCall = (delay = 700): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

const TAX_RATE = 0.04; // 4% tax/service fee

// --- MOCK DATA ---
const mockUsers: User[] = [
  { id: 'user-1', email: 'admin@luxe.com', firstName: 'Admin', lastName: 'User', password: 'password', role: 'admin', walletBalance: 1000 },
  { id: 'user-2', email: 'reseller@luxe.com', firstName: 'Reseller', lastName: 'User', password: 'password', role: 'reseller', walletBalance: 50 },
  { id: 'user-3', email: 'customer@luxe.com', firstName: 'Customer', lastName: 'User', password: 'password', role: 'customer', walletBalance: 150.75 },
  { id: 'user-4', email: 'storeowner@luxe.com', firstName: 'Store', lastName: 'Owner', password: 'password', role: 'reseller', walletBalance: 200 },
];

const mockStores: Store[] = [
  { id: 'store-1', name: 'Gadget Grove', description: 'The best gadgets from the future.', ownerId: 'user-2', logoUrl: 'https://picsum.photos/seed/logo1/200' },
  { id: 'store-2', name: 'Innovate & Create', description: 'Unique tools for the modern creator.', ownerId: 'user-4', logoUrl: 'https://picsum.photos/seed/logo2/200' },
];

const mockProducts: Product[] = [
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Grove Gadget ${i + 1}`,
    description: `A futuristic gadget from Gadget Grove. Item ${i + 1} has amazing features. Explore its capabilities and elevate your daily life with cutting-edge technology.`,
    price: parseFloat((Math.random() * (200 - 20) + 20).toFixed(2)),
    imageUrls: [
      `https://picsum.photos/seed/g${i + 1}/600/600`,
      `https://picsum.photos/seed/g${i + 1}a/600/600`,
      `https://picsum.photos/seed/g${i + 1}b/600/600`,
      `https://picsum.photos/seed/g${i + 1}c/600/600`,
    ],
    category: 'Electronics',
    storeId: 'store-1',
  })),
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `prod-${i + 29}`,
    name: `Creator Tool ${i + 1}`,
    description: `An innovative tool from Innovate & Create. Perfect for creators looking to push the boundaries of their work. High-quality materials and ergonomic design.`,
    price: parseFloat((Math.random() * (300 - 40) + 40).toFixed(2)),
    imageUrls: [
      `https://picsum.photos/seed/c${i + 1}/600/600`,
      `https://picsum.photos/seed/c${i + 1}a/600/600`,
      `https://picsum.photos/seed/c${i + 1}b/600/600`,
    ],
    category: 'Lifestyle',
    storeId: 'store-2',
  })),
];

const mockCarousel: CarouselSlide[] = [
  { id: 'slide-1', imageUrl: 'https://picsum.photos/seed/carousel1/1600/600', title: 'Unleash Your Potential', subtitle: 'Discover our new collection of performance-enhancing gadgets.', buttonText: 'Shop Now', link: '/products' },
  { id: 'slide-2', imageUrl: 'https://picsum.photos/seed/carousel2/1600/600', title: 'Elegance in Simplicity', subtitle: 'Minimalist designs that complement your modern lifestyle.', buttonText: 'Explore Designs', link: '/products' },
  { id: 'slide-3', imageUrl: 'https://picsum.photos/seed/carousel3/1600/600', title: 'Limited Time Offer', subtitle: 'Get up to 40% off on select items. Don\'t miss out!', buttonText: 'View Deals', link: '/products' },
];

const mockAds: Advertisement[] = [
  { id: 'ad-1', imageUrl: 'https://picsum.photos/seed/ad1/800/400', title: 'Summer Sale Spectacle!', link: '/products' },
  { id: 'ad-2', imageUrl: 'https://picsum.photos/seed/ad2/800/400', title: 'New Arrivals: Future-Proof Your Life', link: '/products' },
];

const mockReviews: Review[] = [
    { id: 'rev-1', productId: 'prod-1', userId: 'user-3', userName: 'customer@luxe.com', rating: 5, comment: 'Absolutely fantastic! Best gadget I have ever owned. Highly recommend to everyone.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'rev-2', productId: 'prod-1', userId: 'user-4', userName: 'storeowner@luxe.com', rating: 4, comment: 'Great product, works as expected. Shipping was fast too.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockAnnouncements: Announcement[] = [
    { id: 'ann-1', title: 'Scheduled Maintenance Alert!', content: 'Our platform will be undergoing scheduled maintenance on Sunday at 2 AM. We expect downtime to be minimal. Thank you for your understanding.', createdAt: new Date().toISOString() },
];

const mockWalletTransactions: WalletTransaction[] = [
    { id: 'txn-1', userId: 'user-3', userEmail: 'customer@luxe.com', amount: 50, status: 'Approved', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'txn-2', userId: 'user-3', userEmail: 'customer@luxe.com', amount: 25, status: 'Pending', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'txn-3', userId: 'user-2', userEmail: 'reseller@luxe.com', amount: 100, status: 'Rejected', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockValuePropositions: ValueProposition[] = [
  { id: 'vp-1', icon: 'Gift', title: 'Curated Excellence', description: 'Every item is hand-picked for its quality and design.' },
  { id: 'vp-2', icon: 'ShieldCheck', title: 'Secure Payments', description: 'Your transactions are safe with our encrypted checkout.' },
  { id: 'vp-3', icon: 'Truck', title: 'Fast Shipping', description: 'Get your order delivered to your doorstep in no time.' },
];

const mockArticles: Article[] = [
  { id: 'art-1', title: 'The Future of Smart Home Gadgets', excerpt: 'Explore the trends that are shaping the way we interact with our homes, from AI assistants to automated living.', imageUrl: 'https://picsum.photos/seed/art1/600/400', author: 'Jane Doe', authorImageUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026704d', link: '#' },
  { id: 'art-2', title: 'Minimalism in Tech: Less is More', excerpt: 'How minimalist design principles are influencing the latest technology, leading to cleaner, more intuitive devices.', imageUrl: 'https://picsum.photos/seed/art2/600/400', author: 'John Smith', authorImageUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026704e', link: '#' },
  { id: 'art-3', title: 'A Guide to Choosing Your Next Creator Tool', excerpt: 'Finding the right tools can be tough. Here are our top tips for creative professionals looking to upgrade their kit.', imageUrl: 'https://picsum.photos/seed/art3/600/400', author: 'Emily White', authorImageUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026704f', link: '#' },
];

const mockCoupons: Coupon[] = [
    { id: 'coupon-1', code: 'SAVE10', discountType: 'percentage', discountValue: 10, isActive: true },
    { id: 'coupon-2', code: '5OFF', discountType: 'fixed', discountValue: 5, isActive: true },
    { id: 'coupon-3', code: 'SUMMER24', discountType: 'percentage', discountValue: 15, isActive: false },
];


interface AppContextType {
  isLoading: boolean;
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;
  
  // Auth
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; firstName: string; middleName: string; lastName: string; }) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateShippingInfo: (shippingInfo: ShippingInfo) => Promise<void>;
  updateProfile: (profileData: { firstName: string; middleName: string; lastName: string; }) => Promise<void>;
  
  // Wallet
  walletTransactions: WalletTransaction[];
  requestWalletFunds: (amount: number) => Promise<void>;
  approveWalletTransaction: (transactionId: string) => Promise<void>;
  rejectWalletTransaction: (transactionId: string) => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  
  // Stores
  stores: Store[];
  addStore: (store: Omit<Store, 'id'>) => Promise<void>;
  createStore: (storeData: Omit<Store, 'id' | 'ownerId'>) => Promise<void>;
  updateStore: (storeData: Store) => Promise<void>;
  
  // Carousel
  carouselSlides: CarouselSlide[];
  addCarouselSlide: (slide: Omit<CarouselSlide, 'id'>) => Promise<void>;
  updateCarouselSlide: (slide: CarouselSlide) => Promise<void>;
  deleteCarouselSlide: (slideId: string) => Promise<void>;

  // Ads
  advertisements: Advertisement[];
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => Promise<void>;
  updateAdvertisement: (ad: Advertisement) => Promise<void>;
  deleteAdvertisement: (adId: string) => Promise<void>;

  // Orders
  orders: Order[];
  placeOrder: (shippingInfo: ShippingInfo, paymentMethod: PaymentMethod, saveInfo: boolean) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  // Homepage Content
  valuePropositions: ValueProposition[];
  articles: Article[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
  }
  return defaultValue;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // State Initialization
  const [users, setUsers] = useState<User[]>(() => getInitialState('luxe_users', mockUsers));
  const [user, setUser] = useState<User | null>(() => getInitialState('luxe_user', null));
  const [products, setProducts] = useState<Product[]>(() => getInitialState('luxe_products', mockProducts));
  const [stores, setStores] = useState<Store[]>(() => getInitialState('luxe_stores', mockStores));
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState('luxe_cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => getInitialState('luxe_wishlist', []));
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(() => getInitialState('luxe_carousel', mockCarousel));
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => getInitialState('luxe_ads', mockAds));
  const [orders, setOrders] = useState<Order[]>(() => getInitialState('luxe_orders', []));
  const [reviews, setReviews] = useState<Review[]>(() => getInitialState('luxe_reviews', mockReviews));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getInitialState('luxe_announcements', mockAnnouncements));
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => getInitialState('luxe_wallet_txns', mockWalletTransactions));
  const [valuePropositions] = useState<ValueProposition[]>(() => getInitialState('luxe_value_propositions', mockValuePropositions));
  const [articles] = useState<Article[]>(() => getInitialState('luxe_articles', mockArticles));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getInitialState('luxe_coupons', mockCoupons));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getInitialState('luxe_applied_coupon', null));


  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate a 1.5 second load time
    return () => clearTimeout(timer);
  }, []);

  // localStorage Effects
  useEffect(() => { localStorage.setItem('luxe_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('luxe_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('luxe_stores', JSON.stringify(stores)); }, [stores]);
  useEffect(() => { localStorage.setItem('luxe_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('luxe_carousel', JSON.stringify(carouselSlides)); }, [carouselSlides]);
  useEffect(() => { localStorage.setItem('luxe_ads', JSON.stringify(advertisements)); }, [advertisements]);
  useEffect(() => { localStorage.setItem('luxe_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('luxe_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('luxe_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('luxe_wallet_txns', JSON.stringify(walletTransactions)); }, [walletTransactions]);
  useEffect(() => { localStorage.setItem('luxe_value_propositions', JSON.stringify(valuePropositions)); }, [valuePropositions]);
  useEffect(() => { localStorage.setItem('luxe_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('luxe_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => {
    if (appliedCoupon) localStorage.setItem('luxe_applied_coupon', JSON.stringify(appliedCoupon));
    else localStorage.removeItem('luxe_applied_coupon');
  }, [appliedCoupon]);
  useEffect(() => {
    if (user) localStorage.setItem('luxe_user', JSON.stringify(user));
    else localStorage.removeItem('luxe_user');
  }, [user]);

  // --- METHODS ---
  
  const login = async (email: string, password: string): Promise<boolean> => {
    await simulateApiCall();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.firstName || foundUser.email}!`);
      return true;
    }
    toast.error('Invalid credentials.');
    return false;
  };

  const register = async (userData: { email: string, password: string, firstName: string, middleName: string, lastName: string }): Promise<boolean> => {
    await simulateApiCall();
    const { email, password, firstName, middleName, lastName } = userData;
    if (users.some(u => u.email === email)) {
        toast.error('An account with this email already exists.');
        return false;
    }
    const newUser: User = { 
        id: crypto.randomUUID(), 
        email, 
        password, 
        firstName, 
        middleName, 
        lastName, 
        role: 'customer', 
        walletBalance: 50 
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    toast.success(`Welcome, ${firstName}! Your account has been created.`);
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.success('You have been logged out.');
  };
  
  const addUser = async (userData: Omit<User, 'id'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    if (users.some(u => u.email === userData.email)) {
        toast.error('An account with this email already exists.');
        return;
    }
    const newUser: User = { ...userData, id: crypto.randomUUID() };
    setUsers(prev => [newUser, ...prev]);
    toast.success(`User ${userData.email} created.`);
  };

  const updateUser = async (updatedUser: User) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast.success(`User ${updatedUser.email} updated.`);
  };

  const deleteUser = async (userId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    if (user?.id === userId) { toast.error("You cannot delete your own account."); return; }
    
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.role === 'reseller') {
        const storeToDelete = stores.find(s => s.ownerId === userId);
        if (storeToDelete) {
            setProducts(prev => prev.filter(p => p.storeId !== storeToDelete.id));
            setStores(prev => prev.filter(s => s.id !== storeToDelete.id));
        }
    }

    setReviews(prev => prev.map(r => r.userId === userId ? { ...r, userId: 'deleted-user', userName: '[Deleted User]' } : r));
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.error(`User ${userToDelete.email} and all associated data removed.`);
  };

  const updateProfile = async (profileData: { firstName: string; middleName: string; lastName: string; }) => {
    await simulateApiCall();
    if (!user) {
        toast.error("You must be logged in to update your profile.");
        return;
    }

    const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
    };

    setUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => (u.id === user.id ? updatedUser : u)));
    toast.success("Profile updated successfully!");
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    await simulateApiCall();
    if (!user) {
      toast.error("You must be logged in.");
      return false;
    }
    if (user.password !== currentPassword) {
      toast.error("Current password does not match.");
      return false;
    }
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    toast.success("Password updated successfully.");
    return true;
  };

  const updateShippingInfo = async (shippingInfo: ShippingInfo) => {
    await simulateApiCall();
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    const updatedUser = { ...user, savedShippingInfo: shippingInfo };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    toast.success("Shipping information saved.");
  };

  const requestWalletFunds = async (amount: number) => {
    await simulateApiCall();
    if (!user) { toast.error("You must be logged in."); return; }
    const newTransaction: WalletTransaction = {
        id: crypto.randomUUID(),
        userId: user.id,
        userEmail: user.email,
        amount,
        status: 'Pending',
        createdAt: new Date().toISOString(),
    };
    setWalletTransactions(prev => [newTransaction, ...prev]);
    toast.success(`₱${amount.toFixed(2)} funding request submitted for admin approval.`);
  };

  const approveWalletTransaction = async (transactionId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const transaction = walletTransactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status !== 'Pending') { toast.error("Transaction not found or already handled."); return; }

    setWalletTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'Approved' } : t));

    setUsers(prevUsers => {
        return prevUsers.map(u => {
            if (u.id === transaction.userId) {
                const updatedUser = { ...u, walletBalance: (u.walletBalance || 0) + transaction.amount };
                if(user && user.id === transaction.userId) {
                  setUser(updatedUser);
                }
                return updatedUser;
            }
            return u;
        });
    });
    toast.success(`Transaction approved. ₱${transaction.amount.toFixed(2)} added to ${transaction.userEmail}.`);
  };

  const rejectWalletTransaction = async (transactionId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setWalletTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'Rejected' } : t));
    toast.error("Transaction has been rejected.");
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    await simulateApiCall();
    const canAdd = user?.role === 'admin' || user?.role === 'reseller';
    if (!canAdd) { toast.error("You don't have permission to add products."); return; }
    const newProduct: Product = { ...productData, id: crypto.randomUUID() };
    setProducts(prev => [newProduct, ...prev]);
    toast.success(`${newProduct.name} added!`);
  };

  const updateProduct = async (updatedProduct: Product) => {
    await simulateApiCall();
    const canUpdate = user?.role === 'admin' || (user?.role === 'reseller' && stores.find(s => s.id === updatedProduct.storeId)?.ownerId === user.id);
    if (!canUpdate) { toast.error("Permission denied."); return; }
    
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setCart(prevCart => prevCart.map(item => item.id === updatedProduct.id ? { ...item, ...updatedProduct, quantity: item.quantity } : item ));
    toast.success(`${updatedProduct.name} updated!`);
  };

  const deleteProduct = async (productId: string) => {
    await simulateApiCall();
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;
    const canDelete = user?.role === 'admin' || (user?.role === 'reseller' && stores.find(s => s.id === productToDelete.storeId)?.ownerId === user.id);
    if (!canDelete) { toast.error("Permission denied."); return; }
    
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.id !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
    toast.error(`Product ${productToDelete.name} removed!`);
  };

  const addStore = async (storeData: Omit<Store, 'id'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const newStore: Store = { ...storeData, id: crypto.randomUUID() };
    setStores(prev => [newStore, ...prev]);
    toast.success(`Store "${newStore.name}" created!`);
  };

  const createStore = async (storeData: Omit<Store, 'id' | 'ownerId'>) => {
    await simulateApiCall();
    if (!user || user.role !== 'reseller') { toast.error("Only resellers can create stores."); return; }
    if (stores.some(s => s.ownerId === user.id)) { toast.error("You can only own one store."); return; }
    const newStore: Store = { ...storeData, id: crypto.randomUUID(), ownerId: user.id };
    setStores(prev => [...prev, newStore]);
    toast.success(`Store "${newStore.name}" created!`);
  };

  const updateStore = async (updatedStore: Store) => {
    await simulateApiCall();
    const canUpdate = user?.role === 'admin' || (user?.id === updatedStore.ownerId);
    if (!canUpdate) { toast.error("Permission denied."); return; }
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    toast.success(`Store "${updatedStore.name}" updated.`);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const isProductInWishlist = wishlist.includes(product.id);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        toast.success(`${product.name} quantity updated in cart.`);
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        toast.success(`${product.name} ${isProductInWishlist ? 'moved from wishlist to' : 'added to'} cart.`);
        return [...prevCart, { ...product, quantity }];
      }
    });
    if (isProductInWishlist) {
      setWishlist(prevWishlist => prevWishlist.filter(id => id !== product.id));
    }
  };
  const removeFromCart = async (productId: string) => { 
    await simulateApiCall();
    setCart(prevCart => prevCart.filter(item => item.id !== productId)); 
    toast.error(`Item removed from cart.`); 
  };
  const updateCartQuantity = (productId: string, quantity: number) => { 
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item));
      }
  };
  const clearCart = () => { 
    setCart([]); 
    setAppliedCoupon(null);
  };
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to wishlist!');
        return [...prev, productId];
      }
    });
  };
  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addCarouselSlide = async (slide: Omit<CarouselSlide, 'id'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const newSlide = { ...slide, id: crypto.randomUUID() };
    setCarouselSlides(prev => [newSlide, ...prev]);
    toast.success("New carousel slide added.");
  };
  const updateCarouselSlide = async (updatedSlide: CarouselSlide) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setCarouselSlides(prev => prev.map(s => s.id === updatedSlide.id ? updatedSlide : s));
    toast.success("Carousel slide updated.");
  };
  const deleteCarouselSlide = async (slideId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setCarouselSlides(prev => prev.filter(s => s.id !== slideId));
    toast.error("Carousel slide removed.");
  };

  const addAdvertisement = async (ad: Omit<Advertisement, 'id'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const newAd = { ...ad, id: crypto.randomUUID() };
    setAdvertisements(prev => [newAd, ...prev]);
    toast.success("New advertisement added.");
  };
  const updateAdvertisement = async (updatedAd: Advertisement) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setAdvertisements(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
    toast.success("Advertisement updated.");
  };
  const deleteAdvertisement = async (adId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setAdvertisements(prev => prev.filter(ad => ad.id !== adId));
    toast.error("Advertisement removed.");
  };

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    if (coupons.some(c => c.code.toUpperCase() === couponData.code.toUpperCase())) {
        toast.error('A coupon with this code already exists.');
        return;
    }
    const newCoupon: Coupon = { ...couponData, id: crypto.randomUUID(), code: couponData.code.toUpperCase() };
    setCoupons(prev => [newCoupon, ...prev]);
    toast.success(`Coupon ${newCoupon.code} created.`);
  };

  const updateCoupon = async (updatedCoupon: Coupon) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    if (coupons.some(c => c.id !== updatedCoupon.id && c.code.toUpperCase() === updatedCoupon.code.toUpperCase())) {
        toast.error('Another coupon with this code already exists.');
        return;
    }
    setCoupons(prev => prev.map(c => c.id === updatedCoupon.id ? {...updatedCoupon, code: updatedCoupon.code.toUpperCase()} : c));
    if(appliedCoupon?.id === updatedCoupon.id) {
        setAppliedCoupon(updatedCoupon);
    }
    toast.success(`Coupon ${updatedCoupon.code} updated.`);
  };

  const deleteCoupon = async (couponId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const couponToDelete = coupons.find(c => c.id === couponId);
    if (!couponToDelete) return;
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    if (appliedCoupon?.id === couponId) {
        setAppliedCoupon(null);
    }
    toast.error(`Coupon ${couponToDelete.code} removed.`);
  };

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }
    if (!coupon.isActive) {
      toast.error("This coupon is no longer active.");
      return;
    }
    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed.");
  };

  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * TAX_RATE;
  
  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0 || !appliedCoupon.isActive) return 0;
    
    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
        discount = cartSubtotal * (appliedCoupon.discountValue / 100);
    } else { // 'fixed'
        discount = appliedCoupon.discountValue;
    }
    return Math.min(discount, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);
  
  const cartTotal = cartSubtotal - cartDiscount + cartTax;

  const placeOrder = async (shippingInfo: ShippingInfo, paymentMethod: PaymentMethod, saveInfo: boolean): Promise<boolean> => {
    await simulateApiCall(1200);
    if (!user) { toast.error("You must be logged in to place an order."); return false; }
    if (cart.length === 0) { toast.error("Your cart is empty."); return false; }

    let userUpdates: Partial<User> = {};

    if (paymentMethod === 'Wallet') {
        if ((user.walletBalance || 0) < cartTotal) {
            toast.error("Insufficient wallet balance.");
            return false;
        }
        userUpdates.walletBalance = (user.walletBalance || 0) - cartTotal;
    }

    if (saveInfo) {
        userUpdates.savedShippingInfo = shippingInfo;
    }
    
    if (Object.keys(userUpdates).length > 0) {
        const updatedUser = { ...user, ...userUpdates };
        setUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => (u.id === user.id ? updatedUser : u)));
    }

    const ordersByStore = cart.reduce((acc, item) => {
      (acc[item.storeId] = acc[item.storeId] || []).push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const newOrders: Order[] = Object.entries(ordersByStore).map(([storeId, items]) => {
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id,
        name: item.name,
        imageUrl: item.imageUrls[0],
        price: item.price,
        quantity: item.quantity,
      }));
      
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * TAX_RATE;

      return {
        id: crypto.randomUUID(),
        userId: user.id,
        storeId,
        items: orderItems,
        subtotal,
        tax,
        total: subtotal + tax, // Will be recalculated
        status: 'Pending',
        createdAt: new Date().toISOString(),
        shippingInfo,
        paymentMethod,
      };
    });
    
    const totalOrderSubtotal = newOrders.reduce((acc, order) => acc + order.subtotal, 0);

    const finalNewOrders = newOrders.map(order => {
        let discountForThisOrder = 0;
        if (appliedCoupon && totalOrderSubtotal > 0) {
            const proportion = order.subtotal / totalOrderSubtotal;
            discountForThisOrder = cartDiscount * proportion;
        }
        
        return {
            ...order,
            discountAmount: discountForThisOrder,
            couponCode: appliedCoupon?.code,
            total: order.subtotal - discountForThisOrder + order.tax,
        };
    });

    setOrders(prev => [...finalNewOrders, ...prev]);
    clearCart();
    toast.success("Your order has been placed!");
    return true;
  };

  const cancelOrder = async (orderId: string) => {
    await simulateApiCall();
    const order = orders.find(o => o.id === orderId);
    if (!order) { toast.error("Order not found."); return; }
    if (order.userId !== user?.id) { toast.error("You can only cancel your own orders."); return; }
    if (order.status !== 'Pending') { toast.error("This order can no longer be cancelled."); return; }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    toast.success("Order has been cancelled.");
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await simulateApiCall();
    const order = orders.find(o => o.id === orderId);
    if (!order) { toast.error("Order not found."); return; }
    
    const storeOfOrder = stores.find(s => s.id === order.storeId);
    if (storeOfOrder?.ownerId !== user?.id) { toast.error("You can only update orders for your own store."); return; }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order status updated to ${status}.`);
  };
  
  const addReview = async (productId: string, rating: number, comment: string) => {
    await simulateApiCall();
    if (!user) { toast.error("You must be logged in to leave a review."); return; }
    if (reviews.some(r => r.productId === productId && r.userId === user.id)) {
        toast.error("You have already reviewed this product."); return;
    }
    const newReview: Review = {
        id: crypto.randomUUID(),
        productId,
        userId: user.id,
        userName: user.email,
        rating,
        comment,
        createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    toast.success("Thank you for your review!");
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    const newAnnouncement: Announcement = { ...announcementData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    toast.success("New announcement has been published.");
  };

  const updateAnnouncement = async (updatedAnnouncement: Announcement) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setAnnouncements(prev => prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
    toast.success("Announcement updated.");
  };

  const deleteAnnouncement = async (announcementId: string) => {
    await simulateApiCall();
    if (user?.role !== 'admin') { toast.error("Permission denied."); return; }
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    toast.error("Announcement removed.");
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <AppContext.Provider
      value={{
        isLoading,
        products, addProduct, updateProduct, deleteProduct,
        cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartSubtotal, cartTax, cartDiscount, cartTotal, cartCount,
        user, users, login, register, logout, addUser, updateUser, deleteUser, updateProfile, updatePassword, updateShippingInfo,
        walletTransactions, requestWalletFunds, approveWalletTransaction, rejectWalletTransaction,
        wishlist, toggleWishlist, isInWishlist, wishlistCount,
        stores, addStore, createStore, updateStore,
        carouselSlides, addCarouselSlide, updateCarouselSlide, deleteCarouselSlide,
        advertisements, addAdvertisement, updateAdvertisement, deleteAdvertisement,
        orders, placeOrder, cancelOrder, updateOrderStatus,
        reviews, addReview,
        announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
        coupons, appliedCoupon, addCoupon, updateCoupon, deleteCoupon, applyCoupon, removeCoupon,
        valuePropositions,
        articles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
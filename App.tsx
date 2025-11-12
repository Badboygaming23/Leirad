import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import WishlistPage from './pages/WishlistPage';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import ResellerDashboardPage from './pages/ResellerDashboardPage';
import StorePage from './pages/StorePage';
import MyOrdersPage from './pages/MyOrdersPage';
import MyWalletPage from './pages/MyWalletPage';
import FlashCouponBanner from './components/ui/FlashCouponBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Product, Store } from './types';
import MyProfilePage from './pages/MyProfilePage';
import AnimatedBackground from './components/ui/AnimatedBackground';
import BecomeAResellerPage from './pages/BecomeAResellerPage';
import InvoicePage from './pages/InvoicePage';

// Global Search Modal Component
const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { products, stores } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<{ products: Product[], stores: Store[] }>({ products: [], stores: [] });
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search input
    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResults({ products: [], stores: [] });
            return;
        }

        const handler = setTimeout(() => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filteredProducts = products.filter(p =>
                p.name.toLowerCase().includes(lowercasedTerm) ||
                p.description.toLowerCase().includes(lowercasedTerm)
            ).slice(0, 5);

            const filteredStores = stores.filter(s =>
                s.name.toLowerCase().includes(lowercasedTerm)
            ).slice(0, 3);

            setResults({ products: filteredProducts, stores: filteredStores });
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm, products, stores]);

    // Handle Escape key and autofocus
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'auto';
            setTimeout(() => setSearchTerm(''), 300);
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleResultClick = (path: string) => {
        onClose();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center p-4 pt-[15vh]"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-slate-100/80 backdrop-blur-lg border border-slate-200 rounded-lg shadow-2xl w-full max-w-2xl h-fit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for products or stores..."
                                className="w-full p-4 pl-12 text-lg border-b border-slate-200 bg-transparent focus:ring-0 focus:border-indigo-500 rounded-t-lg"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto">
                            {searchTerm.length < 2 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <p>Start typing to see results.</p>
                                </div>
                            ) : (results.products.length > 0 || results.stores.length > 0) ? (
                                <ul>
                                    {results.stores.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase bg-slate-50/50">Stores</li>
                                            {results.stores.map(store => (
                                                <li key={store.id} onClick={() => handleResultClick(`/store/${store.id}`)} className="px-4 py-3 flex items-center gap-4 hover:bg-slate-200/50 cursor-pointer transition-colors">
                                                    <img src={store.logoUrl} alt={store.name} className="w-10 h-10 rounded-full object-cover" />
                                                    <span className="font-medium text-slate-800">{store.name}</span>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                    {results.products.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase bg-slate-50/50 border-t">Products</li>
                                            {results.products.map(product => (
                                                <li key={product.id} onClick={() => handleResultClick(`/products/${product.id}`)} className="px-4 py-3 flex items-center gap-4 hover:bg-slate-200/50 cursor-pointer transition-colors">
                                                    <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                                    <div className="flex-grow">
                                                        <p className="font-medium text-slate-800">{product.name}</p>
                                                        <p className="text-sm text-slate-500">₱{product.price.toFixed(2)}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    <p>No results found for "{searchTerm}".</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AppProvider>
        <HashRouter>
          <AnimatedBackground />
          <div className="relative flex flex-col min-h-screen">
            <Header openSearch={() => setIsSearchOpen(true)} />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/store/:storeId" element={<StorePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute allowedRoles={['customer', 'reseller', 'admin']}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                 <Route path="/my-orders" element={
                  <ProtectedRoute allowedRoles={['customer', 'reseller', 'admin']}>
                    <MyOrdersPage />
                  </ProtectedRoute>
                } />
                 <Route path="/invoice/:orderId" element={
                  <ProtectedRoute allowedRoles={['customer', 'reseller', 'admin']}>
                    <InvoicePage />
                  </ProtectedRoute>
                } />
                <Route path="/my-wallet" element={
                  <ProtectedRoute allowedRoles={['customer', 'reseller', 'admin']}>
                    <MyWalletPage />
                  </ProtectedRoute>
                } />
                 <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['customer', 'reseller', 'admin']}>
                    <MyProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/become-a-reseller" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <BecomeAResellerPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                   <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPage />
                   </ProtectedRoute>
                } />
                <Route path="/reseller-dashboard" element={
                   <ProtectedRoute allowedRoles={['reseller']}>
                      <ResellerDashboardPage />
                   </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" reverseOrder={false} />
          <ScrollToTopButton />
          <FlashCouponBanner />
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </HashRouter>
    </AppProvider>
  );
};

export default App;
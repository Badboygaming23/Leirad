import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, Copy } from 'lucide-react';
import { Coupon } from '../../types';
import toast from 'react-hot-toast';

const FlashCouponBanner: React.FC = () => {
  const { coupons } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCoupon, setDisplayedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('couponBannerDismissed');
    if (isDismissed) {
      return;
    }

    const activeCoupons = coupons.filter(c => c.isActive);
    if (activeCoupons.length === 0) {
      return;
    }

    // Set a random timeout to show the banner
    const randomDelay = Math.random() * (30000 - 10000) + 10000; // between 10-30 seconds
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * activeCoupons.length);
      setDisplayedCoupon(activeCoupons[randomIndex]);
      setIsVisible(true);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [coupons]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('couponBannerDismissed', 'true');
  };

  const handleCopyCode = () => {
    if (displayedCoupon) {
      navigator.clipboard.writeText(displayedCoupon.code);
      toast.success('Coupon code copied!');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && displayedCoupon && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-2xl p-4 w-full max-w-sm border"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3">
              <Ticket size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Special Offer!</h4>
              <p className="text-sm text-gray-600">
                Use code <span className="font-semibold text-indigo-700">{displayedCoupon.code}</span> for a discount!
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors text-sm"
          >
            <Copy size={16} />
            Copy Code
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlashCouponBanner;
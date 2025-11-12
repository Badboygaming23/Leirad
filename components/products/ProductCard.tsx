import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Store, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, stores, reviews } = useAppContext();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(product.id);
  const store = stores.find(s => s.id === product.storeId);
  
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasMultipleImages = product.imageUrls && product.imageUrls.length > 1;

  useEffect(() => {
    // FIX: The type for setInterval's return value in a browser is `number`, not `NodeJS.Timeout`.
    let interval: number | undefined;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % product.imageUrls.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, product.imageUrls]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % product.imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };
  
  const goToImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const productReviews = reviews.filter(r => r.productId === product.id);
  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  const handleStoreClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    navigate(`/store/${product.storeId}`);
  };

  return (
    <motion.div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100/50 backdrop-blur-sm"
    >
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart size={20} className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
      </button>

      <div className="aspect-w-1 aspect-h-1 bg-slate-200 h-60 relative overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={product.imageUrls[currentImageIndex]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && hasMultipleImages && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {product.imageUrls.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={(e) => goToImage(e, index)}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white'}`} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        {store && (
          <a onClick={handleStoreClick} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline cursor-pointer z-10 relative">
            <Store size={14} />
            <span>{store.name}</span>
          </a>
        )}
        <h3 className="text-sm font-medium text-slate-900">
          <Link to={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-slate-500 truncate">{product.description}</p>
        <div className="flex flex-1 flex-col justify-end">
            <div className="flex items-center mt-1">
                {totalReviews > 0 ? (
                    <>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" />
                            ))}
                        </div>
                        <p className="ml-2 text-xs text-slate-500">{totalReviews} review{totalReviews > 1 ? 's' : ''}</p>
                    </>
                ) : (
                   <p className="text-xs text-slate-400">No reviews yet</p>
                )}
            </div>
            <p className="mt-2 text-base font-medium text-slate-900">₱{product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             addToCart(product);
           }}
           className="p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
         >
           <ShoppingCart size={20} />
         </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
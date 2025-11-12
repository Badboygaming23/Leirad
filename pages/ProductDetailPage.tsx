import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Star, Plus, Minus, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewList from '../components/reviews/ReviewList';
import ProductDetailPageSkeleton from '../components/skeletons/ProductDetailPageSkeleton';

const galleryVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, stores, addToCart, reviews, isLoading } = useAppContext();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [[page, direction], setPage] = useState([0, 0]);

  if (isLoading) {
    return <ProductDetailPageSkeleton />;
  }
  
  const product = products.find(p => p.id === id);
  const store = product ? stores.find(s => s.id === product.storeId) : null;
  
  const productReviews = product ? reviews.filter(r => r.productId === product.id) : [];
  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  if (!product) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            &larr; Back to Shop
          </Link>
        </div>
      </AnimatedPage>
    );
  }
  
  const numImages = product.imageUrls.length;
  const selectedImageIndex = ((page % numImages) + numImages) % numImages;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const goToImage = (newIndex: number) => {
    const currentIndex = ((page % numImages) + numImages) % numImages;
    const newDirection = newIndex > currentIndex ? 1 : -1;
    setPage([newIndex, newDirection]);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: product.name, path: `/products/${product.id}` }
  ];

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb crumbs={crumbs} />
      </motion.div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="relative group aspect-square w-full overflow-hidden rounded-lg bg-slate-100 shadow-lg">
              <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                      key={page}
                      src={product.imageUrls[selectedImageIndex]}
                      alt={`${product.name} view ${selectedImageIndex + 1}`}
                      className="absolute w-full h-full object-cover"
                      loading="lazy"
                      custom={direction}
                      variants={galleryVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 }}}
                  />
              </AnimatePresence>
              {product.imageUrls.length > 1 && (
                <>
                  <button onClick={() => paginate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full text-slate-800 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => paginate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full text-slate-800 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            {product.imageUrls.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                  {product.imageUrls.map((url, index) => (
                      <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`aspect-square w-full rounded-md overflow-hidden ring-2 ring-offset-2 transition-all ${
                              selectedImageIndex === index ? 'ring-indigo-500' : 'ring-transparent'
                          }`}
                      >
                          <img src={url} alt={`Thumbnail ${index + 1}`} className={`w-full h-full object-cover transition-opacity ${selectedImageIndex !== index ? 'opacity-50 hover:opacity-100' : ''}`} />
                      </button>
                  ))}
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="bg-slate-100/50 backdrop-blur-sm p-8 rounded-lg"
          >
            {store && (
              <Link to={`/store/${store.id}`} className="inline-flex items-center gap-2 text-indigo-600 hover:underline mb-2">
                <Store size={16} />
                <span className="text-sm font-medium">Sold by {store.name}</span>
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
            <div className="mt-3">
              <p className="text-3xl text-slate-900">₱{product.price.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex items-center">
               {totalReviews > 0 ? (
                  <>
                      <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" />
                          ))}
                      </div>
                      <p className="ml-2 text-sm text-slate-500">{averageRating.toFixed(1)} ({totalReviews} review{totalReviews > 1 ? 's' : ''})</p>
                  </>
               ) : (
                  <p className="text-sm text-slate-500">No reviews yet</p>
               )}
            </div>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">{product.description}</p>
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="font-medium text-slate-700">Quantity:</label>
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-slate-500 hover:bg-slate-100 rounded-l-md"><Minus className="h-4 w-4" /></button>
                  <input type="number" id="quantity" value={quantity} readOnly className="w-12 text-center border-none bg-transparent focus:ring-0" />
                  <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-r-md"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="mt-8 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 transform hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
        {productReviews.length > 0 && <ReviewList reviews={productReviews} />}
      </div>
    </AnimatedPage>
  );
};

export default ProductDetailPage;
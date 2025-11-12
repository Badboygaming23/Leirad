import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductCard from '../components/products/ProductCard';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistPage: React.FC = () => {
  const { products, wishlist } = useAppContext();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Wishlist', path: '/wishlist' }
  ];

  return (
    <AnimatedPage>
      <Breadcrumb crumbs={crumbs} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Your Wishlist</h1>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="mt-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg text-slate-500">Your wishlist is empty.</p>
            <p className="mt-2 text-sm text-slate-500">Add items you love to your wishlist by clicking the heart icon.</p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
            >
              Find Products
            </Link>
          </div>
        ) : (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {wishlistedProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default WishlistPage;
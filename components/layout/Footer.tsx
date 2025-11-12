import React from 'react';
import { ShoppingBag, Twitter, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100/80 backdrop-blur-sm text-slate-600 border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-800">Luxe</span>
            </div>
            <p className="text-slate-500 text-sm">
              Modern e-commerce for the discerning customer. High-quality products with a focus on design and functionality.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-700">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#/products" className="text-slate-500 hover:text-slate-800 transition-colors">All Products</a></li>
              <li><a href="#/products" className="text-slate-500 hover:text-slate-800 transition-colors">New Arrivals</a></li>
              <li><a href="#/products" className="text-slate-500 hover:text-slate-800 transition-colors">Best Sellers</a></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-700">About</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Our Story</a></li>
              <li><a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Press</a></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-700">Connect</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors"><Twitter /></a>
              <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors"><Facebook /></a>
              <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors"><Instagram /></a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Luxe. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-4 sm:mt-0">A Fictional E-commerce Experience</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
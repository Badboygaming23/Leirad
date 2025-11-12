import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { cart, cartSubtotal, cartTax, cartTotal, updateCartQuantity, removeFromCart, applyCoupon, removeCoupon, appliedCoupon, cartDiscount } = useAppContext();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRequestDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      await removeFromCart(productToDelete);
      setIsDeleting(false);
      closeConfirmationModal();
    }
  };
  
  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCodeInput) {
        toast.error("Please enter a coupon code.");
        return;
    }
    setIsApplyingCoupon(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    applyCoupon(couponCodeInput);
    setIsApplyingCoupon(false);
    setCouponCodeInput('');
  };

  const handleRemoveCoupon = () => {
      removeCoupon();
  };

  const productBeingDeleted = productToDelete ? cart.find(p => p.id === productToDelete) : null;

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Cart', path: '/cart' }
  ];

  return (
    <AnimatedPage>
      <Breadcrumb crumbs={crumbs} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center">Your Cart</h1>
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 text-center"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 mb-6">
                <ShoppingCart className="h-12 w-12 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Your cart is currently empty</h2>
              <p className="mt-2 text-slate-500">Looks like you haven't added anything to your cart yet.</p>
              <Link
                to="/products"
                className="mt-6 inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
              >
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                <ul role="list" className="border-t border-b border-slate-200 divide-y divide-slate-200">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                        transition={{ delay: index * 0.1 }}
                        className="flex py-6 sm:py-10"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrls[0]}
                            alt={item.name}
                            className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                          />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <h3 className="text-sm">
                                <Link to={`/products/${item.id}`} className="font-medium text-slate-700 hover:text-slate-800">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm font-medium text-slate-900">₱{item.price.toFixed(2)}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <div className="flex items-center border border-slate-300 rounded-md w-fit">
                                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-l-md"><Minus className="h-4 w-4" /></button>
                                <input type="number" value={item.quantity} readOnly className="w-10 text-center border-none bg-transparent focus:ring-0 text-sm" />
                                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-r-md"><Plus className="h-4 w-4" /></button>
                              </div>
                              <div className="absolute top-0 right-0">
                                <button onClick={() => handleRequestDelete(item.id)} type="button" className="-m-2 p-2 inline-flex text-slate-400 hover:text-red-600 transition-colors">
                                  <span className="sr-only">Remove</span>
                                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
              <motion.section
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                aria-labelledby="summary-heading"
                className="mt-16 bg-slate-100/80 backdrop-blur-md rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-slate-200"
              >
                <h2 id="summary-heading" className="text-lg font-medium text-slate-900">Order summary</h2>
                
                <div className="mt-6 border-t border-b border-slate-200 py-6">
                    <h3 className="text-sm font-medium text-slate-900">Have a coupon?</h3>
                    {appliedCoupon ? (
                        <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-md">
                            <p className="text-sm text-green-800">Coupon applied: <span className="font-bold">{appliedCoupon.code}</span></p>
                            <button onClick={handleRemoveCoupon} className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={couponCodeInput}
                                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="block w-full rounded-md border-slate-300 bg-slate-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <Button type="button" onClick={handleApplyCoupon} isLoading={isApplyingCoupon} className="bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500">
                                Apply
                            </Button>
                        </div>
                    )}
                </div>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-slate-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-slate-900">₱{cartSubtotal.toFixed(2)}</dd>
                  </div>
                  <AnimatePresence>
                      {cartDiscount > 0 && (
                          <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center justify-between text-green-600"
                          >
                              <dt className="text-sm">Discount ({appliedCoupon?.code})</dt>
                              <dd className="text-sm font-medium">-₱{cartDiscount.toFixed(2)}</dd>
                          </motion.div>
                      )}
                  </AnimatePresence>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-slate-600">Tax (4%)</dt>
                    <dd className="text-sm font-medium text-slate-900">₱{cartTax.toFixed(2)}</dd>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-slate-900">Order total</dt>
                    <dd className="text-base font-medium text-slate-900">₱{cartTotal.toFixed(2)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-indigo-500"
                  >
                    Checkout
                  </button>
                </div>
              </motion.section>
            </div>
          )}
        </AnimatePresence>
      </div>
       <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        title="Remove Item"
        message={`Are you sure you want to remove "${productBeingDeleted?.name || 'this item'}" from your cart?`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </AnimatedPage>
  );
};

export default CartPage;
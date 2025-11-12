import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, Shield, Heart, Store, Package, Wallet, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../ui/ConfirmationModal';

interface HeaderProps {
  openSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ openSearch }) => {
  const { cartCount, user, logout, wishlistCount } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  
  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    setIsLogoutModalOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors hover:text-indigo-600 ${
      isActive ? 'text-indigo-600' : 'text-slate-500'
    }`;

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/products', text: 'Products' },
  ];

  if (user?.role === 'reseller') {
    navLinks.push({ to: '/reseller-dashboard', text: 'My Store' });
  }
  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', text: 'Admin Dashboard' });
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-100/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                >
                  <ShoppingBag className="h-7 w-7 text-indigo-600" />
                </motion.div>
                <span className="text-xl font-bold text-slate-800">Luxe</span>
              </Link>
              <nav className="hidden md:flex md:space-x-6">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={navLinkClass}>
                    {link.text}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={openSearch}
                className="relative group p-2 rounded-full hover:bg-slate-200/60 transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              </button>
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600">
                      <UserIcon className="h-5 w-5 mr-1"/> {user.email}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-20 border">
                       <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                          <UserIcon size={16} /> My Profile
                       </Link>
                       <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                          <Package size={16} /> My Orders
                       </Link>
                       <Link to="/my-wallet" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                          <Wallet size={16} /> My Wallet
                       </Link>
                       <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Login
                  </Link>
                )}
              </div>
              
              <Link to="/wishlist" className="relative group p-2 rounded-full hover:bg-slate-200/60 transition-colors">
                <Heart className="h-6 w-6 text-slate-500 group-hover:text-red-500 transition-colors" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-200/60 transition-colors">
                <ShoppingBag className="h-6 w-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-slate-100/95 backdrop-blur-md border-t border-slate-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`} onClick={() => setIsMenuOpen(false)}>
                    {link.text}
                  </NavLink>
                ))}
                <NavLink to="/wishlist" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`} onClick={() => setIsMenuOpen(false)}>
                  Wishlist
                </NavLink>
                <div className="border-t border-slate-200 pt-4 mt-4 px-3">
                  {user ? (
                     <>
                      <Link to="/profile" className="block py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900" onClick={() => setIsMenuOpen(false)}>
                          My Profile
                      </Link>
                      <Link to="/my-orders" className="block py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900" onClick={() => setIsMenuOpen(false)}>
                          My Orders
                      </Link>
                      <Link to="/my-wallet" className="block py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900" onClick={() => setIsMenuOpen(false)}>
                          My Wallet
                      </Link>
                      <button onClick={() => { handleLogoutClick(); setIsMenuOpen(false);}} className="w-full text-left block py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900">
                        Logout ({user.email})
                      </button>
                     </>
                  ) : (
                    <Link to="/login" className="block w-full text-center bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default Header;
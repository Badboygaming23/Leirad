
import React, { useState, useEffect } from 'react';
// FIX: Imported `useNavigate` hook from `react-router-dom`.
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import AuthModal from './AuthModal';
import { UserRole } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const AccessDenied: React.FC = () => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 text-center"
      >
        <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-gray-800">Access Denied</h3>
        <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
        <p className="mt-1 text-sm text-gray-500">Redirecting to homepage...</p>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAppContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      setShowAccessDenied(false);
    } else {
      setShowLoginModal(false);
      if (!allowedRoles.includes(user.role)) {
        setShowAccessDenied(true);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } else {
        setShowAccessDenied(false);
      }
    }
  }, [user, allowedRoles, navigate]);

  if (showAccessDenied) {
    return (
      <>
        {children}
        <AccessDenied />
      </>
    );
  }

  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => navigate('/', { replace: true })} 
        message="You need to be logged in to access this page." 
      />
    </>
  );
};

export default ProtectedRoute;
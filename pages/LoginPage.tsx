import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'reseller' ? '/reseller-dashboard' : from;
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };
  
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' }
  ];

  return (
    <AnimatedPage>
      <Breadcrumb crumbs={crumbs} />
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900"
          >
            Sign in to your account
          </motion.h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password"className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default LoginPage;
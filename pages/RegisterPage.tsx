import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (!email || !password || !firstName || !lastName) {
      toast.error('Please fill out all required fields.');
      return;
    }
    
    setIsLoading(true);
    await register({ email, password, firstName, middleName, lastName });
    setIsLoading(false);
  };

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Register', path: '/register' }
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
            Create a new account
          </motion.h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to an existing account
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
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First Name</label>
                <div className="mt-1">
                  <input id="firstName" name="firstName" type="text" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-slate-700">Middle Name <span className="text-slate-500">(Optional)</span></label>
                <div className="mt-1">
                  <input id="middleName" name="middleName" type="text" autoComplete="additional-name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last Name</label>
                <div className="mt-1">
                  <input id="lastName" name="lastName" type="text" autoComplete="family-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password"className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50/50 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default RegisterPage;
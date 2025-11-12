import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Lock, CreditCard, Banknote, Landmark, Wallet, User, Mail, Home, Phone, Trash2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShippingInfo, PaymentMethod } from '../types';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const CheckoutPage: React.FC = () => {
    const { cart, cartSubtotal, cartTax, cartDiscount, cartTotal, user, placeOrder, applyCoupon, removeCoupon, appliedCoupon, orders, setPin: createUserPin } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [saveInfo, setSaveInfo] = useState(true);
    const [pin, setPin] = useState('');

    const [createPinData, setCreatePinData] = useState({
        newPin: '',
        confirmPin: '',
        currentPassword: '',
    });
    const [isCreatingPin, setIsCreatingPin] = useState(false);

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        address: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            // Prioritize saved shipping info
            if (user.savedShippingInfo) {
                setShippingInfo(user.savedShippingInfo);
            } else {
                // Fallback to the most recent order's shipping info
                const userOrders = orders
                    .filter(o => o.userId === user.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                if (userOrders.length > 0) {
                    setShippingInfo(userOrders[0].shippingInfo);
                }
            }
        }
    }, [user, orders]);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
    const userHasPin = !!user?.pin;

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCodeInput) {
            toast.error("Please enter a coupon code.");
            return;
        }
        setIsApplyingCoupon(true);
        // This is now async in context, but let's simulate delay here
        await new Promise(resolve => setTimeout(resolve, 700));
        applyCoupon(couponCodeInput);
        setCouponCodeInput('');
        setIsApplyingCoupon(false);
    };
    
    const handleCreatePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreatePinData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
    };

    const handleCreatePinPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreatePinData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleCreatePinSubmit = async () => {
        const { newPin, confirmPin, currentPassword } = createPinData;
        setIsCreatingPin(true);
        const success = await createUserPin(newPin, confirmPin, currentPassword);
        setIsCreatingPin(false);
        if (success) {
            setCreatePinData({ newPin: '', confirmPin: '', currentPassword: '' });
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (Object.values(shippingInfo).some(val => val === '')) {
            toast.error('Please fill out all required shipping details.');
            return;
        }

        if (!user?.pin) {
            toast.error('Please create a security PIN before placing an order.');
            return;
        }
        
        if (pin !== user.pin) {
            toast.error('Incorrect security PIN.');
            return;
        }

        setIsLoading(true);
        const success = await placeOrder(shippingInfo, paymentMethod, saveInfo);
        setIsLoading(false);
        if (success) {
            navigate('/my-orders');
        }
    };
    
    const crumbs = [
        { name: 'Home', path: '/' },
        { name: 'Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' }
    ];

    if (cart.length === 0) {
        return (
            <AnimatedPage>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold">Your cart is empty.</h1>
                    <button onClick={() => navigate('/products')} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                        &larr; Go Shopping
                    </button>
                </div>
            </AnimatedPage>
        );
    }

    const walletBalance = user?.walletBalance || 0;
    const canPayWithWallet = walletBalance >= cartTotal;

    const paymentOptions = [
        { id: 'Wallet', title: 'Pay with Wallet', subtitle: `Balance: ₱${walletBalance.toFixed(2)}`, icon: <Wallet className="h-6 w-6 text-slate-600" />, disabled: !canPayWithWallet, disabledText: `Add ₱${(cartTotal - walletBalance).toFixed(2)} to use.` },
        { id: 'COD', title: 'Cash on Delivery', icon: <Banknote className="h-6 w-6 text-slate-600" /> },
    ];

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center">Checkout</h1>
                
                <form onSubmit={handlePlaceOrder} className="mt-12 max-w-lg mx-auto lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="space-y-10"
                    >
                        <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-slate-900">Shipping information</h2>
                            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First name <span className="text-red-500">*</span></label>
                                    <InputField icon={<User className="h-5 w-5 text-slate-400"/>} type="text" name="firstName" id="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name <span className="text-red-500">*</span></label>
                                    <InputField icon={<User className="h-5 w-5 text-slate-400"/>} type="text" name="lastName" id="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
                                    <InputField icon={<Home className="h-5 w-5 text-slate-400"/>} type="text" name="address" id="address" value={shippingInfo.address} onChange={handleShippingChange} required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                                    <InputField icon={<Phone className="h-5 w-5 text-slate-400"/>} type="tel" name="phone" id="phone" value={shippingInfo.phone} onChange={handleShippingChange} required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                                    <InputField icon={<Mail className="h-5 w-5 text-slate-400"/>} type="email" name="email" id="email" value={user?.email || ''} readOnly />
                                </div>
                            </div>
                            {user && (
                                <div className="mt-6">
                                    <div className="flex items-center">
                                        <input
                                            id="save-info"
                                            name="save-info"
                                            type="checkbox"
                                            checked={saveInfo}
                                            onChange={(e) => setSaveInfo(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-100"
                                        />
                                        <label htmlFor="save-info" className="ml-3 block text-sm font-medium text-slate-700">
                                            Save this information for next time
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-slate-900">Payment method</h2>
                            <fieldset className="mt-4">
                                <legend className="sr-only">Payment method</legend>
                                <div className="space-y-4">
                                    {paymentOptions.map((option) => (
                                        <div key={option.id} className={`relative flex items-start p-4 border rounded-lg transition-all ${paymentMethod === option.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-300 bg-slate-100/50'} ${option.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-200/50'}`} onClick={() => !option.disabled && setPaymentMethod(option.id as PaymentMethod)}>
                                            <div className="flex-shrink-0">{option.icon}</div>
                                            <div className="ml-4 flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{option.title}</span>
                                                {option.subtitle && <span className="text-xs text-slate-500">{option.subtitle}</span>}
                                                {option.disabled && option.disabledText && <span className="text-xs text-red-500 font-semibold">{option.disabledText}</span>}
                                            </div>
                                            {option.disabled && (
                                              <span className="absolute top-2 right-2 text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Coming Soon</span>
                                            )}
                                            <input type="radio" name="payment-method" value={option.id} checked={paymentMethod === option.id} onChange={() => {}} className="sr-only" disabled={option.disabled} />
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-10 lg:mt-0 lg:col-span-1"
                    >
                        <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-lg shadow p-6 sticky top-24">
                            <h2 className="text-lg font-medium text-slate-900">Order summary</h2>
                            <ul role="list" className="mt-6 divide-y divide-slate-200 max-h-72 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <li key={item.id} className="flex py-4 space-x-4">
                                        <img src={item.imageUrls[0]} alt={item.name} className="flex-none w-16 h-16 rounded-md object-cover" />
                                        <div className="flex-auto space-y-1">
                                            <h3 className="text-sm text-slate-700">{item.name}</h3>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="flex-none text-sm font-medium text-slate-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h3 className="text-sm font-medium text-slate-900">Have a coupon?</h3>
                                {appliedCoupon ? (
                                    <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-md">
                                        <p className="text-sm text-green-800">Coupon applied: <span className="font-bold">{appliedCoupon.code}</span></p>
                                        <button onClick={removeCoupon} className="text-red-600 hover:text-red-800">
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

                            <dl className="mt-6 space-y-4 border-t border-slate-200 pt-6">
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
                                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-base font-medium text-slate-900">
                                    <dt>Order Total</dt>
                                    <dd>₱{cartTotal.toFixed(2)}</dd>
                                </div>
                            </dl>

                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h3 className="text-sm font-medium text-slate-900">Security Verification</h3>
                                {userHasPin ? (
                                    <div className="mt-2">
                                        <InputField
                                            icon={<ShieldCheck className="h-5 w-5 text-slate-400"/>}
                                            type="password"
                                            name="pin"
                                            id="pin"
                                            value={pin}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="6-Digit PIN"
                                            maxLength={6}
                                            autoComplete="off"
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Enter your 6-digit security PIN to confirm your order.</p>
                                    </div>
                                ) : (
                                    <div className="mt-2 space-y-3 bg-indigo-50 p-4 rounded-md border border-indigo-200">
                                        <p className="text-sm text-indigo-800 font-semibold">Create a security PIN to proceed.</p>
                                        <InputField
                                            icon={<ShieldCheck className="h-5 w-5 text-slate-400"/>}
                                            type="password"
                                            name="newPin"
                                            value={createPinData.newPin}
                                            onChange={handleCreatePinChange}
                                            placeholder="New 6-Digit PIN"
                                            maxLength={6}
                                            autoComplete="off"
                                            required
                                        />
                                        <InputField
                                            icon={<ShieldCheck className="h-5 w-5 text-slate-400"/>}
                                            type="password"
                                            name="confirmPin"
                                            value={createPinData.confirmPin}
                                            onChange={handleCreatePinChange}
                                            placeholder="Confirm 6-Digit PIN"
                                            maxLength={6}
                                            autoComplete="off"
                                            required
                                        />
                                        <InputField
                                            icon={<Lock className="h-5 w-5 text-slate-400"/>}
                                            type="password"
                                            name="currentPassword"
                                            value={createPinData.currentPassword}
                                            onChange={handleCreatePinPasswordChange}
                                            placeholder="Current Account Password"
                                            autoComplete="current-password"
                                            required
                                        />
                                         <Button type="button" onClick={handleCreatePinSubmit} isLoading={isCreatingPin} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
                                            Create & Save PIN
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <Button type="submit" isLoading={isLoading} disabled={!userHasPin || isLoading} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
                                    Place Order
                                </Button>
                            </div>
                            <div className="mt-4 flex justify-center items-center text-sm text-slate-500">
                                <Lock className="w-4 h-4 mr-2" />
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </motion.div>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default CheckoutPage;

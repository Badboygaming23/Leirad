import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { User, Lock, Home, Save, UserCog, ShieldCheck, Phone, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { ShippingInfo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Input Field with Icon Component
const InputField = ({ icon, ...props }: { icon: React.ReactNode; [key: string]: any }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </div>
        <input {...props} className="block w-full rounded-md border-slate-300 bg-slate-50/50 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
);

const ResellerApplicationForm: React.FC = () => {
    const { user, resellerApplications, submitResellerApplication } = useAppContext();
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const myApplication = useMemo(() => {
        if (!user) return null;
        return resellerApplications.find(app => app.userId === user.id);
    }, [user, resellerApplications]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error("Please provide a reason for your application.");
            return;
        }
        setIsLoading(true);
        await submitResellerApplication(reason);
        setIsLoading(false);
    };

    if (myApplication && myApplication.status === 'pending') {
        return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <Clock className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-bold text-blue-800">Application Submitted</h3>
                <p className="mt-2 text-sm text-blue-700">Your reseller application is currently under review by our team. We'll notify you once a decision has been made.</p>
                <div className="mt-4 text-left text-sm bg-white p-4 rounded-md">
                    <p className="font-semibold text-slate-700">Your reason:</p>
                    <p className="text-slate-600 mt-1 italic">"{myApplication.reason}"</p>
                </div>
            </div>
        );
    }
    
     if (myApplication && myApplication.status === 'approved') {
        return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-bold text-green-800">Application Approved!</h3>
                <p className="mt-2 text-sm text-green-700">Congratulations! Your account has been upgraded to a reseller. You can now access the reseller dashboard.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><Briefcase /> Become a Reseller</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
                {myApplication?.status === 'rejected'
                    ? "Your previous application was not approved. You are welcome to re-apply with more details."
                    : "Apply to sell your products on our platform. Tell us a bit about your business."
                }
            </p>
            <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={5}
                required
                placeholder="Tell us about your business, the products you want to sell, and why you'd be a great fit for Luxe."
                className="block w-full rounded-md border-slate-300 bg-slate-50/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="flex justify-end pt-6 mt-4 border-t border-slate-200">
                <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                    Submit Application
                </Button>
            </div>
        </form>
    );
};


const MyProfilePage: React.FC = () => {
    const crumbs = [{ name: 'Home', path: '/' }, { name: 'My Profile', path: '/profile' }];
    const [activeTab, setActiveTab] = useState('details');
    const { user, updatePassword, updateShippingInfo, updateProfile } = useAppContext();

    // State for account details form
    const [profileData, setProfileData] = useState({ firstName: '', middleName: '', lastName: '' });
    const [isProfileDirty, setIsProfileDirty] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // State for shipping form
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '', lastName: '', address: '', phone: ''
    });
    const [isShippingLoading, setIsShippingLoading] = useState(false);

    // Effect to populate forms when user data is available
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                middleName: user.middleName || '',
                lastName: user.lastName || '',
            });
            if (user.savedShippingInfo) {
                setShippingInfo(user.savedShippingInfo);
            }
        }
    }, [user]);

    // Effect to check if profile form is dirty
    useEffect(() => {
        if (user) {
            const dirty = profileData.firstName !== (user.firstName || '') ||
                          profileData.middleName !== (user.middleName || '') ||
                          profileData.lastName !== (user.lastName || '');
            setIsProfileDirty(dirty);
        }
    }, [profileData, user]);


    // Handlers for profile form
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileLoading(true);
        await updateProfile(profileData);
        setIsProfileLoading(false);
    };

    // Handlers for password form
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setIsPasswordLoading(true);
        const success = await updatePassword(currentPassword, newPassword);
        setIsPasswordLoading(false);
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    // Handlers for shipping form
    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsShippingLoading(true);
        await updateShippingInfo(shippingInfo);
        setIsShippingLoading(false);
    };

    const baseTabs = [
        { id: 'details', label: 'Account Details', icon: <UserCog size={18} /> },
        { id: 'shipping', label: 'Shipping Information', icon: <Home size={18} /> },
        { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
    ];
    
    if (user?.role === 'customer') {
        baseTabs.push({ id: 'reseller', label: 'Reseller Program', icon: <Briefcase size={18} /> });
    }

    const tabs = baseTabs;

    const tabContentVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="bg-slate-50/50 min-h-[60vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.h1 
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8"
                    >
                        My Profile
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-3xl mx-auto bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="border-b border-slate-200">
                            <nav className="flex space-x-1 sm:space-x-2 p-1.5" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-3 font-medium text-sm rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                                            activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <motion.div
                                                className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-indigo-600"
                                                layoutId="underline"
                                            />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        <div className="p-6 sm:p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    variants={tabContentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    {activeTab === 'details' && (
                                        <form onSubmit={handleProfileSubmit}>
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><UserCog /> Account Details</h2>
                                            <div className="mt-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} placeholder="First Name" required />
                                                    <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="middleName" value={profileData.middleName} onChange={handleProfileChange} placeholder="Middle Name (Optional)" />
                                                </div>
                                                <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} placeholder="Last Name" required />
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-slate-500">Email Address</label>
                                                    <p className="mt-1 p-3 bg-slate-200/50 rounded-md text-slate-800 font-semibold cursor-not-allowed">{user?.email}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-slate-500">Account Type</label>
                                                    <p className="mt-1 p-3 bg-slate-200/50 rounded-md text-slate-800 font-semibold capitalize cursor-not-allowed">{user?.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-6 mt-4 border-t border-slate-200">
                                                <Button type="submit" isLoading={isProfileLoading} disabled={!isProfileDirty || isProfileLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                                                   <Save size={18}/> Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'shipping' && (
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><Home /> Saved Shipping Information</h2>
                                            <p className="text-sm text-slate-500 mt-2">This information will be used to pre-fill the checkout form.</p>
                                            <form onSubmit={handleShippingSubmit} className="mt-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} placeholder="First Name" required />
                                                    <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} placeholder="Last Name" required />
                                                </div>
                                                <InputField icon={<Home size={18} className="text-slate-400"/>} type="text" name="address" value={shippingInfo.address} onChange={handleShippingChange} placeholder="Address" required />
                                                <InputField icon={<Phone size={18} className="text-slate-400"/>} type="tel" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} placeholder="Phone Number" required />
                                                <div className="flex justify-end pt-2">
                                                    <Button type="submit" isLoading={isShippingLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                                                       <Save size={18}/> Save Shipping Info
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><Lock /> Change Password</h2>
                                             <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                                                <InputField icon={<Lock size={18} className="text-slate-400"/>} type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" required />
                                                <InputField icon={<Lock size={18} className="text-slate-400"/>} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required />
                                                <InputField icon={<Lock size={18} className="text-slate-400"/>} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
                                                <div className="flex justify-end pt-2">
                                                    <Button type="submit" isLoading={isPasswordLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                                                        <Save size={18}/> Update Password
                                                    </Button>
                                                </div>
                                            </form>
                                            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <h3 className="text-md font-bold text-blue-800 flex items-center gap-2"><ShieldCheck size={18} /> Security Tip</h3>
                                                <p className="text-sm text-blue-700 mt-2">
                                                    Use a strong, unique password to keep your account secure. Avoid using personal information and reusing passwords from other sites.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                     {activeTab === 'reseller' && <ResellerApplicationForm />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default MyProfilePage;
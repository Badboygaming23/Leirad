import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Lock, Home, Phone, Briefcase, Clock, CheckCircle, Building, User, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { ResellerApplication, ShippingInfo } from '../types';
import { motion } from 'framer-motion';
import InputField from '../components/ui/InputField';

interface ApplicationStatusDisplayProps {
    myApplication: ResellerApplication | null | undefined;
    handleSubmit: (e: React.FormEvent) => void;
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isLoading: boolean;
}

const ApplicationStatusDisplay: React.FC<ApplicationStatusDisplayProps> = ({ myApplication, handleSubmit, formData, handleChange, isLoading }) => {
    if (myApplication?.status === 'pending') {
        return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <Clock className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-bold text-blue-800">Application Submitted</h3>
                <p className="mt-2 text-sm text-blue-700">Your reseller application is currently under review by our team. We'll notify you once a decision has been made.</p>
            </div>
        );
    }
    
     if (myApplication?.status === 'approved') {
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
                    ? "Your previous application was not approved. Please review the details and re-apply."
                    : "Apply to sell your products on our platform by providing your store details."
                }
            </p>
            
            <div className="space-y-8">
                {/* Store Information */}
                <fieldset className="space-y-4">
                    <legend className="text-md font-semibold text-slate-700 flex items-center gap-2"><Building size={18}/> Proposed Store Information</legend>
                    <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="Store Name" required />
                    <textarea name="storeDescription" value={formData.storeDescription} onChange={handleChange} placeholder="Store Description" required rows={4} className="block w-full rounded-md border-slate-300 bg-slate-50/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3" />
                    <InputField icon={<Image size={18} className="text-slate-400"/>} type="text" name="storeLogoUrl" value={formData.storeLogoUrl} onChange={handleChange} placeholder="Store Logo URL" required />
                </fieldset>

                {/* Shipping Information */}
                <fieldset className="space-y-4">
                    <legend className="text-md font-semibold text-slate-700 flex items-center gap-2"><Home size={18}/> Your Shipping Information</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                        <InputField icon={<User size={18} className="text-slate-400"/>} type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                    </div>
                    <InputField icon={<Home size={18} className="text-slate-400"/>} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                    <InputField icon={<Phone size={18} className="text-slate-400"/>} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                </fieldset>
                
                {/* Security Verification */}
                <fieldset className="space-y-4">
                     <legend className="text-md font-semibold text-slate-700 flex items-center gap-2"><Lock size={18}/> Security Verification</legend>
                      <InputField icon={<Lock size={18} className="text-slate-400"/>} type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter Your Current Password" required />
                </fieldset>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
                <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                    Submit Application
                </Button>
            </div>
        </form>
    )
}


const BecomeAResellerPage: React.FC = () => {
    const { user, resellerApplications, submitResellerApplication } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const crumbs = [{ name: 'Home', path: '/' }, { name: 'Become a Reseller', path: '/become-a-reseller' }];

    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        storeLogoUrl: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        currentPassword: '',
    });
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    useEffect(() => {
        // This effect populates the shipping info from the user object, but only runs once.
        // This prevents user input from being overwritten if the user object updates in the background.
        if (user && !isFormInitialized) {
            setFormData(prev => ({
                ...prev,
                firstName: user.savedShippingInfo?.firstName || user.firstName || '',
                lastName: user.savedShippingInfo?.lastName || user.lastName || '',
                address: user.savedShippingInfo?.address || '',
                phone: user.savedShippingInfo?.phone || '',
            }));
            setIsFormInitialized(true);
        }
    }, [user, isFormInitialized]);

    const myApplication = useMemo(() => {
        if (!user) return null;
        return resellerApplications.find(app => app.userId === user.id);
    }, [user, resellerApplications]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { storeName, storeDescription, storeLogoUrl, firstName, lastName, address, phone, currentPassword } = formData;
        const allFieldsFilled = storeName && storeDescription && storeLogoUrl && firstName && lastName && address && phone && currentPassword;

        if (!allFieldsFilled) {
            toast.error("Please fill out all required fields.");
            return;
        }
        setIsLoading(true);
        await submitResellerApplication({
            storeName,
            storeDescription,
            storeLogoUrl,
            shippingInfo: { firstName, lastName, address, phone },
            currentPassword,
        });
        setIsLoading(false);
    };

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="bg-slate-50/50 min-h-[60vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-3xl mx-auto bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-lg shadow-lg p-6 sm:p-8"
                    >
                      <ApplicationStatusDisplay 
                        myApplication={myApplication}
                        handleSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                        isLoading={isLoading}
                      />
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default BecomeAResellerPage;

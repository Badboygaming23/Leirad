import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
// FIX: Added `ResellerApplicationStatus` to the import to be used in the `getStatusColor` function.
import { Product, User, Store, CarouselSlide, Advertisement, Order, OrderStatus, Announcement, WalletTransaction, WalletTransactionStatus, Coupon, ResellerApplication, ResellerApplicationStatus } from '../types';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Users, ShoppingBag, Home, MonitorPlay, Megaphone, Plus, Package, Bell, LayoutDashboard, Wallet, Check, X, Ticket, Menu, Briefcase, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ConfirmationModal from '../components/ui/ConfirmationModal';
import DataTable from '../components/admin/DataTable';
import UserModal from '../components/admin/UserModal';
import StoreModal from '../components/admin/StoreModal';
import ProductModal from '../components/admin/ProductModal';
import CarouselModal from '../components/admin/CarouselModal';
import AdModal from '../components/admin/AdModal';
import AnnouncementModal from '../components/admin/AnnouncementModal';
import CouponModal from '../components/admin/CouponModal';
import DashboardOverview from './admin/DashboardOverview';
import OrderDetailsModal from '../components/admin/OrderDetailsModal';
import AdminSidebar from '../components/admin/AdminSidebar';
import ResellerApplicationModal from '../components/admin/ResellerApplicationModal';

type AdminTab = 'overview' | 'users' | 'stores' | 'products' | 'carousel' | 'ads' | 'orders' | 'announcements' | 'wallet' | 'coupons' | 'resellerApps';
type ModalMode = 'add' | 'edit';
type ModalType = Exclude<AdminTab, 'overview'|'resellerApps'>;

interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  type: ModalType | null;
  data?: any;
}

// FIX: Widened the type of `status` to include `ResellerApplicationStatus`.
const getStatusColor = (status: OrderStatus | WalletTransactionStatus | ResellerApplicationStatus) => ({
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
}[status]);

const AdminPage: React.FC = () => {
    const context = useAppContext();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: 'add', type: null, data: null });
    const [itemToDelete, setItemToDelete] = useState<any | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [viewingApplication, setViewingApplication] = useState<ResellerApplication | null>(null);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Collapsed by default
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile view
    
    const [transactionToConfirm, setTransactionToConfirm] = useState<{ id: string, action: 'approve' | 'reject' } | null>(null);
    
    const tabs: { id: AdminTab; name: string; icon: React.ReactNode; data?: any[]; columns?: any[], canAdd?: boolean, canDelete?: boolean }[] = useMemo(() => [
        { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { 
            id: 'users', name: 'Users', icon: <Users size={20} />, data: context.users, canAdd: true, canDelete: true,
            columns: [
                { header: 'Email', accessor: 'email' },
                { header: 'Role', accessor: 'role', render: (item: User) => <span className="capitalize">{item.role}</span> },
                { header: 'Wallet', accessor: 'walletBalance', render: (item: User) => `₱${(item.walletBalance || 0).toFixed(2)}` },
            ] 
        },
        { 
            id: 'stores', name: 'Stores', icon: <Home size={20} />, data: context.stores, canAdd: true, canDelete: false,
            columns: [
                { header: 'Name', accessor: 'name' },
                { header: 'Owner', accessor: 'ownerId', render: (item: Store) => context.users.find(u => u.id === item.ownerId)?.email || 'N/A' },
            ] 
        },
        { 
            id: 'products', name: 'Products', icon: <ShoppingBag size={20} />, data: context.products, canAdd: true, canDelete: true,
            columns: [
                { header: 'Name', accessor: 'name' },
                { header: 'Store', accessor: 'storeId', render: (item: Product) => context.stores.find(s => s.id === item.storeId)?.name || 'N/A' },
                { header: 'Price', accessor: 'price', render: (item: Product) => `₱${item.price.toFixed(2)}` },
            ] 
        },
        { 
            id: 'orders', name: 'Orders', icon: <Package size={20} />, data: context.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), canAdd: false, canDelete: false,
            columns: [
                { header: 'Order ID', accessor: 'id', render: (item: Order) => <span className="font-mono text-xs">{item.id.split('-')[1]}</span> },
                { header: 'Customer', accessor: 'userId', render: (item: Order) => context.users.find(u => u.id === item.userId)?.email || 'N/A' },
                { header: 'Store', accessor: 'storeId', render: (item: Order) => context.stores.find(s => s.id === item.storeId)?.name || 'N/A' },
                { header: 'Total', accessor: 'total', render: (item: Order) => `₱${item.total.toFixed(2)}` },
                { header: 'Status', accessor: 'status', render: (item: Order) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span> },
            ]
        },
        {
            id: 'wallet', name: 'Wallet Requests', icon: <Wallet size={20} />, data: context.walletTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), canAdd: false, canDelete: false,
            columns: [
                { header: 'User', accessor: 'userEmail' },
                { header: 'Amount', accessor: 'amount', render: (item: WalletTransaction) => `₱${item.amount.toFixed(2)}` },
                { header: 'Date', accessor: 'createdAt', render: (item: WalletTransaction) => new Date(item.createdAt).toLocaleString() },
                { header: 'Status', accessor: 'status', render: (item: WalletTransaction) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span> },
                { header: 'Actions', accessor: 'actions', render: (item: WalletTransaction) => item.status === 'Pending' && (
                    <div className="flex gap-2">
                        <button onClick={() => setTransactionToConfirm({ id: item.id, action: 'approve' })} className="p-1 text-green-600 hover:text-green-800"><Check size={16} /></button>
                        <button onClick={() => setTransactionToConfirm({ id: item.id, action: 'reject' })} className="p-1 text-red-600 hover:text-red-800"><X size={16} /></button>
                    </div>
                )}
            ]
        },
         {
            id: 'resellerApps', name: 'Reseller Apps', icon: <Briefcase size={20} />, data: context.resellerApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), canAdd: false, canDelete: false,
            columns: [
                { header: 'Applicant', accessor: 'userEmail' },
                { header: 'Proposed Store', accessor: 'storeName' },
                { header: 'Date', accessor: 'createdAt', render: (item: ResellerApplication) => new Date(item.createdAt).toLocaleString() },
                { header: 'Status', accessor: 'status', render: (item: ResellerApplication) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(item.status)}`}>{item.status}</span> },
            ]
        },
        {
            id: 'coupons', name: 'Coupons', icon: <Ticket size={20} />, data: context.coupons, canAdd: true, canDelete: true,
            columns: [
                { header: 'Code', accessor: 'code' },
                { header: 'Type', accessor: 'discountType', render: (item: Coupon) => <span className="capitalize">{item.discountType}</span> },
                { header: 'Value', accessor: 'discountValue', render: (item: Coupon) => item.discountType === 'percentage' ? `${item.discountValue}%` : `₱${item.discountValue.toFixed(2)}` },
                { header: 'Status', accessor: 'isActive', render: (item: Coupon) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.isActive ? 'Active' : 'Inactive'}</span> },
            ]
        },
        { 
            id: 'carousel', name: 'Carousel', icon: <MonitorPlay size={20} />, data: context.carouselSlides, canAdd: true, canDelete: true,
            columns: [ { header: 'Title', accessor: 'title' }, { header: 'Link', accessor: 'link' } ] 
        },
        { 
            id: 'ads', name: 'Advertisements', icon: <Megaphone size={20} />, data: context.advertisements, canAdd: true, canDelete: true,
            columns: [ { header: 'Title', accessor: 'title' }, { header: 'Link', accessor: 'link' } ] 
        },
        {
            id: 'announcements', name: 'Announcements', icon: <Bell size={20} />, data: context.announcements.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), canAdd: true, canDelete: true,
            columns: [
                { header: 'Title', accessor: 'title' },
                { header: 'Created At', accessor: 'createdAt', render: (item: Announcement) => new Date(item.createdAt).toLocaleString() },
            ]
        }
    ], [context]);

    const openModal = (type: ModalType, mode: ModalMode, data: any = null) => setModalState({ isOpen: true, type, mode, data });
    const closeModal = () => setModalState({ isOpen: false, mode: 'add', type: null, data: null });
    const openDeleteConfirm = (item: any) => setItemToDelete(item);
    const closeDeleteConfirm = () => setItemToDelete(null);
    
    const activeTabForDelete = tabs.find(t => t.id === activeTab);

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !activeTabForDelete || !activeTabForDelete.canDelete) return;
        
        setIsLoadingConfirm(true);
        const allHandlers: any = {
            users: context.deleteUser,
            products: context.deleteProduct,
            carousel: context.deleteCarouselSlide,
            ads: context.deleteAdvertisement,
            announcements: context.deleteAnnouncement,
            coupons: context.deleteCoupon
        };
        await allHandlers[activeTabForDelete.id as keyof typeof allHandlers](itemToDelete.id);
        setIsLoadingConfirm(false);
        closeDeleteConfirm();
    };

    const handleSubmit = async (formData: any) => {
        const { type, mode } = modalState;
        if (!type) return;
        const handlerMap: any = {
            users: { add: context.addUser, edit: context.updateUser },
            stores: { add: context.addStore, edit: context.updateStore },
            products: { add: context.addProduct, edit: context.updateProduct },
            carousel: { add: context.addCarouselSlide, edit: context.updateCarouselSlide },
            ads: { add: context.addAdvertisement, edit: context.updateAdvertisement },
            announcements: { add: context.addAnnouncement, edit: context.updateAnnouncement },
            coupons: { add: context.addCoupon, edit: context.updateCoupon }
        };
        await handlerMap[type! as keyof typeof handlerMap][mode](formData);
        closeModal();
    };

    const handleConfirmTransaction = async () => {
        if (!transactionToConfirm) return;
        setIsLoadingConfirm(true);
        if (transactionToConfirm.action === 'approve') {
            await context.approveWalletTransaction(transactionToConfirm.id);
        } else {
            await context.rejectWalletTransaction(transactionToConfirm.id);
        }
        setIsLoadingConfirm(false);
        setTransactionToConfirm(null);
    };

    const handleApproveApplication = async (id: string) => {
        await context.approveResellerApplication(id);
        setViewingApplication(null);
    };

    const handleRejectApplication = async (id: string) => {
        await context.rejectResellerApplication(id);
        setViewingApplication(null);
    };

    const handleViewOrder = (order: Order) => setViewingOrder(order);
    const crumbs = [{ name: 'Home', path: '/' }, { name: 'Admin Dashboard', path: '/admin' }];
    const activeTabData = tabs.find(t => t.id === activeTab);

    const handleSetActiveTab = (tabId: string) => {
      setActiveTab(tabId as AdminTab);
      setIsMobileSidebarOpen(false);
    };
    
    const handleDataTableRowClick = (item: any) => {
        if (activeTab === 'orders') {
            handleViewOrder(item);
        } else if (activeTab === 'resellerApps') {
            setViewingApplication(item);
        } else {
            openModal(activeTabData?.id as ModalType, 'edit', item);
        }
    }

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="flex flex-grow">
                <AdminSidebar
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={handleSetActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    isMobileOpen={isMobileSidebarOpen}
                    setIsMobileOpen={setIsMobileSidebarOpen}
                />
                <main className={`flex-grow p-6 sm:p-8 overflow-y-auto transition-all duration-300 ease-in-out lg:${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="container mx-auto">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                     <button
                                        onClick={() => setIsMobileSidebarOpen(true)}
                                        className="lg:hidden p-2 -ml-2 text-slate-600 rounded-md hover:bg-slate-100"
                                        aria-label="Open sidebar"
                                    >
                                        <Menu size={24} />
                                    </button>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                        {activeTabData?.name}
                                    </h1>
                                </div>
                                {activeTabData && activeTabData.canAdd && (
                                    <button onClick={() => openModal(activeTabData.id as ModalType, 'add')} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors self-start sm:self-center">
                                        <Plus size={18} /> Add New {activeTabData.name === 'Advertisements' ? 'Ad' : activeTabData.name.slice(0, -1)}
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'overview' && <DashboardOverview />}
                                {activeTabData && activeTabData.data && activeTabData.columns && activeTab !== 'overview' && (
                                    <DataTable 
                                        columns={activeTabData.columns} 
                                        data={activeTabData.data}
                                        onEdit={handleDataTableRowClick}
                                        onDelete={activeTabData.canDelete ? openDeleteConfirm : undefined}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {modalState.isOpen && modalState.type === 'users' && <UserModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'stores' && <StoreModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'products' && <ProductModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'carousel' && <CarouselModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'ads' && <AdModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'announcements' && <AnnouncementModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            {modalState.isOpen && modalState.type === 'coupons' && <CouponModal isOpen={modalState.isOpen} onClose={closeModal} onSubmit={handleSubmit} defaultValues={modalState.data} mode={modalState.mode} />}
            
            <OrderDetailsModal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} order={viewingOrder} />
            <ResellerApplicationModal 
                isOpen={!!viewingApplication} 
                onClose={() => setViewingApplication(null)} 
                application={viewingApplication}
                onApprove={handleApproveApplication}
                onReject={handleRejectApplication}
            />

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={closeDeleteConfirm}
                onConfirm={handleConfirmDelete}
                isConfirming={isLoadingConfirm}
                title={`Delete ${activeTabForDelete?.name?.slice(0,-1)}`}
                message={`Are you sure you want to delete this ${activeTabForDelete?.name?.slice(0,-1)}? This action cannot be undone.`}
                confirmText="Delete"
            />
            <ConfirmationModal
                isOpen={!!transactionToConfirm}
                onClose={() => setTransactionToConfirm(null)}
                onConfirm={handleConfirmTransaction}
                isConfirming={isLoadingConfirm}
                title={`${transactionToConfirm?.action === 'approve' ? 'Approve' : 'Reject'} Transaction`}
                message={`Are you sure you want to ${transactionToConfirm?.action} this transaction?`}
                confirmText={transactionToConfirm?.action === 'approve' ? 'Approve' : 'Reject'}
            />
        </AnimatedPage>
    );
};

export default AdminPage;
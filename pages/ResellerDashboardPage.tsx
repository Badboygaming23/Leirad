import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Store, Product, Order, OrderStatus } from '../types';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Plus, Home, ShoppingBag, Package, DollarSign, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import AnnouncementBanner from '../components/ui/AnnouncementBanner';
import DataTable from '../components/admin/DataTable';
import ProductModal from '../components/admin/ProductModal';
import OrderDetailsModal from '../components/reseller/OrderDetailsModal';
import Button from '../components/ui/Button';

type ResellerTab = 'orders' | 'products' | 'details';
type ModalMode = 'add' | 'edit';

const getStatusColor = (status: OrderStatus) => ({
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
}[status]);

const StatCard = ({ title, value, icon, isCurrency = false }: { title: string; value: number; icon: React.ReactNode, isCurrency?: boolean }) => (
    <div className="bg-slate-100/50 backdrop-blur-sm p-6 rounded-lg border border-slate-200/50 flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{isCurrency ? `₱${value.toFixed(2)}` : value}</p>
        </div>
    </div>
);

const ResellerDashboardPage: React.FC = () => {
    const { user, stores, products, orders, createStore, updateStore, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useAppContext();
    const [activeTab, setActiveTab] = useState<ResellerTab>('orders');
    
    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productModalMode, setProductModalMode] = useState<ModalMode>('add');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const myStore = useMemo(() => user ? stores.find(s => s.ownerId === user.id) : undefined, [user, stores]);
    const myProducts = useMemo(() => myStore ? products.filter(p => p.storeId === myStore.id) : [], [myStore, products]);
    const myOrders = useMemo(() => myStore ? orders.filter(o => o.storeId === myStore.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [], [myStore, orders]);

    const handleOpenProductModal = (mode: ModalMode, product: Product | null = null) => {
        setProductModalMode(mode);
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleOpenOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const handleOpenDeleteConfirm = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteConfirmOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            setIsDeleting(true);
            await deleteProduct(selectedProduct.id);
            setIsDeleting(false);
            setIsDeleteConfirmOpen(false);
            setSelectedProduct(null);
        }
    };

    const handleProductSubmit = async (productData: any) => {
        if (productModalMode === 'add') {
            await addProduct(productData);
        } else {
            await updateProduct(productData);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        await updateOrderStatus(orderId, status);
        setIsOrderModalOpen(false);
    };
    
    const crumbs = [{ name: 'Home', path: '/' }, { name: 'My Store Dashboard', path: '/reseller-dashboard' }];
    const tabs = [
        { id: 'orders', name: 'Orders', icon: <Package size={18} /> },
        { id: 'products', name: 'Products', icon: <ShoppingBag size={18} /> },
        { id: 'details', name: 'Store Details', icon: <Home size={18} /> },
    ];
    
    const productColumns = useMemo(() => [
        { header: 'Name', accessor: 'name' },
        { header: 'Price', accessor: 'price', render: (item: Product) => `₱${item.price.toFixed(2)}` },
        { header: 'Category', accessor: 'category' },
    ], []);

    const orderColumns = useMemo(() => [
        { header: 'Order ID', accessor: 'id', render: (item: Order) => <span className="font-mono text-xs">{item.id.split('-')[1]}</span> },
        { header: 'Date', accessor: 'createdAt', render: (item: Order) => new Date(item.createdAt).toLocaleDateString() },
        { header: 'Total', accessor: 'total', render: (item: Order) => `₱${item.total.toFixed(2)}` },
        { header: 'Status', accessor: 'status', render: (item: Order) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span> },
    ], []);

    const totalProducts = myProducts.length;
    const pendingOrders = myOrders.filter(o => o.status === 'Pending').length;
    const totalRevenue = myOrders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <AnnouncementBanner />
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 my-8">
                    {myStore ? `Managing: ${myStore.name}` : 'My Store Dashboard'}
                </h1>

                {!myStore ? (
                    <CreateStoreForm onCreate={createStore} />
                ) : (
                    <>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                                <StatCard title="Total Revenue" value={totalRevenue} icon={<DollarSign />} isCurrency />
                            </motion.div>
                            <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                                <StatCard title="Pending Orders" value={pendingOrders} icon={<Clock />} />
                            </motion.div>
                            <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                                <StatCard title="Listed Products" value={totalProducts} icon={<ShoppingBag />} />
                            </motion.div>
                        </motion.div>

                        <div className="mb-8 border-b border-slate-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id} onClick={() => setActiveTab(tab.id as ResellerTab)}
                                        className={`${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        {tab.icon} {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'details' && <EditStoreForm store={myStore} onUpdate={updateStore} />}
                                {activeTab === 'products' && (
                                    <div>
                                        <div className="flex justify-end mb-4">
                                            <button onClick={() => handleOpenProductModal('add')} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors">
                                                <Plus size={18} /> Add Product
                                            </button>
                                        </div>
                                        {myProducts.length > 0 ? (
                                            <DataTable
                                                columns={productColumns}
                                                data={myProducts}
                                                onEdit={(item) => handleOpenProductModal('edit', item)}
                                                onDelete={handleOpenDeleteConfirm}
                                            />
                                        ) : (
                                            <div className="text-center py-16 bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-200">
                                                <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
                                                <h3 className="mt-2 text-lg font-medium text-slate-800">No products yet</h3>
                                                <p className="mt-1 text-sm text-slate-500">Add your first product to get started.</p>
                                                <button onClick={() => handleOpenProductModal('add')} className="mt-6 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors mx-auto">
                                                    <Plus size={18} /> Add Product
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'orders' && (
                                     myOrders.length > 0 ? (
                                        <DataTable
                                            columns={orderColumns}
                                            data={myOrders}
                                            onEdit={handleOpenOrderModal}
                                        />
                                     ) : (
                                        <div className="text-center py-16 bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-200">
                                            <Package className="mx-auto h-12 w-12 text-slate-400" />
                                            <h3 className="mt-2 text-lg font-medium text-slate-800">No orders yet</h3>
                                            <p className="mt-1 text-sm text-slate-500">New orders from your customers will appear here.</p>
                                        </div>
                                     )
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Modals */}
            {isProductModalOpen && (
              <ProductModal
                  isOpen={isProductModalOpen}
                  onClose={() => setIsProductModalOpen(false)}
                  onSubmit={handleProductSubmit}
                  defaultValues={selectedProduct}
                  mode={productModalMode}
                  resellerStoreId={myStore?.id}
              />
            )}
             <OrderDetailsModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
                onUpdateStatus={handleStatusUpdate}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isConfirming={isDeleting}
                title="Delete Product"
                message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
            />
        </AnimatedPage>
    );
};


const CreateStoreForm: React.FC<{ onCreate: (data: Omit<Store, 'id'|'ownerId'>) => Promise<void> }> = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmModalOpen(true);
    };

    const handleConfirmCreate = async () => {
        setIsCreating(true);
        await onCreate({ name, description, logoUrl });
        setIsCreating(false);
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="text-center">
                    <Home className="mx-auto h-12 w-12 text-indigo-500" />
                    <h2 className="text-2xl font-bold mt-4">Create Your Store</h2>
                    <p className="text-slate-600 mb-6 mt-2">You don't have a store yet. Fill out the form below to get started!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Store Name" required className="w-full p-3 border rounded-md bg-slate-50/50 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Store Description" required rows={4} className="w-full p-3 border rounded-md bg-slate-50/50 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Logo Image URL" required className="w-full p-3 border rounded-md bg-slate-50/50 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">Create Store</Button>
                </form>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmCreate}
                isConfirming={isCreating}
                title="Confirm Store Creation"
                message={`Are you sure you want to create the store "${name || 'your new store'}"?`}
                confirmText="Yes, Create Store"
            />
        </>
    );
};

const EditStoreForm: React.FC<{ store: Store, onUpdate: (data: Store) => Promise<void> }> = ({ store, onUpdate }) => {
    const [formData, setFormData] = useState(store);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => setFormData(store), [store]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onUpdate(formData);
        setIsLoading(false);
    };
    
    return (
        <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Store Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 md:col-span-1">Store Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md bg-slate-50/50 md:col-span-3 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </fieldset>
                 <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <label className="text-sm font-medium text-slate-700 md:col-span-1 pt-3">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full p-3 border rounded-md bg-slate-50/50 md:col-span-3 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </fieldset>
                 <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 md:col-span-1">Logo URL</label>
                    <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} required className="w-full p-3 border rounded-md bg-slate-50/50 md:col-span-3 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </fieldset>
                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700">Update Store</Button>
                </div>
            </form>
        </div>
    );
};


export default ResellerDashboardPage;
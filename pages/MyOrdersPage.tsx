import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Order, OrderStatus, OrderItem } from '../types';
import { motion } from 'framer-motion';
import { PackageX, Clock, Loader, Truck, CheckCircle2, XCircle, Home, Phone, CreditCard, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/reviews/ReviewModal';
import AnnouncementBanner from '../components/ui/AnnouncementBanner';
import Button from '../components/ui/Button';

const getStatusAppearance = (status: OrderStatus) => {
    switch (status) {
        case 'Pending': return {
            header: 'bg-yellow-50 border-yellow-200',
            badge: 'bg-yellow-100 text-yellow-800',
            icon: <Clock size={18} />
        };
        case 'Processing': return {
            header: 'bg-blue-50 border-blue-200',
            badge: 'bg-blue-100 text-blue-800',
            icon: <Loader size={18} className="animate-spin" />
        };
        case 'Shipped': return {
            header: 'bg-indigo-50 border-indigo-200',
            badge: 'bg-indigo-100 text-indigo-800',
            icon: <Truck size={18} />
        };
        case 'Delivered': return {
            header: 'bg-green-50 border-green-200',
            badge: 'bg-green-100 text-green-800',
            icon: <CheckCircle2 size={18} />
        };
        case 'Cancelled': return {
            header: 'bg-red-50 border-red-200',
            badge: 'bg-red-100 text-red-800',
            icon: <XCircle size={18} />
        };
        default: return {
            header: 'bg-slate-50 border-slate-200',
            badge: 'bg-slate-100 text-slate-800',
            icon: <Clock size={18} />
        };
    }
};

const OrderCard: React.FC<{ order: Order; onReviewClick: (item: OrderItem) => void; }> = ({ order, onReviewClick }) => {
    const { stores, cancelOrder, user, reviews } = useAppContext();
    const [isCancelling, setIsCancelling] = useState(false);
    const store = stores.find(s => s.id === order.storeId);
    
    const { header, badge, icon } = getStatusAppearance(order.status);

    const hasUserReviewed = (productId: string) => {
        return reviews.some(review => review.productId === productId && review.userId === user?.id);
    };
    
    const handleCancel = async () => {
        setIsCancelling(true);
        await cancelOrder(order.id);
        setIsCancelling(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-lg shadow-md overflow-hidden"
        >
            <div className={`p-4 border-b ${header} flex justify-between items-start`}>
                <div>
                    <p className="text-sm font-medium text-slate-700">Order #{order.id.split('-')[1]}</p>
                    <p className="text-xs text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    {store && <p className="text-xs mt-1 text-slate-600">Sold by: <Link to={`/store/${store.id}`} className="font-semibold text-indigo-600 hover:underline">{store.name}</Link></p>}
                </div>
                <div className="text-right">
                     <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${badge}`}>
                        {icon}
                        <span>{order.status}</span>
                     </div>
                      <div className="relative group">
                        <p className="text-lg font-bold text-slate-800 mt-2 cursor-pointer">₱{order.total.toFixed(2)}</p>
                        <div className="absolute hidden group-hover:block right-0 mt-1 p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg z-10 w-48 border">
                            <div className="flex justify-between"><span>Subtotal:</span> <span>₱{order.subtotal.toFixed(2)}</span></div>
                            {order.discountAmount && order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-400"><span>Discount:</span> <span>-₱{order.discountAmount.toFixed(2)}</span></div>
                            )}
                            <div className="flex justify-between"><span>Tax:</span> <span>₱{order.tax.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <ul className="space-y-3">
                    {order.items.map(item => (
                        <li key={item.productId} className="flex items-center gap-4 text-sm">
                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                            <div className="flex-grow">
                                <p className="font-medium text-slate-800">{item.name}</p>
                                <p className="text-slate-500">Qty: {item.quantity}</p>
                                {order.status === 'Delivered' && (
                                     hasUserReviewed(item.productId) ? (
                                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                            <CheckCircle2 size={14} /> Reviewed
                                        </div>
                                     ) : (
                                        <button 
                                            onClick={() => onReviewClick(item)}
                                            className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                           <Star size={14} /> Leave a Review
                                        </button>
                                     )
                                )}
                            </div>
                            <p className="font-medium text-slate-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t bg-slate-50/50 p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Home size={16} /> Shipping To</h4>
                    <address className="not-italic text-slate-600">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br/>
                        {order.shippingInfo.address}<br/>
                        <span className="flex items-center gap-2 mt-1"><Phone size={12}/> {order.shippingInfo.phone}</span>
                    </address>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><CreditCard size={16} /> Payment</h4>
                    <p className="text-slate-600">Method: <span className="font-medium">{order.paymentMethod}</span></p>
                </div>
            </div>

            {order.status === 'Pending' && (
                 <div className="p-4 bg-slate-50/50 border-t text-right">
                    <Button 
                        onClick={handleCancel}
                        isLoading={isCancelling}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    >
                        Cancel Order
                    </Button>
                 </div>
            )}
        </motion.div>
    );
};

const MyOrdersPage: React.FC = () => {
    const { user, orders } = useAppContext();
    const [reviewModalState, setReviewModalState] = useState<{isOpen: boolean; product: OrderItem | null}>({ isOpen: false, product: null });

    const myOrders = useMemo(() => {
        if (!user) return [];
        return orders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [user, orders]);
    
    const crumbs = [
        { name: 'Home', path: '/' },
        { name: 'My Orders', path: '/my-orders' }
    ];

    const openReviewModal = (product: OrderItem) => {
        setReviewModalState({ isOpen: true, product });
    };

    const closeReviewModal = () => {
        setReviewModalState({ isOpen: false, product: null });
    };

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <AnnouncementBanner />
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 my-8">My Orders</h1>
                    
                    {myOrders.length === 0 ? (
                        <div className="text-center py-16 bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-lg shadow-md">
                           <PackageX className="mx-auto h-16 w-16 text-slate-300" />
                           <p className="mt-4 text-lg text-slate-500">You haven't placed any orders yet.</p>
                           <Link
                             to="/products"
                             className="mt-6 inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
                           >
                             Start Shopping
                           </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {myOrders.map(order => (
                                <OrderCard key={order.id} order={order} onReviewClick={openReviewModal} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {reviewModalState.isOpen && (
              <ReviewModal 
                  isOpen={reviewModalState.isOpen}
                  onClose={closeReviewModal}
                  product={reviewModalState.product}
              />
            )}
        </AnimatedPage>
    );
};

export default MyOrdersPage;
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Order, OrderStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order, onUpdateStatus }) => {
    const { users } = useAppContext();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(order?.status);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
        }
    }, [order]);
    
    if (!order) return null;

    const handleUpdate = async () => {
        if (selectedStatus && selectedStatus !== order.status) {
            setIsUpdating(true);
            await onUpdateStatus(order.id, selectedStatus);
            setIsUpdating(false);
        } else {
            onClose();
        }
    };

    const customer = users.find(u => u.id === order.userId);
    const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Order Details: #${order.id.split('-')[1]}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {customer?.email || 'N/A'}</p>
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                    <p className="text-sm text-gray-600"><strong>Address:</strong> {order.shippingInfo.address}</p>
                    <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Payment & Status</h4>
                    <p className="text-sm text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <div className="mt-2">
                        <label htmlFor="orderStatus" className="text-sm font-medium">Update Status:</label>
                        <select
                            id="orderStatus"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm bg-slate-50"
                            disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                        >
                            {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t pt-4">
                 <h4 className="font-semibold text-gray-800 mb-2">Order Items</h4>
                <ul className="text-sm text-gray-600 space-y-3 max-h-60 overflow-y-auto pr-2">
                    {order.items.map(item => (
                        <li key={item.productId} className="flex items-center gap-3">
                            <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-md object-cover bg-gray-100" />
                            <div className="flex-grow">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} - Price: ₱{item.price.toFixed(2)}</p>
                            </div>
                            <p className="font-medium text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-end items-end gap-3 pt-6 border-t mt-6">
                 <div className="text-sm text-right space-y-1 flex-grow">
                    <div className="flex justify-between gap-4"><span>Subtotal:</span> <span className="font-medium">₱{order.subtotal.toFixed(2)}</span></div>
                     {order.discountAmount && order.discountAmount > 0 && (
                         <div className="flex justify-between gap-4 text-green-600"><span>Discount:</span> <span className="font-medium">-₱{order.discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between gap-4"><span>Tax (4%):</span> <span className="font-medium">₱{order.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4 font-bold text-base pt-1 border-t mt-1"><span>Total:</span> <span>₱{order.total.toFixed(2)}</span></div>
                </div>
            </div>
             <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md font-semibold hover:bg-slate-300 transition-colors">Cancel</button>
                <Button 
                    onClick={handleUpdate} 
                    isLoading={isUpdating}
                    disabled={selectedStatus === order.status}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                >
                    Save Changes
                </Button>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
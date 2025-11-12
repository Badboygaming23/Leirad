import React from 'react';
import Modal from '../ui/Modal';
import { Order } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
    const { users } = useAppContext();
    if (!order) return null;

    const customer = users.find(u => u.id === order.userId);

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
                    <p className="text-sm text-gray-600 mt-2"><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
                </div>
            </div>

            <div className="mt-6 border-t pt-4">
                 <h4 className="font-semibold text-gray-800 mb-2">Order Items</h4>
                <ul className="text-sm text-gray-600 space-y-3 max-h-60 overflow-y-auto">
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
            
            <div className="flex justify-between items-end gap-3 pt-6 border-t mt-6">
                <div />
                <div className="text-sm text-right space-y-1">
                    <div className="flex justify-between gap-4"><span>Subtotal:</span> <span className="font-medium">₱{order.subtotal.toFixed(2)}</span></div>
                    {order.discountAmount && order.discountAmount > 0 && (
                         <div className="flex justify-between gap-4 text-green-600"><span>Discount:</span> <span className="font-medium">-₱{order.discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between gap-4"><span>Tax (4%):</span> <span className="font-medium">₱{order.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4 font-bold text-base pt-1 border-t mt-1"><span>Total:</span> <span>₱{order.total.toFixed(2)}</span></div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
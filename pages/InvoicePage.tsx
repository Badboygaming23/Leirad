import React, { useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AnimatedPage from '../components/ui/AnimatedPage';
import Button from '../components/ui/Button';
import { Download, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const InvoicePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders, user, stores } = useAppContext();
    const [isDownloading, setIsDownloading] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const order = orders.find(o => o.id === orderId);

    // Security check: ensure user owns the order or is an admin
    if (user && order && order.userId !== user.id && user.role !== 'admin') {
        return <Navigate to="/my-orders" replace />;
    }

    const store = order ? stores.find(s => s.id === order.storeId) : null;

    const handleDownload = async () => {
        if (!invoiceRef.current) return;
        setIsDownloading(true);
        const toastId = toast.loading('Generating PDF...');
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true, 
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Luxe-Invoice-${order?.id.split('-')[1]}.pdf`);
            toast.success('PDF downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error("Failed to generate PDF", error);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        }
        setIsDownloading(false);
    };

    if (!order) {
        return (
            <AnimatedPage>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold">Order not found</h1>
                    <Link to="/my-orders" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                        &larr; Back to My Orders
                    </Link>
                </div>
            </AnimatedPage>
        );
    }
    
    return (
      <AnimatedPage>
        <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                     <Link to="/my-orders" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                        <ArrowLeft size={18}/> Back to My Orders
                     </Link>
                     <Button onClick={handleDownload} isLoading={isDownloading} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        <Download size={18} className="mr-2"/> Download PDF
                     </Button>
                </div>
                
                <div ref={invoiceRef} className="bg-white p-8 sm:p-12 rounded-lg shadow-lg border border-slate-200">
                    <header className="flex justify-between items-start pb-8 border-b border-slate-200">
                        <div>
                            <div className="flex items-center space-x-2">
                                <ShoppingBag className="h-8 w-8 text-indigo-600" />
                                <span className="text-3xl font-bold text-slate-800">Luxe</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">A Fictional E-commerce Experience</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wider">Invoice</h2>
                            <p className="text-sm text-slate-500 mt-1">Order #{order.id.split('-')[1]}</p>
                            <p className="text-sm text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-2">Billed To</h3>
                            <address className="not-italic text-slate-700">
                                <strong className="block">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong>
                                {order.shippingInfo.address}<br/>
                                {order.shippingInfo.phone}
                            </address>
                        </div>
                         {store && (
                             <div className="text-left sm:text-right">
                                <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-2">From</h3>
                                <p className="text-slate-700">
                                    <strong className="block">{store.name}</strong>
                                    {store.description}
                                </p>
                            </div>
                         )}
                    </section>

                    <section className="mt-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left font-semibold text-slate-600 p-3">Product</th>
                                        <th className="text-center font-semibold text-slate-600 p-3">Quantity</th>
                                        <th className="text-right font-semibold text-slate-600 p-3">Unit Price</th>
                                        <th className="text-right font-semibold text-slate-600 p-3">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {order.items.map(item => (
                                        <tr key={item.productId}>
                                            <td className="p-3">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.name} 
                                                        className="w-12 h-12 rounded-md object-cover bg-slate-100"
                                                        crossOrigin="anonymous"
                                                    />
                                                    <span className="text-slate-700 font-medium">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                                            <td className="p-3 text-right text-slate-600">₱{item.price.toFixed(2)}</td>
                                            <td className="p-3 text-right text-slate-800 font-medium">₱{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mt-8 flex justify-end">
                        <div className="w-full sm:w-1/2 md:w-1/3 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal:</span>
                                <span className="text-slate-800 font-medium">₱{order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discountAmount && order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="">Discount ({order.couponCode}):</span>
                                    <span className="font-medium">-₱{order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tax (4%):</span>
                                <span className="text-slate-800 font-medium">₱{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-slate-300 text-base font-bold text-slate-900">
                                <span>Total:</span>
                                <span>₱{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                    
                     <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                        <p>Thank you for your purchase!</p>
                        <p>If you have any questions, please contact our support.</p>
                    </footer>
                </div>
            </div>
        </div>
      </AnimatedPage>
    );
};

export default InvoicePage;
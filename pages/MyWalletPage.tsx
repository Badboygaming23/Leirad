import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Clock, CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { WalletTransaction, WalletTransactionStatus } from '../types';
import Button from '../components/ui/Button';

const getStatusAppearance = (status: WalletTransactionStatus) => {
    switch (status) {
        case 'Pending': return {
            badge: 'bg-yellow-100 text-yellow-800',
            icon: <Clock size={14} />
        };
        case 'Approved': return {
            badge: 'bg-green-100 text-green-800',
            icon: <CheckCircle2 size={14} />
        };
        case 'Rejected': return {
            badge: 'bg-red-100 text-red-800',
            icon: <XCircle size={14} />
        };
        default: return {
            badge: 'bg-slate-100 text-slate-800',
            icon: <Clock size={14} />
        };
    }
};

type SortKey = keyof WalletTransaction;

const MyWalletPage: React.FC = () => {
    const { user, requestWalletFunds, walletTransactions } = useAppContext();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State for table
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });
    const TRANSACTIONS_PER_PAGE = 5;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        setIsLoading(true);
        await requestWalletFunds(numericAmount);
        setIsLoading(false);
        setAmount('');
    };

    const myTransactions = useMemo(() => {
        if (!user) return [];
        return walletTransactions.filter(t => t.userId === user.id);
    }, [user, walletTransactions]);

    const sortedTransactions = useMemo(() => {
        let sortableItems = [...myTransactions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [myTransactions, sortConfig]);
    
    const totalPages = Math.ceil(sortedTransactions.length / TRANSACTIONS_PER_PAGE);
    const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * TRANSACTIONS_PER_PAGE, currentPage * TRANSACTIONS_PER_PAGE);

    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const crumbs = [
        { name: 'Home', path: '/' },
        { name: 'My Wallet', path: '/my-wallet' }
    ];

    const walletBalance = user?.walletBalance || 0;

    return (
        <AnimatedPage>
            <Breadcrumb crumbs={crumbs} />
            <div className="min-h-[60vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12"
                    >
                        <div className="lg:col-span-2">
                             <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-center lg:text-left">My Wallet</h1>
                            <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
                                <Wallet size={48} />
                                <p className="mt-4 text-lg font-medium opacity-80">Current Balance</p>
                                <p className="text-5xl font-bold tracking-tight">
                                    ₱{walletBalance.toFixed(2)}
                                </p>
                            </div>

                            <div className="mt-8 bg-slate-100/80 backdrop-blur-md border border-slate-200 p-8 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Request Funds</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount</label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <DollarSign className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="block w-full rounded-md border-slate-300 bg-slate-50/50 pl-10 pr-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0.01"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                                    >
                                        Submit Request
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <h2 className="text-2xl font-bold text-slate-800 text-center lg:text-left">Transaction History</h2>
                            <div className="mt-6 bg-slate-100/80 backdrop-blur-md border border-slate-200 p-6 rounded-lg shadow-md">
                                {myTransactions.length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">No transactions yet.</p>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-200">
                                                <thead className="bg-slate-50/50">
                                                    <tr>
                                                        <th onClick={() => requestSort('amount')} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                                                            <div className="flex items-center gap-1">Amount <ArrowUpDown size={14} /></div>
                                                        </th>
                                                        <th onClick={() => requestSort('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                                                             <div className="flex items-center gap-1">Date <ArrowUpDown size={14} /></div>
                                                        </th>
                                                        <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                                                            <div className="flex items-center gap-1">Status <ArrowUpDown size={14} /></div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {paginatedTransactions.map(transaction => {
                                                        const { badge, icon } = getStatusAppearance(transaction.status);
                                                        return (
                                                            <tr key={transaction.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                                    ₱{transaction.amount.toFixed(2)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                                    {new Date(transaction.createdAt).toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
                                                                        {icon}
                                                                        <span>{transaction.status}</span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        {totalPages > 1 && (
                                            <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
                                                <span className="text-sm text-slate-600">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <div className="space-x-2">
                                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-100">Previous</button>
                                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-100">Next</button>
                                                </div>
                                            </nav>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

// FIX: Added default export to resolve module import error.
export default MyWalletPage;
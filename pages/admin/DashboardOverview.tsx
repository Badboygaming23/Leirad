import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StatCard from '../../components/admin/StatCard';
import SalesChart from '../../components/admin/SalesChart';
import OrderTrendChart from '../../components/admin/OrderTrendChart';
import { DollarSign, Users, ShoppingBag, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const DashboardOverview: React.FC = () => {
  const { orders, users, products } = useAppContext();

  const totalSales = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.subtotal, 0);

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  return (
    <div className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard 
            title="Total Sales" 
            value={totalSales} 
            icon={<DollarSign />} 
            color="from-green-400 to-green-600"
            isCurrency
        />
        <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={<Users />} 
            color="from-blue-400 to-blue-600"
        />
        <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon={<ShoppingBag />} 
            color="from-purple-400 to-purple-600"
        />
        <StatCard 
            title="Total Orders" 
            value={totalOrders} 
            icon={<Package />} 
            color="from-orange-400 to-orange-600"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SalesChart orders={orders} />
        </motion.div>
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <OrderTrendChart orders={orders} />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
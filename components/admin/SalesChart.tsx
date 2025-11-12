import React, { useMemo } from 'react';
import { Order } from '../../types';
import { motion } from 'framer-motion';

interface SalesChartProps {
  orders: Order[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        total: 0,
      };
    }).reverse();

    orders.forEach(order => {
      if (order.status === 'Delivered') {
        const orderDate = new Date(order.createdAt);
        const monthIndex = months.findIndex(
          m => m.name === orderDate.toLocaleString('default', { month: 'short' }) && m.year === orderDate.getFullYear()
        );
        if (monthIndex !== -1) {
          months[monthIndex].total += order.total;
        }
      }
    });

    return months;
  }, [orders]);

  const maxSale = Math.max(...chartData.map(d => d.total));
  const yAxisLabels = [0, maxSale * 0.25, maxSale * 0.5, maxSale * 0.75, maxSale].map(v => Math.ceil(v / 100) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales (Last 12 Months)</h3>
      <div className="flex" style={{ height: '300px' }}>
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-4">
          {yAxisLabels.reverse().map(label => (
            <span key={label}>₱{label.toLocaleString()}</span>
          ))}
        </div>
        <div className="w-full grid grid-cols-12 gap-2 items-end border-l border-gray-200 pl-4">
          {chartData.map((month, index) => (
            <div key={`${month.name}-${month.year}`} className="flex flex-col items-center">
              <motion.div
                className="w-full bg-indigo-500 rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: `${maxSale > 0 ? (month.total / maxSale) * 100 : 0}%` }}
                transition={{ duration: 0.8, delay: index * 0.05, type: 'spring', stiffness: 100, damping: 20 }}
              />
              <span className="text-xs text-gray-500 mt-2">{month.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
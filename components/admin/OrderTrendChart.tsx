import React, { useMemo } from 'react';
import { Order } from '../../types';
import { motion } from 'framer-motion';

interface OrderTrendChartProps {
  orders: Order[];
}

const OrderTrendChart: React.FC<OrderTrendChartProps> = ({ orders }) => {
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        orderCount: 0,
      };
    }).reverse();

    let cumulativeOrders = 0;
    const historicalOrders = orders
        .filter(o => new Date(o.createdAt) < new Date(months[0].year, months[0].name === 'Jan' ? 0 : new Date(Date.parse(months[0].name +" 1, 2012")).getMonth()))
        .length;
    
    cumulativeOrders += historicalOrders;

    return months.map(month => {
        const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toLocaleString('default', { month: 'short' }) === month.name && orderDate.getFullYear() === month.year;
        }).length;
        cumulativeOrders += monthOrders;
        return { ...month, cumulativeOrders };
    });
  }, [orders]);

  const maxOrders = Math.max(...chartData.map(d => d.cumulativeOrders), 1); // Avoid division by zero
  const yAxisLabels = [0, maxOrders * 0.25, maxOrders * 0.5, maxOrders * 0.75, maxOrders].map(v => Math.ceil(v));

  // SVG path generation
  const path = useMemo(() => {
    if (chartData.length < 2) return "";
    const width = 500;
    const height = 200;
    let pathD = `M 0,${height - (chartData[0].cumulativeOrders / maxOrders) * height}`;
    chartData.forEach((point, i) => {
      if (i > 0) {
        const x = (i / (chartData.length - 1)) * width;
        const y = height - (point.cumulativeOrders / maxOrders) * height;
        pathD += ` L ${x},${y}`;
      }
    });
    return pathD;
  }, [chartData, maxOrders]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cumulative Order Growth</h3>
      <div className="flex" style={{ height: '300px' }}>
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-4 h-full" style={{ height: '200px', marginTop: '20px' }}>
            {yAxisLabels.reverse().map(label => (
                <span key={label}>{label}</span>
            ))}
        </div>
        <div className="w-full relative border-l border-gray-200 pl-4">
            <svg width="100%" height="240" viewBox="0 0 500 200" preserveAspectRatio="none" className="absolute top-0 left-4">
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                </defs>
            </svg>
             <div className="absolute bottom-0 w-full grid grid-cols-12 gap-2 items-end h-full">
                {chartData.map((month) => (
                    <div key={`${month.name}-${month.year}`} className="flex flex-col items-center justify-end h-full">
                    <span className="text-xs text-gray-500 mt-2">{month.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrendChart;
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isCurrency?: boolean;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isCurrency = false }) => {
    const [isPulsing, setIsPulsing] = useState(false);
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (prevValueRef.current !== value) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [value]);
    
    useEffect(() => {
        prevValueRef.current = value;
    }, [value]);

    const formattedValue = isCurrency ? `₱${value.toFixed(2)}` : value.toString();

    return (
        <motion.div
            variants={itemVariants}
            className={`relative bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 overflow-hidden`}
        >
            <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={isPulsing ? { scale: 3, opacity: [0, 1, 0] } : {}}
                transition={isPulsing ? { duration: 1.5, ease: 'easeInOut' } : {}}
            />
            <div className="relative flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-medium opacity-80">{title}</p>
                    <p className="text-3xl font-bold">{formattedValue}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
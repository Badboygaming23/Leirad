import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-10 h-10 flex items-center justify-center overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={theme === 'dark' ? 'moon' : 'sun'}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="absolute"
        >
          {theme === 'dark' ? (
            <Sun className="h-6 w-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500 group-hover:text-indigo-600 transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;

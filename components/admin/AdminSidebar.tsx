import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  tabs: { id: string; name: string; icon: React.ReactNode }[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const SidebarContent: React.FC<{
    tabs: AdminSidebarProps['tabs'];
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    isCollapsed: boolean;
    isMobile?: boolean;
}> = ({ tabs, activeTab, setActiveTab, isCollapsed, isMobile = false }) => (
    <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {tabs.map(tab => (
            <div key={tab.id} className="relative group">
                <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${(isCollapsed && !isMobile) ? 'justify-center' : ''} ${
                        activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    aria-label={tab.name}
                >
                    {tab.icon}
                    {(!isCollapsed || isMobile) && <span className="whitespace-nowrap">{tab.name}</span>}
                </button>
                {(isCollapsed && !isMobile) && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {tab.name}
                    </div>
                )}
            </div>
        ))}
    </nav>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ tabs, activeTab, setActiveTab, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex fixed top-16 left-0 bg-slate-800 text-white flex-col h-[calc(100vh-4rem)] shadow-lg z-30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="relative flex items-center justify-center h-16 border-b border-slate-700 flex-shrink-0">
                <Link to="/" className={`flex items-center space-x-2 overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <ShoppingBag className="h-7 w-7 text-indigo-400 flex-shrink-0" />
                    <span className="text-xl font-bold text-white whitespace-nowrap">Luxe Admin</span>
                </Link>
                <button 
                   onClick={() => setIsCollapsed(!isCollapsed)}
                   className="p-1 rounded-full text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white transition-colors absolute right-0 translate-x-1/2 top-5 border-4 border-slate-800 focus:outline-none"
                   aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                 >
                   {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                 </button>
            </div>
            <SidebarContent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
            {isMobileOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.aside
                        className="fixed top-0 left-0 bg-slate-800 text-white flex flex-col h-full shadow-lg z-40 w-64"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center justify-between h-16 border-b border-slate-700 flex-shrink-0 px-4">
                            <Link to="/" className="flex items-center space-x-2">
                                <ShoppingBag className="h-7 w-7 text-indigo-400" />
                                <span className="text-xl font-bold text-white">Luxe Admin</span>
                            </Link>
                            <button 
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white"
                                aria-label="Close sidebar"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <SidebarContent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={false} isMobile={true} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
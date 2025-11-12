import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

const AnnouncementBanner: React.FC = () => {
    const { announcements } = useAppContext();
    const [isVisible, setIsVisible] = useState(true);

    const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

    if (!latestAnnouncement || !isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0, padding: 0, margin: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-indigo-600 text-white rounded-lg p-4 mb-8 flex items-start gap-4"
            >
                <div className="flex-shrink-0">
                    <Megaphone className="h-6 w-6" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-base">{latestAnnouncement.title}</h3>
                    <p className="text-sm mt-1">{latestAnnouncement.content}</p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Dismiss announcement"
                >
                    <X className="h-5 w-5" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnnouncementBanner;
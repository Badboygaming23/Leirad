import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100/80 backdrop-blur-sm border-b border-slate-200/50">
      <motion.ol
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 py-3"
      >
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            <motion.div variants={itemVariants} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
              )}
              <Link
                to={crumb.path}
                className={`ml-2 text-sm font-medium ${
                  index === crumbs.length - 1
                    ? 'text-slate-500 pointer-events-none'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-current={index === crumbs.length - 1 ? 'page' : undefined}
              >
                {crumb.name}
              </Link>
            </motion.div>
          </li>
        ))}
      </motion.ol>
    </nav>
  );
};

export default Breadcrumb;
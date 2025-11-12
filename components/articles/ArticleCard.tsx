import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
    >
      <Link to={article.link} className="flex flex-col h-full">
        <div className="aspect-w-3 aspect-h-2 bg-gray-200">
          <img src={article.imageUrl} alt={article.title} className="h-48 w-full object-cover object-center" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-3 flex-grow">{article.excerpt}</p>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full object-cover" src={article.authorImageUrl} alt={article.author} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{article.author}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
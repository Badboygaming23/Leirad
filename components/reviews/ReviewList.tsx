import React from 'react';
import { Review } from '../../types';
import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewListProps {
  reviews: Review[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Customer Reviews</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-6 space-y-10"
      >
        {reviews.map((review) => (
          <motion.div key={review.id} variants={itemVariants} className="flex flex-col sm:flex-row gap-4 p-6 bg-slate-100/50 backdrop-blur-sm rounded-lg border border-slate-200/50">
            <div className="flex-shrink-0 text-center sm:text-left sm:w-48">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <User className="h-6 w-6 text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{review.userName}</h4>
                <p className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="mt-4 text-base text-slate-600">{review.comment}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ReviewList;
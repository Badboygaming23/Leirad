import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { OrderItem } from '../../types';
import { Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: OrderItem | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, product }) => {
    const { addReview } = useAppContext();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setHoverRating(0);
            setComment('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        if (product) {
            setIsLoading(true);
            await addReview(product.productId, rating, comment);
            setIsLoading(false);
            onClose();
        }
    };
    
    if (!product) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reviewing: ${product.name}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={32}
                                    className={`cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-300'
                                    }`}
                                    fill="currentColor"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">Your Review (optional)</label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Tell us what you thought..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                        Cancel
                    </button>
                    <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
                        Submit Review
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ReviewModal;
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => Promise<void>;
  defaultValues?: Product | null;
  mode: 'add' | 'edit';
  resellerStoreId?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode, resellerStoreId }) => {
  const { stores, products } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  
  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
  }, [products]);

  const getInitialState = () => ({
    name: '',
    description: '',
    price: 0,
    imageUrls: [] as string[],
    category: '',
    storeId: resellerStoreId || stores[0]?.id || '',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [imageUrlsText, setImageUrlsText] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  
  const isAdminAndNoStores = !resellerStoreId && stores.length === 0;
  const isNewCategory = formData.category === '--new--';

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && defaultValues) {
        setFormData({ ...defaultValues });
        setImageUrlsText(defaultValues.imageUrls.join(', '));
        if (!uniqueCategories.includes(defaultValues.category)) {
          setFormData(prev => ({...prev, category: '--new--'}));
          setCustomCategory(defaultValues.category);
        } else {
          setCustomCategory('');
        }
      } else {
        setFormData(getInitialState());
        setImageUrlsText('');
        setCustomCategory('');
      }
    }
  }, [isOpen, defaultValues, mode, stores, resellerStoreId, uniqueCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageUrlsText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminAndNoStores) return;
    
    setIsLoading(true);
    const urls = imageUrlsText.split(',').map(url => url.trim()).filter(url => url);
    const category = isNewCategory ? customCategory : formData.category;
    
    if (!category) {
        toast.error("Please select or create a category.");
        setIsLoading(false);
        return;
    }

    let finalData = { ...defaultValues, ...formData, imageUrls: urls, category };
    if (resellerStoreId) {
        finalData.storeId = resellerStoreId;
    }
    await onSubmit(finalData);
    setIsLoading(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} Product`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isAdminAndNoStores} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required step="0.01" className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
                <textarea name="imageUrls" value={imageUrlsText} onChange={handleImageUrlsChange} placeholder="https://.../img1.jpg, https://.../img2.jpg" required rows={3} className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                    name="category" 
                    value={isNewCategory ? '--new--' : formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200"
                >
                    <option value="" disabled>Select a category</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="--new--">Add New Category...</option>
                </select>
                {isNewCategory && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                        className="overflow-hidden"
                    >
                        <input 
                            type="text" 
                            value={customCategory} 
                            onChange={e => setCustomCategory(e.target.value)} 
                            placeholder="New category name" 
                            required 
                            className="block w-full p-2 border rounded-md"
                        />
                    </motion.div>
                )}
            </div>
            
            {!resellerStoreId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Store</label>
                <select name="storeId" value={formData.storeId} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200">
                    <option value="" disabled>Select a store</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
        </fieldset>

        {isAdminAndNoStores && (
            <p className="mt-2 text-sm text-red-600">
                You must add a store before you can add a product.
            </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={isAdminAndNoStores}
            className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            {mode === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => Promise<void>;
  defaultValues?: Product | null;
  mode: 'add' | 'edit';
  resellerStoreId?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode, resellerStoreId }) => {
  const { stores } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

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
  
  const isAdminAndNoStores = !resellerStoreId && stores.length === 0;

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && defaultValues) {
        setFormData({ ...defaultValues });
        setImageUrlsText(defaultValues.imageUrls.join(', '));
      } else {
        setFormData(getInitialState());
        setImageUrlsText('');
      }
    }
  }, [isOpen, defaultValues, mode, stores, resellerStoreId]);

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
    let finalData = { ...defaultValues, ...formData, imageUrls: urls };
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
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="mt-1 block w-full p-2 border rounded-md disabled:bg-gray-200" />
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
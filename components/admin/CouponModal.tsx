import React, { useState, useEffect } from 'react';
import { Coupon } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: any) => Promise<void>;
  defaultValues?: Coupon | null;
  mode: 'add' | 'edit';
}

const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const getInitialState = () => ({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    isActive: true,
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
        if (mode === 'edit' && defaultValues) {
            setFormData({ ...defaultValues });
        } else {
            setFormData(getInitialState());
        }
    }
  }, [isOpen, defaultValues, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'discountValue' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ ...defaultValues, ...formData });
    setIsLoading(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} Coupon`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="e.g. SAVE10" required className="mt-1 block w-full p-2 border rounded-md uppercase" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                <select name="discountType" value={formData.discountType} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Value ({formData.discountType === 'percentage' ? '%' : '₱'})</label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required step={formData.discountType === 'percentage' ? '1' : '0.01'} min="0" className="mt-1 block w-full p-2 border rounded-md" />
            </div>
        </div>
        
        <div className="flex items-center">
            <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-gray-100" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            {mode === 'add' ? 'Add Coupon' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CouponModal;
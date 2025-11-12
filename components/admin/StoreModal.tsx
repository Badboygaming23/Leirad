import React, { useState, useEffect } from 'react';
import { Store } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: any) => Promise<void>;
  defaultValues?: Store | null;
  mode: 'add' | 'edit';
}

const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const { users } = useAppContext();
  const resellers = users.filter(u => u.role === 'reseller');
  const [isLoading, setIsLoading] = useState(false);
  
  const getInitialState = () => ({
    name: '',
    description: '',
    logoUrl: '',
    ownerId: resellers.length > 0 ? resellers[0].id : '',
  });
  
  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
        if (mode === 'edit' && defaultValues) {
            setFormData({ name: defaultValues.name, description: defaultValues.description, logoUrl: defaultValues.logoUrl, ownerId: defaultValues.ownerId });
        } else {
            setFormData(getInitialState());
        }
    }
  }, [isOpen, defaultValues, mode, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add' && resellers.length === 0) return;
    setIsLoading(true);
    await onSubmit({ ...defaultValues, ...formData });
    setIsLoading(false);
  };
  
  const noResellersAvailable = resellers.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} Store`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Store Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Logo URL</label>
          <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Owner (Reseller)</label>
          <select 
            name="ownerId" 
            value={formData.ownerId} 
            onChange={handleChange} 
            required 
            disabled={noResellersAvailable}
            className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50 disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            {noResellersAvailable ? (
                <option>No resellers available</option>
            ) : (
                resellers.map(r => (
                  <option key={r.id} value={r.id}>{r.email}</option>
                ))
            )}
          </select>
          {mode === 'add' && noResellersAvailable && (
            <p className="mt-2 text-sm text-red-600">
                You must add a user with the 'reseller' role before creating a store.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={mode === 'add' && noResellersAvailable}
            className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {mode === 'add' ? 'Add Store' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StoreModal;
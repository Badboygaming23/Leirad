import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: any) => Promise<void>;
  defaultValues?: User | null;
  mode: 'add' | 'edit';
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' as UserRole });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (mode === 'edit' && defaultValues) {
            setFormData({ email: defaultValues.email, password: '', role: defaultValues.role });
        } else {
            setFormData({ email: '', password: '', role: 'customer' });
        }
    }
  }, [isOpen, defaultValues, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const finalData = {
      ...defaultValues,
      ...formData,
      password: formData.password || defaultValues?.password,
    };
    await onSubmit(finalData);
    setIsLoading(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} User`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={mode === 'edit' ? 'Leave blank to keep current' : ''} required={mode === 'add'} className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-slate-50/50">
            <option value="customer">Customer</option>
            <option value="reseller">Reseller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
          <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            {mode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
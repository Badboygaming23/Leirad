import React, { useState, useEffect } from 'react';
import { Advertisement } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ad: any) => Promise<void>;
  defaultValues?: Advertisement | null;
  mode: 'add' | 'edit';
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const getInitialState = () => ({
    title: '', imageUrl: '', link: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ ...defaultValues, ...formData });
    setIsLoading(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} Advertisement`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="block w-full p-2 border rounded-md" />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="block w-full p-2 border rounded-md" />
        <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link (e.g., /products)" required className="block w-full p-2 border rounded-md" />
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            {mode === 'add' ? 'Add Ad' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdModal;
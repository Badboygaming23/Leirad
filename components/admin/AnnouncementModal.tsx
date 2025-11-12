import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcement: any) => Promise<void>;
  defaultValues?: Announcement | null;
  mode: 'add' | 'edit';
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const getInitialState = () => ({
    title: '', content: ''
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
        if (mode === 'edit' && defaultValues) {
            setFormData({ title: defaultValues.title, content: defaultValues.content });
        } else {
            setFormData(getInitialState());
        }
    }
  }, [isOpen, defaultValues, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ ...defaultValues, ...formData });
    setIsLoading(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} Announcement`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Announcement Title" required className="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Announcement details..." required rows={5} className="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <Button type="submit" isLoading={isLoading} className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            {mode === 'add' ? 'Publish' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AnnouncementModal;
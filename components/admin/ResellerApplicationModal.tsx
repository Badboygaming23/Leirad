import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { ResellerApplication } from '../../types';
import Button from '../ui/Button';
import { Building, FileText, Home, Image, Mail, Phone, User } from 'lucide-react';

interface ResellerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ResellerApplication | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div>
        <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2 mb-3">
            {icon} {title}
        </h4>
        <div className="space-y-2 text-sm text-slate-600 bg-slate-50/50 p-4 rounded-md border border-slate-200">
            {children}
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2">
        <span className="font-medium text-slate-500">{label}:</span>
        <span className="col-span-2 text-slate-800">{value || 'N/A'}</span>
    </div>
);

const ResellerApplicationModal: React.FC<ResellerApplicationModalProps> = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
}) => {
    const [loadingAction, setLoadingAction] = useState<'approve' | 'reject' | null>(null);

    if (!application) return null;

    const handleConfirm = async (action: 'approve' | 'reject') => {
        setLoadingAction(action);
        if (action === 'approve') {
            await onApprove(application.id);
        } else {
            await onReject(application.id);
        }
        setLoadingAction(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reseller Application: ${application.userEmail}`}>
            <div className="space-y-6">
                <DetailSection title="Applicant Information" icon={<User />}>
                    <DetailRow label="Email" value={application.userEmail} />
                    <DetailRow label="Full Name" value={`${application.shippingInfo.firstName} ${application.shippingInfo.lastName}`} />
                </DetailSection>

                <DetailSection title="Proposed Store Details" icon={<Building />}>
                    <DetailRow label="Store Name" value={application.storeName} />
                    <DetailRow label="Description" value={<p className="whitespace-pre-wrap">{application.storeDescription}</p>} />
                    <DetailRow label="Logo" value={
                        <img src={application.storeLogoUrl} alt="Store Logo Preview" className="w-20 h-20 rounded-md object-cover border" />
                    } />
                </DetailSection>

                 <DetailSection title="Shipping Information" icon={<Home />}>
                    <DetailRow label="Address" value={application.shippingInfo.address} />
                    <DetailRow label="Phone" value={application.shippingInfo.phone} />
                </DetailSection>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                <Button onClick={() => handleConfirm('reject')} isLoading={loadingAction === 'reject'} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
                    Reject
                </Button>
                <Button onClick={() => handleConfirm('approve')} isLoading={loadingAction === 'approve'} className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500">
                    Approve
                </Button>
            </div>
        </Modal>
    );
};

export default ResellerApplicationModal;

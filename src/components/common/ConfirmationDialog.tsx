import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  const confirmBtnColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    primary: 'bg-gov-blue hover:bg-gov-navy text-white'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition ${confirmBtnColors[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-amber-50 text-amber-600 border border-amber-200 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-700 leading-relaxed">{message}</p>
          <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 text-[11px] text-slate-600 font-mono">
            <ShieldCheck className="w-4 h-4 text-gov-blue flex-shrink-0" />
            <span>This action will be committed to the official audit log.</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

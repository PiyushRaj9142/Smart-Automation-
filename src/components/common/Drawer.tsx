import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'lg',
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-900/50 animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          className={`w-screen ${widthClasses[width]} max-w-full sm:max-w-md md:max-w-lg bg-white border-l border-slate-300 shadow-gov-lg flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-gov-navy uppercase tracking-wide truncate">
                {title}
              </h3>
              {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition min-h-[32px] min-w-[32px] flex items-center justify-center flex-shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3.5 sm:p-5 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 flex-wrap">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

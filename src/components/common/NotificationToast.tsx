import React, { useState, useEffect } from 'react';
import { useCadastre } from '../../context/CadastreContext';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationAsRead } = useCadastre();
  const [activeToast, setActiveToast] = useState<any | null>(null);

  // Show latest unread notification as a toast
  useEffect(() => {
    const unread = notifications.filter((n) => n.unread);
    if (unread.length > 0) {
      setActiveToast(unread[0]);
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div
        className="pointer-events-auto p-3.5 rounded-md border shadow-lg flex items-start gap-3 transition-all animate-in slide-in-from-right-5 duration-200 bg-white border-slate-300 text-slate-900"
      >
        <div className="mt-0.5 flex-shrink-0">
          {activeToast.type === 'topology' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : activeToast.type === 'ai' ? (
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          ) : (
            <Info className="w-5 h-5 text-gov-blue" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono tracking-tight uppercase text-gov-navy">
              {activeToast.title}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{activeToast.time}</span>
          </div>
          <p className="text-xs text-slate-700 mt-0.5 leading-snug">{activeToast.message}</p>
        </div>

        <button
          onClick={() => {
            markNotificationAsRead(activeToast.id);
            setActiveToast(null);
          }}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

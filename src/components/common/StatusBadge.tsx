import React from 'react';

export type StatusColorType = 'safe' | 'warning' | 'emergency' | 'offline' | 'blue' | 'purple';

interface StatusBadgeProps {
  status: string;
  type?: StatusColorType;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type,
  size = 'md',
  className = ''
}) => {
  // Infer type from status string if not explicitly given
  let calculatedType: StatusColorType = type || 'offline';
  const upper = status?.toUpperCase() || '';

  if (!type) {
    if (['VERIFIED', 'GOVERNMENT APPROVED', 'SANCTIONED', 'RESOLVED', 'ACTIVE', 'ONLINE', 'COMPLETED', 'SYNCED', 'APPROVED'].includes(upper)) {
      calculatedType = 'safe';
    } else if (['PENDING', 'PENDING VERIFICATION', 'UNDER REVIEW', 'ADMIN REVIEWED', 'TOPOLOGY VALIDATED', 'CORRECTION REQUESTED', 'SURVEYOR VERIFIED', 'PLANNING'].includes(upper)) {
      calculatedType = 'warning';
    } else if (['REJECTED', 'DISCREPANCY', 'MISMATCH', 'FLAGGED', 'OPEN', 'CRITICAL', 'ERROR'].includes(upper)) {
      calculatedType = 'emergency';
    } else if (['PROCESSING', 'AI PROCESSING', 'AI SEGMENTED', 'SYNCING', 'RUNNING'].includes(upper)) {
      calculatedType = 'blue';
    } else if (['OFFLINE', 'IDLE', 'DRAFT'].includes(upper)) {
      calculatedType = 'offline';
    }
  }

  const styles: Record<StatusColorType, string> = {
    safe: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    emergency: 'bg-rose-50 text-rose-800 border-rose-200',
    offline: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const dotStyles: Record<StatusColorType, string> = {
    safe: 'bg-emerald-600',
    warning: 'bg-amber-600',
    emergency: 'bg-rose-600',
    offline: 'bg-slate-400',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium ${styles[calculatedType]} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[calculatedType]}`} />
      <span>{status}</span>
    </span>
  );
};


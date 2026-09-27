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
  pulse = false,
  size = 'md',
  className = ''
}) => {
  // Infer type from status string if not explicitly given
  let calculatedType: StatusColorType = type || 'offline';
  const upper = status?.toUpperCase() || '';

  if (!type) {
    if (['SAFE', 'ACTIVE', 'OPERATIONAL', 'DELIVERED', 'COMPLETED', 'ONLINE', 'RESOLVED', 'SUCCESS', 'INSIDE_SAFE_ZONE', 'AVAILABLE'].includes(upper)) {
      calculatedType = 'safe';
    } else if (['WARNING', 'LOW STOCK', 'PAUSED', 'DELAYED', 'DEGRADED', 'BUFFER_ZONE', 'IN PROGRESS', 'ACKNOWLEDGED', 'HIGH', 'MODERATE', 'MOVING'].includes(upper)) {
      calculatedType = 'warning';
    } else if (['EMERGENCY', 'CRITICAL', 'OUT OF STOCK', 'CANCELLED', 'BREACH_WARNING', 'SEVERE', 'NEW', 'SECURITY_FLAG'].includes(upper)) {
      calculatedType = 'emergency';
    } else if (['OFFLINE', 'IDLE', 'MAINTENANCE', 'PLANNING', 'REGISTERED', 'PACKED', 'DISPATCHED', 'PENDING', 'CHECKPOINT'].includes(upper)) {
      calculatedType = 'offline';
    }
  }

  const styles: Record<StatusColorType, string> = {
    safe: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    emergency: 'bg-red-50 text-red-900 border-red-300 font-semibold',
    offline: 'bg-slate-100 text-slate-700 border-slate-300',
    blue: 'bg-blue-50 text-blue-800 border-blue-300',
    purple: 'bg-indigo-50 text-indigo-800 border-indigo-300'
  };

  const dotStyles: Record<StatusColorType, string> = {
    safe: 'bg-emerald-600',
    warning: 'bg-amber-600',
    emergency: 'bg-red-600',
    offline: 'bg-slate-500',
    blue: 'bg-blue-600',
    purple: 'bg-indigo-600'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-mono tracking-wide uppercase ${styles[calculatedType]} ${sizeStyles[size]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotStyles[calculatedType]} ${pulse || calculatedType === 'emergency' ? 'animate-ping' : ''}`}
      />
      <span>{status}</span>
    </span>
  );
};

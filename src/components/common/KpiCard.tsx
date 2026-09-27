import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'emergency';
  lastUpdated?: string;
  subtext?: string;
  onClick?: () => void;
  statusBorder?: 'default' | 'emerald' | 'amber' | 'red';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral',
  lastUpdated = '10s ago',
  subtext,
  onClick,
  statusBorder = 'default',
  className = ''
}) => {
  const borderStyles = {
    default: 'border-slate-200 hover:border-slate-300',
    emerald: 'border-emerald-300 bg-emerald-50/20',
    amber: 'border-amber-300 bg-amber-50/20',
    red: 'border-red-400 bg-red-50/30'
  };

  const trendColors = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    negative: 'text-slate-600 bg-slate-100 border-slate-200',
    neutral: 'text-blue-700 bg-blue-50 border-blue-200',
    emergency: 'text-red-700 bg-red-100 border-red-300 font-bold animate-pulse'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-md border p-4 shadow-gov transition-all duration-150 ${borderStyles[statusBorder]} ${
        onClick ? 'cursor-pointer hover:shadow-gov-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-gov-navy tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded border font-mono ${trendColors[trendType]}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className="p-2.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          <Icon className="w-5 h-5 text-gov-blue" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{subtext || 'Telemetry Sync: Active'}</span>
        <span className="font-mono text-slate-400">Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

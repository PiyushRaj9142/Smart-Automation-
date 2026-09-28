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
  lastUpdated,
  subtext,
  onClick,
  statusBorder = 'default',
  className = ''
}) => {
  const borderStyles = {
    default: 'border-slate-200 hover:border-slate-300',
    emerald: 'border-emerald-200 bg-emerald-50/30',
    amber: 'border-amber-200 bg-amber-50/30',
    red: 'border-rose-200 bg-rose-50/30'
  };

  const trendColors = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    negative: 'text-slate-600 bg-slate-100 border-slate-200',
    neutral: 'text-blue-700 bg-blue-50 border-blue-200',
    emergency: 'text-rose-700 bg-rose-50 border-rose-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border p-4 shadow-xs transition duration-150 ${borderStyles[statusBorder]} ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-slate-500 block mb-1 truncate">
            {label}
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-gov-navy tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${trendColors[trendType]}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-md bg-slate-50 text-gov-blue border border-slate-200 flex-shrink-0">
          <Icon className="w-4 h-4 text-gov-blue" />
        </div>
      </div>

      {(subtext || lastUpdated) && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{subtext || 'Telemetry Active'}</span>
          {lastUpdated && <span className="text-slate-400 font-mono text-[10px] ml-2 flex-shrink-0">{lastUpdated}</span>}
        </div>
      )}
    </div>
  );
};


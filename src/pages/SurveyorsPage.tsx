import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Smartphone,
  Radio,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  BatteryCharging,
  Wifi
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

interface SurveyorsPageProps {
  onSwitchToSurveyorPortal?: () => void;
  onNavigateToMap?: () => void;
}

export const SurveyorsPage: React.FC<SurveyorsPageProps> = ({
  onSwitchToSurveyorPortal,
  onNavigateToMap
}) => {
  const { surveyors, setCurrentRole, selectedProject } = useCadastre();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSurveyors = surveyors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.officialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedZone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase rounded font-mono">
              Field Operations Directorate
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500">
              Project: <strong className="text-slate-800">{selectedProject.name}</strong>
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Users className="w-5 h-5 text-gov-blue" />
            <span>Field Surveyor Roster & GNSS Terminal Device Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor ground survey teams, real-time CORS RTK receiver telemetry, parcel workload allocation, and field verification throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToSurveyorPortal && (
            <button
              onClick={onSwitchToSurveyorPortal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter Field Surveyor Portal Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Surveyor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSurveyors.map((surveyor) => (
          <div
            key={surveyor.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-gov-blue transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                    {surveyor.officialId}
                  </span>
                  <h3 className="text-sm font-bold text-gov-navy mt-1">{surveyor.name}</h3>
                  <div className="text-[11px] text-slate-500">{surveyor.assignedZone}</div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase flex items-center gap-1 ${
                    surveyor.status === 'Online / In Field'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      surveyor.status === 'Online / In Field' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>{surveyor.status}</span>
                </span>
              </div>

              {/* Workload Progress */}
              <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Parcels Assigned:</span>
                  <span className="font-mono font-bold text-slate-900">{surveyor.assignedParcelsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified (RTK):</span>
                  <span className="font-mono font-bold text-emerald-700">{surveyor.verifiedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Fieldwork:</span>
                  <span className="font-mono font-bold text-amber-700">{surveyor.pendingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discrepancies Flagged:</span>
                  <span className="font-mono font-bold text-red-600">{surveyor.discrepancyCount}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>Verification Progress</span>
                    <span>
                      {Math.round((surveyor.verifiedCount / surveyor.assignedParcelsCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{
                        width: `${(surveyor.verifiedCount / surveyor.assignedParcelsCount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Device Telemetry Footer */}
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono space-y-1 mt-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-gov-blue" />
                  <span>{surveyor.activeDeviceId}</span>
                </span>
                <span className="text-emerald-700 font-bold">RTK FIXED</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>Last Sync: {surveyor.lastSync}</span>
                <span>★ {surveyor.accuracyRating} Rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Field Operations Guidelines Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-50 text-gov-blue">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wide">
              Standard Operating Procedure (SOP) for Cadastral Verification
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Field surveyors must maintain RTK FIX (PDOP &lt; 2.0) with at least 4 physical compound boundary corner photo benchmarks per parcel.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentRole('FIELD_SURVEYOR');
          }}
          className="px-3.5 py-1.5 bg-gov-navy text-white hover:bg-slate-800 rounded text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
        >
          <span>Open Surveyor Field App</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

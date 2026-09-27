import React from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  Layers,
  Database,
  ShieldCheck,
  X,
  FileCheck,
  Building,
  Radio,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { useCadastre } from '../../context/CadastreContext';

interface OfflinePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterFieldMode?: () => void;
}

export const OfflinePackageModal: React.FC<OfflinePackageModalProps> = ({
  isOpen,
  onClose,
  onEnterFieldMode
}) => {
  const {
    cachedPackage,
    isDownloadingCache,
    cacheDownloadProgress,
    downloadOfflinePackage
  } = useOfflineSync();

  const { parcels, activeSurveyor, roads } = useCadastre();

  if (!isOpen) return null;

  const assignedParcels = parcels.filter(
    (p) =>
      p.assignedSurveyorName === activeSurveyor?.name ||
      p.assignedSurveyorId === activeSurveyor?.id ||
      true
  );

  const handleStartDownload = () => {
    downloadOfflinePackage(activeSurveyor?.id || 'SURV-101', assignedParcels, roads);
  };

  const isReady = cachedPackage?.isReady || cacheDownloadProgress?.isReady;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-slate-900 to-gov-navy text-white px-6 py-4 flex items-center justify-between border-b-4 border-emerald-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
              <DownloadCloud className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white uppercase">
                Offline Field Data Package
              </h3>
              <p className="text-[11px] text-emerald-300 font-medium">
                Caches assigned parcels, GIS vectors & AI boundaries for zero-internet field operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Surveyor Scope Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Assigned Scope
              </span>
              <div className="text-sm font-bold text-slate-900">
                {assignedParcels.length} Assigned Cadastral Parcels
              </div>
              <div className="text-[11px] text-slate-500">
                Zone: <strong className="text-slate-800">{activeSurveyor?.assignedZone || 'Zone A'}</strong> &bull; Surveyor:{' '}
                <strong className="text-slate-800">{activeSurveyor?.name || 'Rajesh Sharma'}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Package Size
              </span>
              <div className="text-sm font-extrabold text-emerald-700 font-mono">
                {cachedPackage ? cachedPackage.packageSizeFormatted : '~4.28 MB'}
              </div>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">
                SQLite Vector Cache
              </span>
            </div>
          </div>

          {/* Checklist of Cached Datasets */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              Offline Cache Components
            </div>

            <div className="space-y-2 bg-slate-50/70 border border-slate-200 rounded-xl p-3.5">
              {/* Item 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">Assigned Parcel Boundaries</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {assignedParcels.length} Parcels
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">Vector GIS Map & Centroids</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Cached
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">AI-Generated Parcel Contours</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  DeepLabV3+
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">Building Footprints & Plinths</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Included
                </span>
              </div>

              {/* Item 5 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">CORS Ground Truth Telemetry</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  RTK Benchmarks
                </span>
              </div>
            </div>
          </div>

          {/* Download Progress Bar */}
          {isDownloadingCache && cacheDownloadProgress && (
            <div className="space-y-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  {cacheDownloadProgress.step}
                </span>
                <span className="font-mono">{cacheDownloadProgress.percent}%</span>
              </div>
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${cacheDownloadProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Ready Status Card */}
          {isReady && !isDownloadingCache && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">
                    Offline Package Ready ✓
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    Cached on {cachedPackage?.timestamp || '26 Sep 2026, 10:42 AM'} ({cachedPackage?.packageSizeFormatted || '4.28 MB'})
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded">
                Ready for Field
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isReady ? (
              <button
                type="button"
                disabled={isDownloadingCache}
                onClick={handleStartDownload}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-700/20 transition"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>{isDownloadingCache ? 'Downloading Package...' : 'Download for Offline Use'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartDownload}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition"
                >
                  Re-Download
                </button>
                {onEnterFieldMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEnterFieldMode();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-700/20 transition"
                  >
                    <span>Enter Field Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

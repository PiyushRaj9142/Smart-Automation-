import React, { useState } from 'react';
import {
  UserCheck,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Edit,
  Save,
  Check,
  X,
  Compass,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { CadastralMap } from '../components/gis/CadastralMap';

export const FieldMobilePage: React.FC = () => {
  const {
    parcels,
    selectedParcel,
    selectParcelById,
    verifyParcelBySurveyor,
    activeSurveyor,
    updateParcelBoundary
  } = useCadastre();

  const [remarks, setRemarks] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'map' | 'details' | 'list'>('details');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeParcel = selectedParcel || parcels[0];

  const handleVerify = () => {
    if (!activeParcel) return;
    verifyParcelBySurveyor(
      activeParcel.id,
      remarks || 'Verified on field tablet with RTK-CORS ±2.1cm fix.'
    );
    setFeedback(`✓ ${activeParcel.id} verified and signed!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col pb-24 text-xs select-none">
      {/* Mobile Top App Bar */}
      <div className="bg-gov-navy text-white p-3 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition"
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="font-bold text-xs">CADASTRAL SURVEYOR MOBILE</div>
            <div className="text-[10px] text-slate-300 font-mono">
              {activeSurveyor.officialId} &bull; {activeSurveyor.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>RTK FIX ±2.1cm</span>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="grid grid-cols-3 bg-white border-b border-slate-200 text-center font-bold text-xs sticky top-12 z-20">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2.5 border-b-2 transition ${
            activeTab === 'details'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-600'
          }`}
        >
          Verification
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`py-2.5 border-b-2 transition ${
            activeTab === 'map'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-600'
          }`}
        >
          GIS Viewport
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2.5 border-b-2 transition ${
            activeTab === 'list'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-600'
          }`}
        >
          Docket ({parcels.length})
        </button>
      </div>

      {/* Main Mobile Body */}
      <div className="p-3 space-y-3 flex-1">
        {feedback && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded text-emerald-900 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && activeParcel && (
          <div className="space-y-3">
            {/* Parcel Quick Header */}
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold text-gov-navy">
                  {activeParcel.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    activeParcel.gtStatus === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {activeParcel.gtStatus === 'Verified' ? '✓ Verified' : 'Pending Check'}
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900">{activeParcel.ownerName}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                Khasra: {activeParcel.khasraNo} &bull; Ward: {activeParcel.ward}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Area:</span>
                  <div className="font-bold text-slate-800">{activeParcel.areaSqM} m²</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">AI Confidence:</span>
                  <div className="font-bold text-blue-700">{activeParcel.aiConfidence}%</div>
                </div>
              </div>
            </div>

            {/* GNSS Live Coordinates Box */}
            <div className="bg-slate-900 text-white rounded-lg p-3 border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>RTK CORS TELEMETRY</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Lat: {activeParcel.gnssData.latitude.toFixed(6)}°</div>
                <div>Lng: {activeParcel.gnssData.longitude.toFixed(6)}°</div>
                <div>Elev: {activeParcel.gnssData.elevationM}m</div>
                <div className="text-emerald-400 font-bold">Acc: ±{activeParcel.gnssData.accuracyCm}cm</div>
              </div>
            </div>

            {/* Mini Map Snapshot */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <CadastralMap height="h-[180px]" showControls={false} />
            </div>

            {/* Field Remarks Input */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase text-[10px]">
                Field Remarks & Cornerstone Check
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Physical compound stones verified, offset with road is clear..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Submit Verification Button */}
            <button
              onClick={handleVerify}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Verify & Digitally Stamp Parcel</span>
            </button>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <CadastralMap height="h-[520px]" showControls={true} />
          </div>
        )}

        {/* LIST TAB */}
        {activeTab === 'list' && (
          <div className="space-y-2">
            {parcels.map((p) => {
              const isSelected = activeParcel?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    selectParcelById(p.id);
                    setActiveTab('details');
                  }}
                  className={`p-3 rounded-lg border bg-white transition cursor-pointer ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-gov-navy text-xs">{p.id}</span>
                    <span className="text-[10px] text-slate-500">{p.areaSqM} m²</span>
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">{p.ownerName}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Khasra: {p.khasraNo} &bull; {p.approvalStatus}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

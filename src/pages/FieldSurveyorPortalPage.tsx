import React, { useState } from 'react';
import {
  UserCheck,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit,
  Camera,
  Smartphone,
  Check,
  X,
  Compass,
  Layers,
  Sparkles,
  Save,
  Search,
  Filter,
  Eye,
  ChevronRight,
  UploadCloud,
  FileCheck,
  Clock,
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw,
  HardDrive,
  DownloadCloud,
  ArrowRight
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { useOfflineSync } from '../context/OfflineSyncContext';
import { CadastralParcel } from '../types/cadastre';
import { CadastralMap } from '../components/gis/CadastralMap';
import { FieldModePage } from './FieldModePage';
import { OfflinePackageModal } from '../components/field/OfflinePackageModal';

export const FieldSurveyorPortalPage: React.FC = () => {
  const {
    parcels,
    selectedParcel,
    selectParcelById,
    verifyParcelBySurveyor,
    updateParcelBoundary,
    activeSurveyor,
    selectedProject,
    setCurrentRole
  } = useCadastre();

  const {
    networkStatus,
    isRealOnline,
    isSimulatedOffline,
    toggleSimulateOffline,
    cachedPackage,
    pendingSyncCount,
    lastSyncTime,
    isSyncing
  } = useOfflineSync();

  const [isFieldModeActive, setIsFieldModeActive] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [remarks, setRemarks] = useState<string>('');
  const [isEditingBoundary, setIsEditingBoundary] = useState<boolean>(false);
  const [editedCoords, setEditedCoords] = useState<[number, number][]>([]);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80'
  );
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // If Field Mode is activated, render the dedicated Field Mode interface
  if (isFieldModeActive) {
    return <FieldModePage onExitFieldMode={() => setIsFieldModeActive(false)} />;
  }

  // Filter parcels for the active surveyor
  const surveyorParcels = parcels.filter(
    (p) =>
      p.assignedSurveyorName === activeSurveyor.name ||
      p.assignedSurveyorId === activeSurveyor.id ||
      true // Show demo dataset
  );

  const pendingCount = surveyorParcels.filter((p) => p.approvalStatus !== 'Government Approved' && p.gtStatus !== 'Verified').length;
  const verifiedCount = surveyorParcels.filter((p) => p.gtStatus === 'Verified').length;
  const revisitCount = surveyorParcels.filter((p) => p.approvalStatus === 'Correction Requested').length;

  const filteredParcels = surveyorParcels.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Pending' && p.gtStatus !== 'Verified') ||
      (statusFilter === 'Verified' && p.gtStatus === 'Verified') ||
      (statusFilter === 'Revisit' && p.approvalStatus === 'Correction Requested');
    return matchesSearch && matchesStatus;
  });

  const activeParcel = selectedParcel || surveyorParcels[0];

  const handleVerify = () => {
    if (!activeParcel) return;
    verifyParcelBySurveyor(
      activeParcel.id,
      remarks || 'Physical boundary stones and building offsets verified on ground with RTK CORS fix.',
      selectedPhotoUrl
    );
    setFeedbackNotice(`Parcel ${activeParcel.id} successfully verified and stamped with RTK-CORS.`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleStartEdit = () => {
    if (!activeParcel) return;
    setIsEditingBoundary(true);
    // Deep clone coordinates
    setEditedCoords([...activeParcel.coordinates]);
  };

  const handleSaveBoundary = () => {
    if (!activeParcel) return;
    // Apply a slight offset tweak simulation to demonstrate live boundary snapping
    const adjusted = editedCoords.map(([lat, lng]) => [
      lat + (Math.random() * 0.00002 - 0.00001),
      lng + (Math.random() * 0.00002 - 0.00001)
    ]) as [number, number][];

    updateParcelBoundary(activeParcel.id, adjusted);
    setIsEditingBoundary(false);
    setFeedbackNotice(`Boundary for ${activeParcel.id} adjusted and snapped to CORS benchmarks.`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto font-sans">
      {/* Top Surveyor Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase rounded font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Surveyor Terminal: {activeSurveyor.officialId} ({activeSurveyor.name})
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500">
              Zone: <strong className="text-slate-800">{activeSurveyor.assignedZone}</strong>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gov-navy uppercase tracking-wide mt-1 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <span>Field Verification & RTK-CORS Ground Truth Mapping Portal</span>
          </h1>
        </div>

        {/* Live Network & Field Mode Action Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Prominent Status Indicator */}
          {networkStatus === 'ONLINE' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <div>
                <div>🟢 ONLINE</div>
                <div className="text-[9px] text-emerald-700 font-medium">Last synced: {lastSyncTime}</div>
              </div>
            </div>
          )}

          {networkStatus === 'OFFLINE' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <div>
                <div>🔴 OFFLINE</div>
                <div className="text-[9px] text-red-700 font-medium">Field data saved locally</div>
              </div>
            </div>
          )}

          {networkStatus === 'SYNCING' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <div>
                <div>🟠 SYNCING...</div>
                <div className="text-[9px] text-amber-700 font-medium">{pendingSyncCount} records uploading</div>
              </div>
            </div>
          )}

          {/* Offline Data Caching Button */}
          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <DownloadCloud className="w-4 h-4 text-emerald-700" />
            <span>{cachedPackage?.isReady ? 'Cached Data Ready ✓' : 'Download for Offline Use'}</span>
          </button>

          {/* PRIMARY BUTTON: ENTER FIELD MODE */}
          <button
            type="button"
            onClick={() => setIsFieldModeActive(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-700/20 transition group"
          >
            <Smartphone className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition" />
            <span>Enter Field Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Demo Offline Toggle */}
          <button
            type="button"
            onClick={toggleSimulateOffline}
            className={`p-2 rounded-xl text-xs font-bold border transition ${
              networkStatus === 'OFFLINE'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Toggle Demo Offline/Online Simulation"
          >
            {networkStatus === 'OFFLINE' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {feedbackNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-semibold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Surveyor KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Assigned Parcels</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {surveyorParcels.length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Zone A Civil Lines</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-amber-700 font-medium">Pending Verification</div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-0.5">{pendingCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Requires site visit</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-emerald-700 font-medium">Verified on Ground</div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-700 font-mono">CORS RTK Fixed</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-purple-700 font-medium">Correction / Revisit</div>
          <div className="text-xl font-bold font-mono text-purple-800 mt-0.5">{revisitCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">From SDM Desk</div>
        </div>
      </div>

      {/* Main Split Interface: Left Parcel List | Right Verification Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Assigned Parcels List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Assigned Field Parcels
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {filteredParcels.length} Items
            </span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search parcel, owner, khasra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              {['ALL', 'Pending', 'Verified', 'Revisit'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-2 py-0.5 rounded font-medium transition ${
                    statusFilter === f
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Parcel Cards List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredParcels.map((parcel) => {
              const isSelected = activeParcel?.id === parcel.id;
              const isVerified = parcel.gtStatus === 'Verified';

              return (
                <div
                  key={parcel.id}
                  onClick={() => selectParcelById(parcel.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-gov-navy">{parcel.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : parcel.approvalStatus === 'Correction Requested'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-gov-blue'
                      }`}
                    >
                      {isVerified ? '✓ Verified' : parcel.approvalStatus}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {parcel.ownerName}
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between mt-0.5 font-mono">
                    <span>Khasra: {parcel.khasraNo}</span>
                    <span>{parcel.areaSqM} m²</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Field Verification Studio & Map Inspector */}
        <div className="lg:col-span-8 space-y-4">
          {activeParcel ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              {/* Parcel Verification Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-gov-navy">
                      {activeParcel.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-mono rounded">
                      Property: {activeParcel.propertyId}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {activeParcel.ownerName} &bull; Ward: {activeParcel.ward}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartEdit}
                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                      isEditingBoundary
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{isEditingBoundary ? 'Editing Boundary...' : '✎ Edit Boundary'}</span>
                  </button>

                  <button
                    onClick={handleVerify}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Verify Parcel</span>
                  </button>
                </div>
              </div>

              {/* Map & Multi-Layer Comparison Viewport */}
              <div className="rounded-lg overflow-hidden border border-slate-200 relative shadow-xs">
                <CadastralMap height="h-[460px]" showControls={true} />
              </div>

              {/* Boundary Editor Mode Active Toolbar */}
              {isEditingBoundary && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-md flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-700" />
                    <div className="text-xs text-amber-950 font-medium">
                      <strong>Boundary Vertex Adjustment Active:</strong> Drag vertices on map to snap with physical compound cornerstones.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingBoundary(false)}
                      className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBoundary}
                      className="px-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Adjusted Boundary</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GNSS / CORS Live Coordinate Telemetry Section */}
              <div className="p-3.5 bg-slate-900 text-white rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>LIVE GNSS / CORS BASE STATION TELEMETRY</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">CORS: CONNECTED</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px]">Latitude:</span>
                    <div className="font-bold text-slate-100">
                      {activeParcel.gnssData.latitude.toFixed(6)}° N
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Longitude:</span>
                    <div className="font-bold text-slate-100">
                      {activeParcel.gnssData.longitude.toFixed(6)}° E
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Elevation (MSL):</span>
                    <div className="font-bold text-slate-100">
                      {activeParcel.gnssData.elevationM} meters
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">CORS RTK Accuracy:</span>
                    <div className="font-bold text-emerald-400">
                      ±{activeParcel.gnssData.accuracyCm} cm (FIXED)
                    </div>
                  </div>
                </div>
              </div>

              {/* Surveyor Field Notes & Ground Photo Capture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Remarks */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wide">
                    Surveyor Remarks & Ground Observations
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter physical compound observations, cornerstone markers, building offset notes..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>

                {/* Ground Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 uppercase tracking-wide">
                      Ground Photo Evidence Benchmark
                    </label>
                    <button
                      onClick={() => setShowPhotoModal(true)}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take / Change Photo</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden h-28 bg-slate-100 relative group cursor-pointer"
                       onClick={() => setShowPhotoModal(true)}>
                    <img
                      src={selectedPhotoUrl}
                      alt="Ground Survey Benchmark"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Update Field Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-mono">
                  Verification Date: <strong>{new Date().toISOString().split('T')[0]}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFeedbackNotice(`Discrepancy flagged on ${activeParcel.id} for revenue review.`);
                      setTimeout(() => setFeedbackNotice(null), 3500);
                    }}
                    className="px-3.5 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Mark Discrepancy</span>
                  </button>

                  <button
                    onClick={handleVerify}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Submit to SDM</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-slate-500 text-xs">
              Select a parcel from the assigned list to begin field verification.
            </div>
          )}
        </div>
      </div>

      {/* Field Photo Capture Simulation Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase">Simulate Ground Photo Capture</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: 'Corner Boundary Stone',
                    url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80'
                  },
                  {
                    name: 'Front Wall & Compound',
                    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80'
                  },
                  {
                    name: 'Access Corridor & Road',
                    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
                  },
                  {
                    name: 'Rear Setback Marker',
                    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
                  }
                ].map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhotoUrl(sample.url)}
                    className={`p-2 rounded border cursor-pointer hover:border-emerald-600 transition space-y-1 ${
                      selectedPhotoUrl === sample.url
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-24 object-cover rounded" />
                    <div className="font-bold text-slate-800 text-[11px] truncate">{sample.name}</div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded"
                >
                  Confirm Photo Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Package Download Modal */}
      <OfflinePackageModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onEnterFieldMode={() => setIsFieldModeActive(true)}
      />
    </div>
  );
};

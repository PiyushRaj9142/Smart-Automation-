import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Camera,
  MapPin,
  Layers,
  ChevronLeft,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building,
  FileCheck,
  Clock,
  Sparkles,
  DownloadCloud,
  Edit,
  RotateCcw,
  Save,
  Check,
  X,
  UploadCloud,
  HardDrive,
  CheckCircle,
  HelpCircle,
  Smartphone,
  Compass
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { useOfflineSync } from '../context/OfflineSyncContext';
import { CadastralParcel } from '../types/cadastre';
import { CadastralMap } from '../components/gis/CadastralMap';
import { OfflinePackageModal } from '../components/field/OfflinePackageModal';

interface FieldModePageProps {
  onExitFieldMode: () => void;
}

export const FieldModePage: React.FC<FieldModePageProps> = ({ onExitFieldMode }) => {
  const {
    parcels,
    selectedParcel,
    selectParcelById,
    activeSurveyor,
    selectedProject,
    updateParcelBoundary
  } = useCadastre();

  const {
    networkStatus,
    isRealOnline,
    isSimulatedOffline,
    toggleSimulateOffline,
    cachedPackage,
    offlineQueue,
    pendingSyncCount,
    syncedCount,
    lastSyncTime,
    isSyncing,
    queueVerification,
    queueFieldRemark,
    queueGroundPhoto,
    queueBoundaryEdit,
    queueRejection,
    deleteQueueItem,
    triggerSyncNow,
    syncHistory,
    activeConflicts,
    resolveConflict,
    activeFieldModeTab,
    setActiveFieldModeTab,
    selectedFieldParcelId,
    setSelectedFieldParcelId
  } = useOfflineSync();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Field Verification Form States
  const [fieldRemarks, setFieldRemarks] = useState<string>(
    'Boundary appears approximately 1.5m different from AI-generated boundary near northern edge. Stone pillar aligned.'
  );
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Boundary mismatch');
  const [rejectNotes, setRejectNotes] = useState<string>('');
  const [showPhotoCaptureModal, setShowPhotoCaptureModal] = useState<boolean>(false);
  const [capturedPhotos, setCapturedPhotos] = useState<
    { id: string; url: string; time: string; parcelId: string; status: string }[]
  >([
    {
      id: 'IMG_00421',
      url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
      time: '11:32 AM',
      parcelId: 'PCL-004821',
      status: 'Pending Sync'
    }
  ]);

  const [isEditingBoundary, setIsEditingBoundary] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter surveyor parcels
  const surveyorParcels = parcels.filter(
    (p) =>
      p.assignedSurveyorName === activeSurveyor.name ||
      p.assignedSurveyorId === activeSurveyor.id ||
      true
  );

  const activeParcel =
    parcels.find((p) => p.id === selectedFieldParcelId) ||
    surveyorParcels[0] ||
    parcels[0];

  const verifiedCount = surveyorParcels.filter(
    (p) => p.gtStatus === 'Verified' || p.approvalStatus === 'Surveyor Verified'
  ).length;
  const pendingCount = surveyorParcels.length - verifiedCount;

  const filteredParcels = surveyorParcels.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase());

    const isPendingSync = offlineQueue.some((q) => q.parcelId === p.id);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Pending' && p.gtStatus !== 'Verified') ||
      (statusFilter === 'Verified' && p.gtStatus === 'Verified') ||
      (statusFilter === 'PendingSync' && isPendingSync);

    return matchesSearch && matchesStatus;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Action: Verify Parcel Offline
  const handleVerifyOffline = () => {
    if (!activeParcel) return;
    queueVerification(
      activeParcel.id,
      fieldRemarks || 'Physical boundary verified on ground with RTK CORS fix.',
      capturedPhotos[0]?.url
    );
    showToast(`✓ Parcel ${activeParcel.id} verified and queued for offline synchronization.`);
  };

  // 2. Action: Save Field Remark Offline
  const handleSaveRemark = () => {
    if (!activeParcel) return;
    queueFieldRemark(activeParcel.id, fieldRemarks);
    showToast(`✓ Remark for ${activeParcel.id} saved to offline local queue.`);
  };

  // 3. Action: Capture Photo Offline
  const handleSimulatePhotoCapture = () => {
    if (!activeParcel) return;
    const newPhoto = {
      id: `IMG_${Math.floor(10000 + Math.random() * 90000)}`,
      url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=600&q=80',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      parcelId: activeParcel.id,
      status: 'Pending Sync'
    };
    setCapturedPhotos([newPhoto, ...capturedPhotos]);
    queueGroundPhoto(activeParcel.id, newPhoto.url, 'Ground Boundary Pillar Offset');
    setShowPhotoCaptureModal(false);
    showToast(`📷 Photo ${newPhoto.id} captured and stored locally.`);
  };

  // 4. Action: Save Boundary Edit Offline
  const handleSaveBoundaryEdit = () => {
    if (!activeParcel) return;
    const adjusted = activeParcel.coordinates.map(([lat, lng]) => [
      lat + (Math.random() * 0.00003 - 0.000015),
      lng + (Math.random() * 0.00003 - 0.000015)
    ]) as [number, number][];

    queueBoundaryEdit(activeParcel.id, adjusted);
    updateParcelBoundary(activeParcel.id, adjusted);
    setIsEditingBoundary(false);
    showToast(`✎ Boundary adjustment for ${activeParcel.id} saved to offline sync queue.`);
  };

  // 5. Action: Reject / Needs Revisit Offline
  const handleConfirmRejection = () => {
    if (!activeParcel) return;
    if (!rejectReason) return;
    queueRejection(activeParcel.id, rejectReason, rejectNotes);
    setShowRejectModal(false);
    showToast(`⚠ Rejection for ${activeParcel.id} queued (${rejectReason}).`);
  };

  const isOffline = networkStatus === 'OFFLINE';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 selection:bg-emerald-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP STICKY FIELD TERMINAL BAR */}
      {/* ========================================================================= */}
      <header className="bg-[#0B1528] text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back & Field Mode Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitFieldMode}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Exit Field Mode</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                FIELD MODE
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">&bull;</span>
              <span className="text-xs text-slate-300 hidden md:inline font-mono">
                {activeSurveyor.officialId} ({activeSurveyor.name})
              </span>
            </div>
          </div>

          {/* Right: Live Connection Indicator & Demo Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Live Status Badge */}
            {networkStatus === 'ONLINE' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </div>
            )}

            {networkStatus === 'OFFLINE' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>OFFLINE</span>
              </div>
            )}

            {networkStatus === 'SYNCING' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs">
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span>SYNCING...</span>
              </div>
            )}

            {networkStatus === 'SYNC_COMPLETE' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SYNC COMPLETE</span>
              </div>
            )}

            {/* DEMO / JUDGE SIMULATION BUTTON */}
            <button
              type="button"
              onClick={toggleSimulateOffline}
              title="Click to simulate network disconnection or reconnection for demonstration"
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                isOffline
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-sm'
                  : 'bg-red-600/90 hover:bg-red-500 text-white border-red-400 shadow-sm'
              }`}
            >
              {isOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Restore Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Simulate Offline</span>
                </>
              )}
            </button>

            {/* Download Cache Quick Trigger */}
            <button
              type="button"
              onClick={() => setShowDownloadModal(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
              title="Download / Verify Offline Cache"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white border border-emerald-500/50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* ========================================================================= */}
        {/* 2. FIELD MODE SUMMARY CARD */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                  FIELD MODE
                </span>
                <span className="text-slate-400 text-xs">&bull;</span>
                <span className="text-xs text-slate-500 font-medium">
                  Connection:{' '}
                  {isOffline ? (
                    <strong className="text-red-600 font-bold">🔴 OFFLINE</strong>
                  ) : (
                    <strong className="text-emerald-700 font-bold">🟢 ONLINE</strong>
                  )}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Field Surveyor Terminal & Verification Workspace
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOffline
                  ? 'Operating offline. All boundary verifications, ground photos, and remarks are stored locally on this device.'
                  : 'Connected to state cadastre network. Real-time auto-synchronization active.'}
              </p>
            </div>

            {/* Offline Cache Status Badge */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDownloadModal(true)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition"
              >
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>
                  {cachedPackage?.isReady ? 'Offline Package Ready ✓' : 'Download for Offline Use'}
                </span>
              </button>

              <button
                type="button"
                disabled={isOffline || offlineQueue.length === 0 || isSyncing}
                onClick={triggerSyncNow}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* 5 Stats Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {/* Stat 1: Assigned */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Assigned Parcels</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {surveyorParcels.length}
              </div>
              <span className="text-[10px] text-slate-500">{activeSurveyor.assignedZone}</span>
            </div>

            {/* Stat 2: Verified */}
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Completed</span>
              <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">
                {verifiedCount}
              </div>
              <span className="text-[10px] text-emerald-700">Field Verified</span>
            </div>

            {/* Stat 3: Pending */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800">Pending</span>
              <div className="text-xl font-black text-amber-900 font-mono mt-0.5">
                {pendingCount}
              </div>
              <span className="text-[10px] text-amber-700">Requires Field Visit</span>
            </div>

            {/* Stat 4: Pending Sync */}
            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-800">Pending Sync</span>
              <div className="text-xl font-black text-purple-900 font-mono mt-0.5">
                {pendingSyncCount} <span className="text-xs font-normal">records</span>
              </div>
              <span className="text-[10px] text-purple-700">
                {isOffline ? 'Queued on Device' : 'Auto-Syncing'}
              </span>
            </div>

            {/* Stat 5: Last Sync */}
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-blue-800">Last Sync</span>
              <div className="text-xs font-extrabold text-blue-900 font-mono mt-1 truncate">
                {lastSyncTime}
              </div>
              <span className="text-[10px] text-blue-700">
                {syncedCount} Total Synced
              </span>
            </div>
          </div>

          {/* 4 Action Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveFieldModeTab('parcels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeFieldModeTab === 'parcels'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View Assigned Parcels ({surveyorParcels.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFieldModeTab('verify')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeFieldModeTab === 'verify'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Start Field Verification ({activeParcel?.id || 'Select'})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFieldModeTab('queue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeFieldModeTab === 'queue'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Sync ({pendingSyncCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFieldModeTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeFieldModeTab === 'history'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sync History</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ASSIGNED PARCELS LIST */}
        {/* ========================================================================= */}
        {activeFieldModeTab === 'parcels' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Parcel ID, Khasra, Owner Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Parcels ({surveyorParcels.length})</option>
                  <option value="Pending">Pending Verification ({pendingCount})</option>
                  <option value="Verified">Verified ({verifiedCount})</option>
                  <option value="PendingSync">Pending Sync ({pendingSyncCount})</option>
                </select>
              </div>
            </div>

            {/* Parcels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredParcels.map((parcel) => {
                const isPendingSync = offlineQueue.some((q) => q.parcelId === parcel.id);
                const isVerified = parcel.gtStatus === 'Verified';

                return (
                  <div
                    key={parcel.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition duration-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-base font-extrabold text-slate-900 font-mono">
                            {parcel.id}
                          </span>
                          <div className="text-xs text-slate-500 font-medium">
                            Khasra: <strong>{parcel.khasraNo}</strong> &bull; Khata:{' '}
                            <strong>{parcel.khataNo}</strong>
                          </div>
                        </div>

                        {/* Sync Status Badge */}
                        {isPendingSync ? (
                          <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-full font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending Sync
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full font-mono flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Cached ✓
                          </span>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Area</span>
                          <p className="font-bold text-slate-800 font-mono">{parcel.areaSqM} m²</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Land Use</span>
                          <p className="font-bold text-blue-700">{parcel.landUse}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</span>
                          <p className="font-bold text-emerald-700 font-mono">{parcel.aiConfidence}%</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Verification</span>
                          <p
                            className={`font-bold text-xs ${
                              isVerified ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {isVerified ? 'Verified ✓' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 mt-2 truncate">
                        Owner: <strong>{parcel.ownerName}</strong>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFieldParcelId(parcel.id);
                        selectParcelById(parcel.id);
                        setActiveFieldModeTab('verify');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <span>Verify Parcel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FIELD VERIFICATION SCREEN */}
        {/* ========================================================================= */}
        {activeFieldModeTab === 'verify' && activeParcel && (
          <div className="space-y-4">
            {/* Parcel Details Top Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {activeParcel.id}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold text-xs font-mono">
                      Khasra {activeParcel.khasraNo}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-xs">
                      AI Boundary: ✓ Generated
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Owner: <strong className="text-slate-800">{activeParcel.ownerName}</strong> &bull; Ward:{' '}
                    <strong className="text-slate-800">{activeParcel.ward}</strong> &bull; Property ID:{' '}
                    <strong className="font-mono text-slate-800">{activeParcel.propertyId}</strong>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold">
                    AI Confidence: {activeParcel.aiConfidence}%
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">
                    Topology: Valid
                  </div>
                </div>
              </div>

              {/* Potential Boundary Difference Indicator */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    Potential Boundary Difference — Requires Verification:
                  </strong>{' '}
                  AI detected orthomosaic polygon edge deviates by ~1.2m on the eastern boundary compared to registered cadastral map.
                  Check physical ground stone markers.
                </div>
              </div>
            </div>

            {/* Map and Field Operations Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Cached GIS Map Viewport (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-700" />
                      <span>Cached GIS Map Viewport</span>
                    </h3>
                    {isOffline && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded font-mono">
                        Cached Map (Offline)
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Parcels &bull; AI Contours &bull; Buildings &bull; Roads
                  </div>
                </div>

                {/* Cadastral Map Component */}
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <CadastralMap
                    height="h-[440px]"
                    showControls={true}
                    highlightParcelId={activeParcel.id}
                  />
                </div>

                {/* Boundary Comparison Legend */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700">Layers:</span>
                  <span className="flex items-center gap-1 text-blue-700 font-semibold">
                    <span className="w-3 h-1 bg-blue-600 rounded-sm" /> AI Boundary
                  </span>
                  <span className="flex items-center gap-1 text-purple-700 font-semibold">
                    <span className="w-3 h-1 bg-purple-600 rounded-sm" /> Existing Boundary
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> GNSS Observations
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2.5 h-1 bg-amber-500 rounded-sm" /> Roads
                  </span>
                </div>
              </div>

              {/* Right Column: GNSS, Photos, Remarks & Verification Controls (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. GNSS / CORS Telemetry Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase">
                      <Radio className="w-4 h-4 text-emerald-600" />
                      <span>GNSS / CORS Survey Data</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold font-mono rounded">
                      Demo Data
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px]">GNSS STATUS:</span>
                      <p className="text-emerald-400 font-bold">RTK FIXED ✓</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">ACCURACY:</span>
                      <p className="text-emerald-400 font-bold">±2.1 cm</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">LATITUDE:</span>
                      <p className="text-white font-bold">{activeParcel.centroid[0].toFixed(6)}°N</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">LONGITUDE:</span>
                      <p className="text-white font-bold">{activeParcel.centroid[1].toFixed(6)}°E</p>
                    </div>
                  </div>

                  {/* CORS Offline Warning / Info */}
                  {isOffline ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>CORS correction unavailable — coordinate saved for later synchronization.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>CORS Connected &bull; Real-time NMEA Differential Fix Active.</span>
                    </div>
                  )}
                </div>

                {/* 2. Ground Evidence / Photos Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span>Ground Evidence Photos</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {capturedPhotos.length} Photos Captured
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPhotoCaptureModal(true)}
                      className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Capture Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPhotoCaptureModal(true)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>

                  {/* Photo Thumbnails */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {capturedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-24 group"
                      >
                        <img
                          src={photo.url}
                          alt="Field Evidence"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end text-white text-[10px] font-mono">
                          <span className="font-bold">{photo.id}</span>
                          <span className="text-emerald-300 text-[9px]">{photo.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Field Remarks Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Field Remarks & Ground Notes
                  </label>
                  <textarea
                    rows={3}
                    value={fieldRemarks}
                    onChange={(e) => setFieldRemarks(e.target.value)}
                    placeholder="Enter physical observations, boundary offsets, or building remarks..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleSaveRemark}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      Save Remark
                    </button>
                  </div>
                </div>

                {/* 4. Primary Verification Actions (Verify / Edit / Reject) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
                  <div className="text-xs font-bold text-slate-900 uppercase">
                    Verification Decision
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* VERIFY */}
                    <button
                      type="button"
                      onClick={handleVerifyOffline}
                      className="py-3 px-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify</span>
                    </button>

                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBoundary(true);
                        handleSaveBoundaryEdit();
                      }}
                      className="py-3 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* REJECT */}
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="py-3 px-2 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFFLINE QUEUE & SYNC CONFLICT RESOLUTION */}
        {/* ========================================================================= */}
        {activeFieldModeTab === 'queue' && (
          <div className="space-y-4">
            {/* Queue Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-mono">
                    OFFLINE QUEUE
                  </span>
                  <span className="text-slate-400 text-xs">&bull;</span>
                  <span className="text-xs font-bold text-slate-700">
                    {pendingSyncCount} records waiting to sync
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Local Device Storage & Synchronization Ledger
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Records captured without connectivity are stored securely in local browser storage and will be synchronized when online.
                </p>
              </div>

              <button
                type="button"
                disabled={isOffline || pendingSyncCount === 0 || isSyncing}
                onClick={triggerSyncNow}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-700/20 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing...' : 'Upload & Sync Now'}</span>
              </button>
            </div>

            {/* Sync Conflict Demo Card (if conflict exists) */}
            {activeConflicts.filter((c) => !c.resolved).length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-200 text-amber-900 rounded-xl">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-amber-950 uppercase">
                        Sync Conflict Detected
                      </h3>
                      <p className="text-xs text-amber-800 font-medium">
                        Parcel <strong>PCL-004821</strong> was updated by Government Admin while you were offline.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded font-mono">
                    Requires Resolution
                  </span>
                </div>

                {/* Side by Side Difference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-amber-300 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">
                      Local Version (Surveyor Field Edit)
                    </span>
                    <p className="text-slate-800 font-medium">
                      Surveyor Rajesh Sharma adjusted vertex offset based on CORS RTK ground fix (±1.8 cm).
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Timestamp: 26 Sep 2026, 11:32 AM &bull; Status: Field Verified
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-300 space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-800 uppercase">
                      Server Version (Admin Update)
                    </span>
                    <p className="text-slate-800 font-medium">
                      Revenue Officer updated registry title record for legal compliance review.
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Timestamp: 26 Sep 2026, 11:15 AM &bull; Status: Admin Reviewed
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-200">
                  <button
                    type="button"
                    onClick={() => resolveConflict('CONF-001', 'KEEP_FIELD')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Keep Field Version
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveConflict('CONF-001', 'KEEP_SERVER')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
                  >
                    Keep Server Version
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveConflict('CONF-001', 'MANUAL')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Resolve Manually
                  </button>
                </div>
              </div>
            )}

            {/* Offline Queue Items List */}
            <div className="space-y-3">
              {offlineQueue.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-800">All Field Records Synchronized</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are no pending offline records waiting to upload. Your local device is fully in sync with the central cadastre database.
                  </p>
                </div>
              ) : (
                offlineQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {item.parcelId}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                            {item.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-purple-700 font-bold font-mono">
                            Pending Sync
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1">{item.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Captured at {item.timestamp} by {item.surveyorName}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteQueueItem(item.id)}
                      className="text-slate-400 hover:text-red-600 text-xs font-semibold self-end sm:self-center transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SYNC HISTORY */}
        {/* ========================================================================= */}
        {activeFieldModeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Synchronization History & Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record of completed synchronization sessions between this field device and state survey servers.
              </p>
            </div>

            <div className="space-y-3">
              {syncHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{item.timestamp}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        ✓ {item.status}
                      </span>
                    </div>
                    <p className="text-slate-700">{item.details}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Surveyor: {item.surveyorName} &bull; Session ID: {item.id}
                    </div>
                  </div>

                  <div className="text-right sm:text-right font-mono text-[11px] text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 self-start sm:self-auto">
                    <div>
                      Records: <strong>{item.recordsCount}</strong>
                    </div>
                    <div>
                      Photos: <strong>{item.photosCount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Rejection Modal */}
      {showRejectModal && activeParcel && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-red-700 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider">
                Reject / Request Revisit for {activeParcel.id}
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Rejection / Revisit *
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-medium"
                >
                  <option value="Boundary mismatch">Boundary mismatch with physical stones</option>
                  <option value="Building mismatch">Building footprint mismatch</option>
                  <option value="Road mismatch">Road / Pathway corridor mismatch</option>
                  <option value="Land-use mismatch">Land-use classification discrepancy</option>
                  <option value="Insufficient evidence">Insufficient physical boundary evidence</option>
                  <option value="Other">Other statutory observation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Surveyor Observations & Notes
                </label>
                <textarea
                  rows={3}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Detail why this parcel requires survey re-evaluation..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Rejection Offline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Photo Capture Modal */}
      {showPhotoCaptureModal && activeParcel && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Simulate Ground Photo Capture</span>
              </h3>
              <button
                onClick={() => setShowPhotoCaptureModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-900 h-44 flex items-center justify-center relative">
                <img
                  src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=600&q=80"
                  alt="Site Photo"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded">
                  GPS: 23.1818°N, 79.9862°E &bull; ±2.1 cm
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-mono rounded font-bold">
                  {activeParcel.id} Ground Marker
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                Photo will be stamped with GNSS timestamp & stored locally on device for offline field evidence.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPhotoCaptureModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePhotoCapture}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Store Photo Offline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Offline Package Modal */}
      <OfflinePackageModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};

export default FieldModePage;

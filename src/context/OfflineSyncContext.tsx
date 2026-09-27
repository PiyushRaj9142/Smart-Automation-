import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  NetworkStatus,
  OfflineCachePackage,
  OfflineSyncRecord,
  SyncHistoryItem,
  SyncConflict,
  SurveyorFieldStatus,
  OfflineSyncRecordType
} from '../types/offline';
import { CadastralParcel, RoadCorridor } from '../types/cadastre';
import { offlineStorageService } from '../services/offlineStorageService';
import { useCadastre } from './CadastreContext';

interface CacheDownloadProgress {
  step: string;
  percent: number;
  isReady: boolean;
}

interface OfflineSyncContextType {
  networkStatus: NetworkStatus;
  isRealOnline: boolean;
  isSimulatedOffline: boolean | null; // null = use real, true = force offline, false = force online
  toggleSimulateOffline: () => void;
  forceSetNetworkState: (state: 'ONLINE' | 'OFFLINE') => void;
  statusMessage: string;

  // Cache Management
  cachedPackage: OfflineCachePackage | null;
  isDownloadingCache: boolean;
  cacheDownloadProgress: CacheDownloadProgress | null;
  downloadOfflinePackage: (surveyorId: string, assignedParcels: CadastralParcel[], roads?: RoadCorridor[]) => Promise<void>;
  clearLocalCache: () => void;

  // Offline Queue
  offlineQueue: OfflineSyncRecord[];
  pendingSyncCount: number;
  syncedCount: number;
  lastSyncTime: string;
  isSyncing: boolean;

  // Queue Operations
  queueVerification: (parcelId: string, remarks: string, photoUrl?: string, coords?: [number, number][], gnss?: any) => void;
  queueFieldRemark: (parcelId: string, remark: string) => void;
  queueGroundPhoto: (parcelId: string, photoUrl: string, caption?: string) => void;
  queueBoundaryEdit: (parcelId: string, coords: [number, number][]) => void;
  queueRejection: (parcelId: string, reason: string, notes?: string) => void;
  deleteQueueItem: (itemId: string) => void;

  // Sync Actions
  triggerSyncNow: () => Promise<boolean>;
  syncHistory: SyncHistoryItem[];
  activeConflicts: SyncConflict[];
  resolveConflict: (conflictId: string, resolution: 'KEEP_FIELD' | 'KEEP_SERVER' | 'MANUAL', manualData?: any) => void;

  // Admin Monitoring
  surveyorsFieldStatus: SurveyorFieldStatus[];
  activeFieldModeTab: 'parcels' | 'verify' | 'queue' | 'history';
  setActiveFieldModeTab: (tab: 'parcels' | 'verify' | 'queue' | 'history') => void;
  selectedFieldParcelId: string | null;
  setSelectedFieldParcelId: (id: string | null) => void;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { parcels, updateParcelBoundary, verifyParcelBySurveyor, activeSurveyor, addAuditLog } = useCadastre();

  // 1. Real Network Detection
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // 2. Simulated Offline Toggle for Demos / Judges
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean | null>(null);

  // Effective Online state
  const effectiveIsOnline = isSimulatedOffline !== null ? !isSimulatedOffline : isRealOnline;

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() =>
    effectiveIsOnline ? 'ONLINE' : 'OFFLINE'
  );

  const [statusMessage, setStatusMessage] = useState<string>('Connected to Government Cadastre Network');
  const [lastSyncTime, setLastSyncTime] = useState<string>('26 Sep 2026, 10:42 AM');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncedCount, setSyncedCount] = useState<number>(87);

  // 3. Cached Offline Data Package
  const [cachedPackage, setCachedPackage] = useState<OfflineCachePackage | null>(() =>
    offlineStorageService.getCachePackage(activeSurveyor?.id || 'SURV-101')
  );
  const [isDownloadingCache, setIsDownloadingCache] = useState<boolean>(false);
  const [cacheDownloadProgress, setCacheDownloadProgress] = useState<CacheDownloadProgress | null>(null);

  // 4. Offline Queue
  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncRecord[]>(() =>
    offlineStorageService.getQueue(activeSurveyor?.id || 'SURV-101')
  );

  // 5. Sync History & Conflicts
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>(() =>
    offlineStorageService.getSyncHistory()
  );
  const [activeConflicts, setActiveConflicts] = useState<SyncConflict[]>(() =>
    offlineStorageService.getConflicts()
  );

  // 6. Navigation inside Field Mode
  const [activeFieldModeTab, setActiveFieldModeTab] = useState<'parcels' | 'verify' | 'queue' | 'history'>('parcels');
  const [selectedFieldParcelId, setSelectedFieldParcelId] = useState<string | null>('PCL-004821');

  // 7. Mock Surveyor Field Status for Government Admin Monitoring
  const [surveyorsFieldStatus, setSurveyorsFieldStatus] = useState<SurveyorFieldStatus[]>([
    {
      id: 'SURV-101',
      name: 'Rajesh Sharma',
      officialId: 'SURV-MP-091',
      zone: 'Zone A (Civil Lines)',
      status: 'Online',
      pendingSyncCount: 0,
      lastSync: 'Just now',
      assignedParcelsCount: 24,
      verifiedParcelsCount: 15,
      deviceBattery: 88,
      gnssAccuracy: '±1.8 cm (RTK FIXED)'
    },
    {
      id: 'SURV-102',
      name: 'Aman Kumar',
      officialId: 'SURV-MP-044',
      zone: 'Zone B (Wright Town)',
      status: 'Offline',
      pendingSyncCount: 7,
      lastSync: '18 minutes ago',
      assignedParcelsCount: 18,
      verifiedParcelsCount: 11,
      deviceBattery: 64,
      gnssAccuracy: '±2.4 cm (Local GNSS)'
    },
    {
      id: 'SURV-103',
      name: 'Neha Verma',
      officialId: 'SURV-MP-078',
      zone: 'Zone C (Napier Town)',
      status: 'Syncing',
      pendingSyncCount: 3,
      lastSync: 'Syncing in progress...',
      assignedParcelsCount: 20,
      verifiedParcelsCount: 14,
      deviceBattery: 92,
      gnssAccuracy: '±2.0 cm (RTK FIXED)'
    },
    {
      id: 'SURV-104',
      name: 'Priyanka Patel',
      officialId: 'SURV-MP-112',
      zone: 'Zone D (Gorakhpur)',
      status: 'Online',
      pendingSyncCount: 0,
      lastSync: '4 minutes ago',
      assignedParcelsCount: 15,
      verifiedParcelsCount: 12,
      deviceBattery: 75,
      gnssAccuracy: '±2.1 cm (RTK FIXED)'
    }
  ]);

  // Keep surveyor's local queue saved
  useEffect(() => {
    offlineStorageService.saveQueue(activeSurveyor?.id || 'SURV-101', offlineQueue);
  }, [offlineQueue, activeSurveyor]);

  // Update surveyor 1 (Rajesh Sharma) status dynamically based on current queue and online state
  useEffect(() => {
    setSurveyorsFieldStatus((prev) =>
      prev.map((s) => {
        if (s.id === (activeSurveyor?.id || 'SURV-101')) {
          return {
            ...s,
            status: isSyncing ? 'Syncing' : effectiveIsOnline ? 'Online' : 'Offline',
            pendingSyncCount: offlineQueue.length,
            lastSync: isSyncing ? 'Syncing in progress...' : effectiveIsOnline ? 'Just now' : lastSyncTime
          };
        }
        return s;
      })
    );
  }, [effectiveIsOnline, isSyncing, offlineQueue.length, lastSyncTime, activeSurveyor]);

  // Real browser online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
    };
    const handleOffline = () => {
      setIsRealOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync network status whenever effectiveIsOnline changes
  useEffect(() => {
    if (isSyncing) return;
    if (effectiveIsOnline) {
      setNetworkStatus('ONLINE');
      setStatusMessage('Connected • Online Field Operations');
    } else {
      setNetworkStatus('OFFLINE');
      setStatusMessage('Offline Mode • Field Data Saved Securely on Device');
    }
  }, [effectiveIsOnline, isSyncing]);

  // Trigger sync function definition ref to avoid stale closures
  const syncFunctionRef = useRef<() => Promise<boolean>>(async () => true);

  // Auto-Sync Listener: When connection is restored (or switched to online) and pending records exist
  const prevOnlineRef = useRef<boolean>(effectiveIsOnline);
  useEffect(() => {
    const wasOffline = !prevOnlineRef.current;
    const isNowOnline = effectiveIsOnline;
    prevOnlineRef.current = effectiveIsOnline;

    if (wasOffline && isNowOnline && offlineQueue.length > 0 && !isSyncing) {
      // Automatic trigger with a short realistic delay
      const autoSyncTimer = setTimeout(() => {
        syncFunctionRef.current();
      }, 1000);
      return () => clearTimeout(autoSyncTimer);
    }
  }, [effectiveIsOnline, offlineQueue.length, isSyncing]);

  // Toggle demo offline simulation
  const toggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => (prev === null ? true : !prev));
  };

  const forceSetNetworkState = (state: 'ONLINE' | 'OFFLINE') => {
    setIsSimulatedOffline(state === 'OFFLINE');
  };

  // Download and Cache Offline Field Package (Assigned Parcels, Vector GIS, Buildings, Roads)
  const downloadOfflinePackage = useCallback(
    async (surveyorId: string, assignedParcels: CadastralParcel[], roads: RoadCorridor[] = []) => {
      setIsDownloadingCache(true);
      setCacheDownloadProgress({ step: 'Initializing Field Package...', percent: 10, isReady: false });

      const steps = [
        { step: 'Caching Assigned Parcels Data...', percent: 25 },
        { step: 'Caching Vector GIS Map & Centroids...', percent: 50 },
        { step: 'Downloading AI Boundary Contours & Land-Use...', percent: 75 },
        { step: 'Packaging Building Footprints & Road Layers...', percent: 90 },
        { step: 'Finalizing Offline SQLite / IndexedDB Store...', percent: 100 }
      ];

      for (const s of steps) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        setCacheDownloadProgress({ step: s.step, percent: s.percent, isReady: s.percent === 100 });
      }

      const newPkg: OfflineCachePackage = {
        id: `PKG-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        projectId: 'PRJ-JBP-2026',
        projectName: 'Jabalpur Urban Cadastre Survey (Zone A)',
        surveyorId: surveyorId || activeSurveyor?.id || 'SURV-101',
        surveyorName: activeSurveyor?.name || 'Rajesh Sharma',
        parcelsCount: assignedParcels.length,
        parcels: assignedParcels,
        buildingsCount: assignedParcels.reduce((acc, p) => acc + (p.buildingFootprints?.length || 0), 0),
        roads: roads,
        aiBoundariesCount: assignedParcels.length,
        packageSizeBytes: 4280000,
        packageSizeFormatted: '4.28 MB',
        isReady: true,
        checksum: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
      };

      offlineStorageService.saveCachePackage(newPkg);
      setCachedPackage(newPkg);
      setIsDownloadingCache(false);
      setStatusMessage('Offline Package Ready • Work without Internet');
    },
    [activeSurveyor]
  );

  const clearLocalCache = () => {
    offlineStorageService.clearCache(activeSurveyor?.id || 'SURV-101');
    setCachedPackage(null);
    setOfflineQueue([]);
  };

  // Queue Operations
  const queueVerification = (
    parcelId: string,
    remarks: string,
    photoUrl?: string,
    coords?: [number, number][],
    gnss?: any
  ) => {
    const newRecord: OfflineSyncRecord = {
      id: `REC-VERIF-${Date.now().toString().slice(-5)}`,
      parcelId,
      type: 'PARCEL_VERIFICATION',
      title: `Field Verification for ${parcelId}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      data: {
        remarks,
        photoUrl:
          photoUrl ||
          'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
        coordinates: coords,
        gnssData: gnss || {
          latitude: 23.1818,
          longitude: 79.9862,
          elevationM: 392.4,
          accuracyCm: 2.1,
          gnssStatus: 'RTK FIXED',
          corsStatus: effectiveIsOnline ? 'Connected' : 'Offline Stored (Delayed Correction)'
        },
        verificationStatus: 'Field Verified'
      },
      status: 'PENDING',
      surveyorId: activeSurveyor?.id || 'SURV-101',
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };

    setOfflineQueue((prev) => [newRecord, ...prev]);

    // If online, auto trigger sync
    if (effectiveIsOnline) {
      setTimeout(() => syncFunctionRef.current(), 400);
    }
  };

  const queueFieldRemark = (parcelId: string, remark: string) => {
    const newRecord: OfflineSyncRecord = {
      id: `REC-REM-${Date.now().toString().slice(-5)}`,
      parcelId,
      type: 'FIELD_REMARK',
      title: `Field Remark for ${parcelId}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      data: { remarks: remark },
      status: 'PENDING',
      surveyorId: activeSurveyor?.id || 'SURV-101',
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };
    setOfflineQueue((prev) => [newRecord, ...prev]);
    if (effectiveIsOnline) {
      setTimeout(() => syncFunctionRef.current(), 400);
    }
  };

  const queueGroundPhoto = (parcelId: string, photoUrl: string, caption?: string) => {
    const newRecord: OfflineSyncRecord = {
      id: `REC-IMG-${Date.now().toString().slice(-5)}`,
      parcelId,
      type: 'GROUND_PHOTO',
      title: `Ground Photo Evidence for ${parcelId}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      data: { photoUrl, photoCaption: caption || 'Ground Boundary Pillar / Plinth' },
      status: 'PENDING',
      surveyorId: activeSurveyor?.id || 'SURV-101',
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };
    setOfflineQueue((prev) => [newRecord, ...prev]);
    if (effectiveIsOnline) {
      setTimeout(() => syncFunctionRef.current(), 400);
    }
  };

  const queueBoundaryEdit = (parcelId: string, coords: [number, number][]) => {
    const newRecord: OfflineSyncRecord = {
      id: `REC-EDIT-${Date.now().toString().slice(-5)}`,
      parcelId,
      type: 'BOUNDARY_EDIT',
      title: `Boundary Coordinate Edit for ${parcelId}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      data: { coordinates: coords },
      status: 'PENDING',
      surveyorId: activeSurveyor?.id || 'SURV-101',
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };
    setOfflineQueue((prev) => [newRecord, ...prev]);
    if (effectiveIsOnline) {
      setTimeout(() => syncFunctionRef.current(), 400);
    }
  };

  const queueRejection = (parcelId: string, reason: string, notes?: string) => {
    const newRecord: OfflineSyncRecord = {
      id: `REC-REJ-${Date.now().toString().slice(-5)}`,
      parcelId,
      type: 'REJECTION',
      title: `Rejection / Needs Revisit for ${parcelId}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      data: { rejectionReason: reason, rejectionNotes: notes },
      status: 'PENDING',
      surveyorId: activeSurveyor?.id || 'SURV-101',
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };
    setOfflineQueue((prev) => [newRecord, ...prev]);
    if (effectiveIsOnline) {
      setTimeout(() => syncFunctionRef.current(), 400);
    }
  };

  const deleteQueueItem = (itemId: string) => {
    setOfflineQueue((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Perform Synchronization to Server / Central Cadastre Engine
  const triggerSyncNow = useCallback(async (): Promise<boolean> => {
    if (offlineQueue.length === 0) return true;

    setIsSyncing(true);
    setNetworkStatus('SYNCING');
    setStatusMessage(`Uploading ${offlineQueue.length} field records to Cadastre Cloud...`);

    // Process each record sequentially with realistic progress
    const currentQueue = [...offlineQueue];
    let syncedInSession = 0;
    let photosInSession = 0;

    for (let i = 0; i < currentQueue.length; i++) {
      const item = currentQueue[i];
      await new Promise((res) => setTimeout(res, 280));

      // Apply changes to global context
      if (item.type === 'PARCEL_VERIFICATION') {
        verifyParcelBySurveyor(
          item.parcelId,
          item.data.remarks || 'Ground verified via Field Mode',
          item.data.photoUrl
        );
        syncedInSession++;
        if (item.data.photoUrl) photosInSession++;
      } else if (item.type === 'BOUNDARY_EDIT' && item.data.coordinates) {
        updateParcelBoundary(item.parcelId, item.data.coordinates);
        syncedInSession++;
      } else if (item.type === 'GROUND_PHOTO') {
        photosInSession++;
        syncedInSession++;
      } else {
        syncedInSession++;
      }

      addAuditLog(
        `Offline Sync: ${item.title}`,
        item.parcelId,
        'Verified',
        `Sync Record ${item.id} submitted by surveyor ${item.surveyorName}`
      );
    }

    // Clear the processed queue
    setOfflineQueue([]);
    setSyncedCount((prev) => prev + syncedInSession);

    const nowFormatted = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setLastSyncTime(nowFormatted);

    // Add entry to Sync History
    const newHistoryItem: SyncHistoryItem = {
      id: `SYNC-HIST-${Date.now().toString().slice(-4)}`,
      timestamp: nowFormatted,
      recordsCount: syncedInSession,
      photosCount: photosInSession,
      status: 'SUCCESS',
      details: `${syncedInSession} field records and ${photosInSession} ground photos synchronized successfully.`,
      surveyorName: activeSurveyor?.name || 'Rajesh Sharma'
    };

    setSyncHistory((prev) => {
      const updated = [newHistoryItem, ...prev];
      offlineStorageService.saveSyncHistory(updated);
      return updated;
    });

    setIsSyncing(false);
    setNetworkStatus('SYNC_COMPLETE');
    setStatusMessage(`✓ Sync Complete: ${syncedInSession} records synchronized.`);

    setTimeout(() => {
      if (effectiveIsOnline) {
        setNetworkStatus('ONLINE');
        setStatusMessage('Connected • Online Field Operations');
      }
    }, 2800);

    return true;
  }, [offlineQueue, verifyParcelBySurveyor, updateParcelBoundary, addAuditLog, activeSurveyor, effectiveIsOnline]);

  // Keep ref up to date
  useEffect(() => {
    syncFunctionRef.current = triggerSyncNow;
  }, [triggerSyncNow]);

  // Conflict Resolution
  const resolveConflict = (
    conflictId: string,
    resolution: 'KEEP_FIELD' | 'KEEP_SERVER' | 'MANUAL',
    manualData?: any
  ) => {
    setActiveConflicts((prev) =>
      prev.map((c) => {
        if (c.id === conflictId) {
          return { ...c, resolved: true, resolutionChoice: resolution };
        }
        return c;
      })
    );

    const targetConflict = activeConflicts.find((c) => c.id === conflictId);
    if (targetConflict) {
      if (resolution === 'KEEP_FIELD') {
        updateParcelBoundary(targetConflict.parcelId, targetConflict.fieldVersion.coordinates);
      }
      addAuditLog(
        `Sync Conflict Resolved (${resolution})`,
        targetConflict.parcelId,
        'Resolved',
        `Conflict ${conflictId} resolved with choice: ${resolution}`
      );
    }
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        networkStatus,
        isRealOnline,
        isSimulatedOffline,
        toggleSimulateOffline,
        forceSetNetworkState,
        statusMessage,

        cachedPackage,
        isDownloadingCache,
        cacheDownloadProgress,
        downloadOfflinePackage,
        clearLocalCache,

        offlineQueue,
        pendingSyncCount: offlineQueue.length,
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

        surveyorsFieldStatus,
        activeFieldModeTab,
        setActiveFieldModeTab,
        selectedFieldParcelId,
        setSelectedFieldParcelId
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = (): OfflineSyncContextType => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};

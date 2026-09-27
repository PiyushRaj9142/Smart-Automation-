import { OfflineCachePackage, OfflineSyncRecord, SyncHistoryItem, SyncConflict } from '../types/offline';
import { CadastralParcel, RoadCorridor } from '../types/cadastre';

const CACHE_PACKAGE_PREFIX = 'cadastre_offline_pkg_';
const QUEUE_PREFIX = 'cadastre_offline_queue_';
const HISTORY_PREFIX = 'cadastre_sync_history_';
const CONFLICTS_PREFIX = 'cadastre_sync_conflicts_';

export const offlineStorageService = {
  // Save offline package
  saveCachePackage: (pkg: OfflineCachePackage): void => {
    try {
      localStorage.setItem(`${CACHE_PACKAGE_PREFIX}${pkg.surveyorId}`, JSON.stringify(pkg));
    } catch (e) {
      console.warn('LocalStorage error while saving cache package:', e);
    }
  },

  // Get cached offline package
  getCachePackage: (surveyorId: string): OfflineCachePackage | null => {
    try {
      const data = localStorage.getItem(`${CACHE_PACKAGE_PREFIX}${surveyorId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('LocalStorage error while getting cache package:', e);
      return null;
    }
  },

  // Save offline queue
  saveQueue: (surveyorId: string, queue: OfflineSyncRecord[]): void => {
    try {
      localStorage.setItem(`${QUEUE_PREFIX}${surveyorId}`, JSON.stringify(queue));
    } catch (e) {
      console.warn('LocalStorage error while saving queue:', e);
    }
  },

  // Get offline queue
  getQueue: (surveyorId: string): OfflineSyncRecord[] => {
    try {
      const data = localStorage.getItem(`${QUEUE_PREFIX}${surveyorId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage error while getting queue:', e);
      return [];
    }
  },

  // Save sync history
  saveSyncHistory: (history: SyncHistoryItem[]): void => {
    try {
      localStorage.setItem(HISTORY_PREFIX, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error while saving sync history:', e);
    }
  },

  // Get sync history
  getSyncHistory: (): SyncHistoryItem[] => {
    try {
      const data = localStorage.getItem(HISTORY_PREFIX);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error while getting sync history:', e);
    }
    // Default initial mock history
    return [
      {
        id: 'SYNC-HIST-001',
        timestamp: '26 Sep 2026, 11:42 AM',
        recordsCount: 12,
        photosCount: 8,
        status: 'SUCCESS',
        details: '12 parcel verifications and 8 ground evidence photos synchronized to state cadastre server.',
        surveyorName: 'Rajesh Sharma'
      },
      {
        id: 'SYNC-HIST-002',
        timestamp: '26 Sep 2026, 09:15 AM',
        recordsCount: 7,
        photosCount: 4,
        status: 'SUCCESS',
        details: '7 boundary adjustments and RTK GNSS fixes successfully synchronized.',
        surveyorName: 'Rajesh Sharma'
      }
    ];
  },

  // Save conflicts
  saveConflicts: (conflicts: SyncConflict[]): void => {
    try {
      localStorage.setItem(CONFLICTS_PREFIX, JSON.stringify(conflicts));
    } catch (e) {
      console.warn('LocalStorage error while saving conflicts:', e);
    }
  },

  // Get conflicts
  getConflicts: (): SyncConflict[] => {
    try {
      const data = localStorage.getItem(CONFLICTS_PREFIX);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage error while getting conflicts:', e);
      return [];
    }
  },

  // Clear local surveyor cache
  clearCache: (surveyorId: string): void => {
    try {
      localStorage.removeItem(`${CACHE_PACKAGE_PREFIX}${surveyorId}`);
      localStorage.removeItem(`${QUEUE_PREFIX}${surveyorId}`);
    } catch (e) {
      console.warn('LocalStorage error while clearing cache:', e);
    }
  }
};

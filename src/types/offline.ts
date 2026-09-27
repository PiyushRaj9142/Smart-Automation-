import { CadastralParcel, RoadCorridor } from './cadastre';

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_COMPLETE' | 'SYNC_ERROR';

export type OfflineSyncRecordType =
  | 'PARCEL_VERIFICATION'
  | 'FIELD_REMARK'
  | 'GNSS_RECORD'
  | 'GROUND_PHOTO'
  | 'BOUNDARY_EDIT'
  | 'REJECTION';

export type SyncRecordStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'CONFLICT' | 'FAILED';

export interface OfflineSyncRecord {
  id: string; // REC-SYNC-001
  parcelId: string;
  type: OfflineSyncRecordType;
  title: string;
  timestamp: string;
  data: {
    remarks?: string;
    photoUrl?: string;
    photoCaption?: string;
    coordinates?: [number, number][];
    gnssData?: {
      latitude: number;
      longitude: number;
      elevationM: number;
      accuracyCm: number;
      gnssStatus: string;
      corsStatus: string;
      isOfflineCapture?: boolean;
    };
    rejectionReason?: string;
    rejectionNotes?: string;
    verificationStatus?: string;
  };
  status: SyncRecordStatus;
  surveyorId: string;
  surveyorName: string;
  errorMessage?: string;
  conflictDetails?: {
    fieldVersion: any;
    serverVersion: any;
    conflictReason: string;
  };
}

export interface OfflineCachePackage {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  surveyorId: string;
  surveyorName: string;
  parcelsCount: number;
  parcels: CadastralParcel[];
  buildingsCount: number;
  roads: RoadCorridor[];
  aiBoundariesCount: number;
  packageSizeBytes: number;
  packageSizeFormatted: string;
  isReady: boolean;
  checksum: string;
}

export interface SyncHistoryItem {
  id: string;
  timestamp: string;
  recordsCount: number;
  photosCount: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  details: string;
  surveyorName: string;
}

export interface SyncConflict {
  id: string;
  parcelId: string;
  parcelKhasra: string;
  ownerName: string;
  detectedAt: string;
  fieldVersion: {
    timestamp: string;
    surveyorName: string;
    remarks: string;
    status: string;
    coordinates: [number, number][];
    accuracyCm: number;
  };
  serverVersion: {
    timestamp: string;
    actor: string;
    remarks: string;
    status: string;
    coordinates: [number, number][];
    approvalStage: string;
  };
  differenceSummary: string;
  resolved: boolean;
  resolutionChoice?: 'KEEP_FIELD' | 'KEEP_SERVER' | 'MANUAL';
}

export interface SurveyorFieldStatus {
  id: string;
  name: string;
  officialId: string;
  zone: string;
  status: 'Online' | 'Offline' | 'Syncing';
  pendingSyncCount: number;
  lastSync: string;
  assignedParcelsCount: number;
  verifiedParcelsCount: number;
  deviceBattery: number;
  gnssAccuracy: string;
}

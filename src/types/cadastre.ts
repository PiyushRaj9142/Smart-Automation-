export type PortalRole = 'GOVERNMENT_ADMIN' | 'FIELD_SURVEYOR' | 'CITIZEN';

export type ProjectStatus =
  | 'Planning'
  | 'Data Uploaded'
  | 'AI Processing'
  | 'AI Completed'
  | 'Field Verification'
  | 'Topology Validation'
  | 'Approved'
  | 'Completed';

export interface CadastralProject {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  surveyAreaSqKm: number;
  surveyDate: string;
  authority: string;
  surveyorTeam: string;
  status: ProjectStatus;
  totalParcels: number;
  aiVerifiedParcels: number;
  fieldVerifiedParcels: number;
  topologyErrors: number;
  approvedParcels: number;
  pendingApprovals: number;
  progressPercent: number;
  crs: string;
  centerLat: number;
  centerLng: number;
  zoomLevel: number;
}

export type DatasetType =
  | 'Drone Orthomosaic (ORI)'
  | 'Digital Surface Model (DSM)'
  | 'Digital Terrain Model (DTM)'
  | 'Existing GIS Parcel Layer'
  | 'Ground Truth Dataset'
  | 'Raw Drone Imagery';

export type DatasetProcessingStatus = 'Uploaded' | 'Processing' | 'Ready' | 'AI Segmented' | 'Failed';

export interface DroneDataset {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  type: DatasetType;
  resolution: string;
  uploadDate: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  processingStatus: DatasetProcessingStatus;
  bandCount: number;
  crs: string;
  coverageAreaSqKm: number;
  sensorModel?: string;
  flightAltitudeM?: number;
}

export type LandUseCategory =
  | 'Residential'
  | 'Commercial'
  | 'Institutional'
  | 'Industrial'
  | 'Agricultural'
  | 'Public & Green'
  | 'Mixed';

export type BuildingStatus =
  | 'Permanent 2-Storey RCC'
  | 'Single Storey Pucca'
  | 'Semi-pucca'
  | 'Commercial Structure'
  | 'Vacant Land'
  | 'Under Construction';

export type GroundTruthStatus = 'Verified' | 'Pending' | 'Mismatch' | 'Unsurveyed';

export type TopologyStatus =
  | 'Valid'
  | 'Overlap'
  | 'Gap'
  | 'Self-Intersection'
  | 'Duplicate'
  | 'Boundary Mismatch';

export type ParcelApprovalStatus =
  | 'AI Generated'
  | 'Surveyor Verified'
  | 'Topology Validated'
  | 'Admin Reviewed'
  | 'Government Approved'
  | 'Rejected'
  | 'Correction Requested';

export interface GNSSData {
  latitude: number;
  longitude: number;
  elevationM: number;
  accuracyCm: number;
  gnssStatus: 'RTK FIXED' | 'RTK FLOAT' | 'DGPS' | 'AUTONOMOUS';
  corsStatus: string;
  satellites: number;
  hdop: number;
  baseStationId: string;
}

export interface ApprovalTimelineEntry {
  stage: 'AI Generated' | 'Surveyor Verified' | 'Topology Validated' | 'Admin Reviewed' | 'Government Approved';
  timestamp: string;
  actor: string;
  status: 'Completed' | 'Pending' | 'In Progress' | 'Flagged';
  notes?: string;
}

export interface CadastralParcel {
  id: string; // e.g. PCL-004821
  projectId: string;
  propertyId: string; // PROP-2026-9921
  khasraNo: string; // 142/1
  khataNo: string; // KHT-408
  ward: string; // Ward 14 - Civil Lines
  ownerName: string;
  ownerContact: string;
  areaSqM: number; // 184.6
  areaSqFt: number;
  perimeterM: number;
  centroid: [number, number]; // [lat, lng]
  coordinates: [number, number][]; // AI / verified polygon
  existingCoordinates?: [number, number][]; // Old legacy GIS boundary
  gtCoordinates?: [number, number][]; // Ground truth CORS surveyed points
  landUse: LandUseCategory;
  buildingStatus: BuildingStatus;
  buildingFootprints: [number, number][][]; // Building footprint polygons inside parcel
  aiConfidence: number; // 96.8
  gtStatus: GroundTruthStatus;
  topologyStatus: TopologyStatus;
  approvalStatus: ParcelApprovalStatus;
  assignedSurveyorId?: string;
  assignedSurveyorName?: string;
  gnssData: GNSSData;
  fieldRemarks?: string;
  fieldPhotoUrl?: string;
  verifiedDate?: string;
  approvedDate?: string;
  certificateNo?: string;
  qrCodeData?: string;
  discrepancyFlag?: boolean;
  discrepancyNote?: string;
  timeline: ApprovalTimelineEntry[];
}

export type TopologyErrorType =
  | 'Overlapping parcels'
  | 'Gaps / Slivers'
  | 'Self-intersections'
  | 'Duplicate geometries'
  | 'Invalid polygons'
  | 'Boundary mismatches';

export interface TopologyIssue {
  id: string; // TOP-2026-081
  parcelId: string;
  secondaryParcelId?: string;
  projectId: string;
  errorType: TopologyErrorType;
  severity: 'Critical' | 'Moderate' | 'Low';
  location: [number, number];
  areaM2?: number;
  description: string;
  status: 'Open' | 'In Review' | 'Resolved' | 'Rejected';
  assignedSurveyor?: string;
  detectedDate: string;
  resolvedDate?: string;
  resolutionMethod?: string;
}

export interface AIPipelineStage {
  id: string;
  name: string;
  stageNumber: number;
  description: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Issue';
  progressPercent: number;
  processingTimeSec: number;
  outputCount: number;
  outputMetricLabel: string;
  modelArchitecture: string;
  accuracyIoU: number;
  details: string;
}

export interface RoadCorridor {
  id: string;
  name: string;
  type: 'Primary Road' | 'Secondary Access' | 'Pathway' | 'Pedestrian Corridor';
  widthM: number;
  coordinates: [number, number][];
}

export interface SurveyorUser {
  id: string; // SURV-102
  name: string;
  officialId: string;
  email: string;
  assignedZone: string;
  assignedParcelsCount: number;
  verifiedCount: number;
  pendingCount: number;
  discrepancyCount: number;
  revisitCount: number;
  accuracyRating: number;
  activeDeviceId: string;
  lastSync: string;
  status: 'Online / In Field' | 'Offline' | 'Syncing';
}

export type GrievanceIssueType =
  | 'Encroachment'
  | 'Boundary Overlap'
  | 'Land Use Mismatch'
  | 'Name Correction'
  | 'Measurement Error'
  | 'Building Omission';

export interface CitizenGrievance {
  id: string; // TKT-2026-8812
  parcelId: string;
  propertyId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  issueType: GrievanceIssueType;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Field Surveyor Assigned' | 'Resolved' | 'Rejected';
  filedDate: string;
  supportingDocName?: string;
  surveyorAssigned?: string;
  resolutionRemarks?: string;
}

export interface CadastralAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  parcelId: string;
  projectId: string;
  status: 'Verified' | 'Approved' | 'Resolved' | 'Generated' | 'Correction Requested' | 'Flagged';
  hash: string;
  ipAddress: string;
  details: string;
}

export interface CadastralNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ai' | 'topology' | 'field' | 'approval' | 'citizen' | 'dataset';
  targetRole: 'ADMIN' | 'SURVEYOR' | 'CITIZEN' | 'ALL';
  unread: boolean;
  linkModule: string;
}

export interface CadastralKPIs {
  totalProjects: number;
  totalParcelsExtracted: number;
  aiVerifiedParcels: number;
  fieldVerifiedParcels: number;
  topologyErrors: number;
  pendingApprovals: number;
  governmentApprovedParcels: number;
  surveyAreaTotalSqKm: number;
}

import {
  CadastralProject,
  DroneDataset,
  CadastralParcel,
  TopologyIssue,
  AIPipelineStage,
  RoadCorridor,
  SurveyorUser,
  CitizenGrievance,
  CadastralAuditLog,
  CadastralNotification,
  CadastralKPIs
} from '../types/cadastre';

export const MOCK_PROJECTS: CadastralProject[] = [
  {
    id: 'PRJ-JBP-2026',
    name: 'Jabalpur Urban Parcel Survey',
    city: 'Jabalpur',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    surveyAreaSqKm: 42.5,
    surveyDate: '2026-08-15',
    authority: 'Directorate of Land Records & Settlement, MP / MoHUA',
    surveyorTeam: 'Team Garuda Alpha (14 surveyors)',
    status: 'Field Verification',
    totalParcels: 18420,
    aiVerifiedParcels: 15860,
    fieldVerifiedParcels: 12430,
    topologyErrors: 326,
    approvedParcels: 7736,
    pendingApprovals: 2184,
    progressPercent: 74,
    crs: 'EPSG:32644 (UTM 44N)',
    centerLat: 23.1815,
    centerLng: 79.9864,
    zoomLevel: 16
  },
  {
    id: 'PRJ-JPR-2026',
    name: 'Jaipur Municipal Zone Survey',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    surveyAreaSqKm: 58.2,
    surveyDate: '2026-07-20',
    authority: 'Jaipur Development Authority (JDA)',
    surveyorTeam: 'Team Thar Recon (18 surveyors)',
    status: 'Topology Validation',
    totalParcels: 24150,
    aiVerifiedParcels: 22100,
    fieldVerifiedParcels: 18900,
    topologyErrors: 412,
    approvedParcels: 14200,
    pendingApprovals: 3450,
    progressPercent: 82,
    crs: 'EPSG:32643 (UTM 43N)',
    centerLat: 26.9124,
    centerLng: 75.7873,
    zoomLevel: 15
  },
  {
    id: 'PRJ-IND-2026',
    name: 'Indore Smart Cadastral Mapping',
    city: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    surveyAreaSqKm: 36.8,
    surveyDate: '2026-09-02',
    authority: 'Indore Smart City Development Ltd (ISCDL)',
    surveyorTeam: 'Team Narmada (10 surveyors)',
    status: 'AI Processing',
    totalParcels: 14890,
    aiVerifiedParcels: 11200,
    fieldVerifiedParcels: 6400,
    topologyErrors: 198,
    approvedParcels: 4100,
    pendingApprovals: 1820,
    progressPercent: 55,
    crs: 'EPSG:32643 (UTM 43N)',
    centerLat: 22.7196,
    centerLng: 75.8577,
    zoomLevel: 15
  },
  {
    id: 'PRJ-BPL-2026',
    name: 'Bhopal Urban Land Survey',
    city: 'Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    surveyAreaSqKm: 31.0,
    surveyDate: '2026-09-10',
    authority: 'Bhopal Municipal Corporation & Revenue Dept',
    surveyorTeam: 'Team Bhojpal (8 surveyors)',
    status: 'Data Uploaded',
    totalParcels: 11340,
    aiVerifiedParcels: 4200,
    fieldVerifiedParcels: 1800,
    topologyErrors: 88,
    approvedParcels: 950,
    pendingApprovals: 720,
    progressPercent: 32,
    crs: 'EPSG:32643 (UTM 43N)',
    centerLat: 23.2599,
    centerLng: 77.4126,
    zoomLevel: 15
  }
];

export const MOCK_DATASETS: DroneDataset[] = [
  {
    id: 'DS-001',
    projectId: 'PRJ-JBP-2026',
    projectName: 'Jabalpur Urban Parcel Survey',
    name: 'ORI_Zone_A.tif',
    type: 'Drone Orthomosaic (ORI)',
    resolution: '2.5 cm/px GSD',
    uploadDate: '2026-08-16 09:30 AM',
    fileSizeBytes: 4509715660,
    fileSizeFormatted: '4.2 GB',
    processingStatus: 'AI Segmented',
    bandCount: 4,
    crs: 'EPSG:32644 (WGS 84 / UTM 44N)',
    coverageAreaSqKm: 12.4,
    sensorModel: 'Phase One iXM-100 (100MP RGB)',
    flightAltitudeM: 120
  },
  {
    id: 'DS-002',
    projectId: 'PRJ-JBP-2026',
    projectName: 'Jabalpur Urban Parcel Survey',
    name: 'DSM_Zone_A.tif',
    type: 'Digital Surface Model (DSM)',
    resolution: '5.0 cm/px GSD',
    uploadDate: '2026-08-16 11:15 AM',
    fileSizeBytes: 2254857830,
    fileSizeFormatted: '2.1 GB',
    processingStatus: 'Ready',
    bandCount: 1,
    crs: 'EPSG:32644 (WGS 84 / UTM 44N)',
    coverageAreaSqKm: 12.4,
    sensorModel: 'LiDAR / Photogrammetric Stereo Point Cloud',
    flightAltitudeM: 120
  },
  {
    id: 'DS-003',
    projectId: 'PRJ-JBP-2026',
    projectName: 'Jabalpur Urban Parcel Survey',
    name: 'DTM_Zone_A.tif',
    type: 'Digital Terrain Model (DTM)',
    resolution: '10.0 cm vertical',
    uploadDate: '2026-08-16 11:45 AM',
    fileSizeBytes: 1932735283,
    fileSizeFormatted: '1.8 GB',
    processingStatus: 'Ready',
    bandCount: 1,
    crs: 'EPSG:32644 (WGS 84 / UTM 44N)',
    coverageAreaSqKm: 12.4,
    sensorModel: 'Classified Ground LiDAR Points',
    flightAltitudeM: 120
  },
  {
    id: 'DS-004',
    projectId: 'PRJ-JBP-2026',
    projectName: 'Jabalpur Urban Parcel Survey',
    name: 'GT_Zone_A.geojson',
    type: 'Ground Truth Dataset',
    resolution: '±1.5 cm RTK-CORS',
    uploadDate: '2026-08-17 02:20 PM',
    fileSizeBytes: 15518924,
    fileSizeFormatted: '14.8 MB',
    processingStatus: 'Ready',
    bandCount: 0,
    crs: 'EPSG:4326 (WGS 84 GeoJSON)',
    coverageAreaSqKm: 12.4
  },
  {
    id: 'DS-005',
    projectId: 'PRJ-JBP-2026',
    projectName: 'Jabalpur Urban Parcel Survey',
    name: 'GIS_Cadastral_Master_2018.shp',
    type: 'Existing GIS Parcel Layer',
    resolution: 'Legacy Vector (1:2000)',
    uploadDate: '2026-08-17 03:05 PM',
    fileSizeBytes: 90596966,
    fileSizeFormatted: '86.4 MB',
    processingStatus: 'Ready',
    bandCount: 0,
    crs: 'EPSG:32644',
    coverageAreaSqKm: 42.5
  },
  {
    id: 'DS-006',
    projectId: 'PRJ-JPR-2026',
    projectName: 'Jaipur Municipal Zone Survey',
    name: 'ORI_Jaipur_Zone3_Composite.tif',
    type: 'Drone Orthomosaic (ORI)',
    resolution: '3.0 cm/px GSD',
    uploadDate: '2026-08-20 10:10 AM',
    fileSizeBytes: 5824987136,
    fileSizeFormatted: '5.4 GB',
    processingStatus: 'AI Segmented',
    bandCount: 4,
    crs: 'EPSG:32643',
    coverageAreaSqKm: 18.6
  }
];

export const MOCK_AI_PIPELINE_STAGES: AIPipelineStage[] = [
  {
    id: 'STG-01',
    name: 'Drone / ORI Ingestion & Tiling',
    stageNumber: 1,
    description: 'High-res orthomosaic pyramid generation, cloud-optimized GeoTIFF tiling, and radiometric calibration.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 14.2,
    outputCount: 1240,
    outputMetricLabel: 'Tiles Processed (512x512)',
    modelArchitecture: 'GDAL / COG Pyramiding Pipeline',
    accuracyIoU: 99.8,
    details: 'Calibrated with 4 GCP ground stations; Zero pixel distortion.'
  },
  {
    id: 'STG-02',
    name: 'Image Preprocessing & Edge Enhancement',
    stageNumber: 2,
    description: 'Bilateral filtering, CLAHE contrast equalization, shadow attenuation and spectral reflectance normalization.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 22.8,
    outputCount: 1240,
    outputMetricLabel: 'Enhanced Patches',
    modelArchitecture: 'Adaptive Multi-scale Retinex',
    accuracyIoU: 98.4,
    details: 'Normalized shadows from 11:30 AM sun angle; contrast ratio improved 34%.'
  },
  {
    id: 'STG-03',
    name: 'AI Semantic Segmentation',
    stageNumber: 3,
    description: 'Multi-class deep learning segmentation identifying boundary walls, hedges, building edges, and corridors.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 64.5,
    outputCount: 18420,
    outputMetricLabel: 'Candidate Pixels Masked',
    modelArchitecture: 'DeepLabV3+ with Swin-Large Backbone',
    accuracyIoU: 92.6,
    details: 'Trained on 45,000 annotated Indian urban cadastral drone tiles.'
  },
  {
    id: 'STG-04',
    name: 'Parcel Boundary Extraction',
    stageNumber: 4,
    description: 'Sub-pixel contour tracing, RDP vector simplification, and cadastral compound edge line fitting.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 41.3,
    outputCount: 18420,
    outputMetricLabel: 'Parcels Extracted',
    modelArchitecture: 'Active Contour Model + Graph-Cut Regularization',
    accuracyIoU: 94.8,
    details: 'Boundary lines snapped to visible compound walls and physical property markers.'
  },
  {
    id: 'STG-05',
    name: 'Building Footprint Detection',
    stageNumber: 5,
    description: 'Extraction of individual structures, roofs, height estimation from DSM shadow and stereo photogrammetry.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 38.6,
    outputCount: 14210,
    outputMetricLabel: 'Building Footprints Detected',
    modelArchitecture: 'Polygon-Net / Mask R-CNN Cadastral Edition',
    accuracyIoU: 95.2,
    details: '14,210 structures vectorized with height and plinth area estimation.'
  },
  {
    id: 'STG-06',
    name: 'Road & Pathway Corridor Detection',
    stageNumber: 6,
    description: 'Delineation of municipal right-of-ways, primary roads, secondary alleys, and pedestrian access corridors.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 19.4,
    outputCount: 184,
    outputMetricLabel: 'Kilometers of Corridors (184.2 km)',
    modelArchitecture: 'RoadNet Deep Topology Extractor',
    accuracyIoU: 93.1,
    details: 'Connected corridor graph with centerline & carriage-width estimation.'
  },
  {
    id: 'STG-07',
    name: 'Land-use Classification',
    stageNumber: 7,
    description: 'Spectral + morphological feature classifier assigning master plan categories (Residential, Commercial, etc.).',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 28.1,
    outputCount: 18420,
    outputMetricLabel: 'Parcels Classified (7 classes)',
    modelArchitecture: 'Multi-Modal ResNet-101 with Spatial Context',
    accuracyIoU: 96.4,
    details: 'Residential 62%, Commercial 18%, Institutional 9%, Public 11%.'
  },
  {
    id: 'STG-08',
    name: 'Polygon Generation & Regularization',
    stageNumber: 8,
    description: 'Orthogonal corner snapping, right-angle squaring, topology cleaning, and OGC Simple Features vector encoding.',
    status: 'Completed',
    progressPercent: 100,
    processingTimeSec: 33.7,
    outputCount: 18420,
    outputMetricLabel: 'Cleaned Polygon Geometry',
    modelArchitecture: 'Computational Geometry Regularization Engine',
    accuracyIoU: 97.5,
    details: 'All polygons formatted to standard GeoJSON / WKT geometries.'
  },
  {
    id: 'STG-09',
    name: 'Topology Validation & Rule Engine',
    stageNumber: 9,
    description: 'Verification of spatial integrity: non-overlapping parcel rule, zero slivers, ground truth reconciliation.',
    status: 'Issue',
    progressPercent: 98,
    processingTimeSec: 15.0,
    outputCount: 326,
    outputMetricLabel: 'Geometry Issues Detected',
    modelArchitecture: 'Spatial Topology Engine (DE-9IM / PostGIS Compliant)',
    accuracyIoU: 98.2,
    details: '18,094 Valid (98.2%); 326 geometry issues flagged for field verification.'
  }
];

// Base center coordinates for Jabalpur Zone A demo: [23.1815, 79.9864]
export const MOCK_PARCELS: CadastralParcel[] = [
  {
    id: 'PCL-004821',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9921',
    khasraNo: '142/1',
    khataNo: 'KHT-408',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Rameshwar Prasad Sharma',
    ownerContact: '+91 98261 44321',
    areaSqM: 184.6,
    areaSqFt: 1987.0,
    perimeterM: 56.4,
    centroid: [23.1818, 79.9862],
    coordinates: [
      [23.1822, 79.9858],
      [23.1822, 79.9866],
      [23.1814, 79.9866],
      [23.1814, 79.9858]
    ],
    existingCoordinates: [
      [23.1823, 79.9857],
      [23.1823, 79.9867],
      [23.1813, 79.9867],
      [23.1813, 79.9857]
    ],
    gtCoordinates: [
      [23.1822, 79.9858],
      [23.1822, 79.9866],
      [23.1814, 79.9866],
      [23.1814, 79.9858]
    ],
    landUse: 'Residential',
    buildingStatus: 'Permanent 2-Storey RCC',
    buildingFootprints: [
      [
        [23.1820, 79.9860],
        [23.1820, 79.9864],
        [23.1816, 79.9864],
        [23.1816, 79.9860]
      ]
    ],
    aiConfidence: 96.8,
    gtStatus: 'Verified',
    topologyStatus: 'Valid',
    approvalStatus: 'Admin Reviewed',
    assignedSurveyorId: 'SURV-102',
    assignedSurveyorName: 'Rajesh Sharma',
    gnssData: {
      latitude: 23.1818,
      longitude: 79.9862,
      elevationM: 392.4,
      accuracyCm: 2.1,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 26,
      hdop: 0.78,
      baseStationId: 'CORS-JBP-NORTH'
    },
    fieldRemarks: 'Boundary wall physically verified on site. Compound wall aligns within 2cm of AI extraction.',
    fieldPhotoUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&auto=format&fit=crop&q=60',
    verifiedDate: '2026-09-20 11:42 AM',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:10', actor: 'AI Segmentation Engine', status: 'Completed', notes: 'Confidence 96.8%' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-20 11:42', actor: 'Surveyor Rajesh Sharma', status: 'Completed', notes: 'RTK CORS Verified' },
      { stage: 'Topology Validated', timestamp: '2026-09-21 09:15', actor: 'DE-9IM Rule Engine', status: 'Completed', notes: 'Zero boundary conflicts' },
      { stage: 'Admin Reviewed', timestamp: '2026-09-24 16:30', actor: 'SDM Jabalpur / Admin', status: 'Completed', notes: 'Ready for final gazette sanction' },
      { stage: 'Government Approved', timestamp: 'Pending', actor: 'State Cadastral Authority', status: 'Pending' }
    ]
  },
  {
    id: 'PCL-000421',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9922',
    khasraNo: '142/2',
    khataNo: 'KHT-409',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Vandana Devi Gupta',
    ownerContact: '+91 94251 88712',
    areaSqM: 240.5,
    areaSqFt: 2588.7,
    perimeterM: 64.0,
    centroid: [23.1828, 79.9862],
    coordinates: [
      [23.1832, 79.9858],
      [23.1832, 79.9866],
      [23.1824, 79.9866],
      [23.1824, 79.9858]
    ],
    landUse: 'Residential',
    buildingStatus: 'Permanent 2-Storey RCC',
    buildingFootprints: [
      [
        [23.1830, 79.9860],
        [23.1830, 79.9865],
        [23.1825, 79.9865],
        [23.1825, 79.9860]
      ]
    ],
    aiConfidence: 97.4,
    gtStatus: 'Verified',
    topologyStatus: 'Valid',
    approvalStatus: 'Government Approved',
    assignedSurveyorId: 'SURV-102',
    assignedSurveyorName: 'Rajesh Sharma',
    gnssData: {
      latitude: 23.1828,
      longitude: 79.9862,
      elevationM: 392.8,
      accuracyCm: 1.8,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 28,
      hdop: 0.72,
      baseStationId: 'CORS-JBP-NORTH'
    },
    fieldRemarks: 'Clear boundary demarcated. Plinth dimensions 14.2m x 9.8m matches drone footprint.',
    fieldPhotoUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60',
    verifiedDate: '2026-09-18 10:30 AM',
    approvedDate: '2026-09-22 03:45 PM',
    certificateNo: 'CAD-MP-JBP-2026-00421',
    qrCodeData: 'GOV-CADASTRE-MP-PCL000421-HASH99824',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:12', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-18 10:30', actor: 'Surveyor Rajesh Sharma', status: 'Completed' },
      { stage: 'Topology Validated', timestamp: '2026-09-19 14:20', actor: 'DE-9IM Rule Engine', status: 'Completed' },
      { stage: 'Admin Reviewed', timestamp: '2026-09-21 11:00', actor: 'SDM Jabalpur', status: 'Completed' },
      { stage: 'Government Approved', timestamp: '2026-09-22 15:45', actor: 'Cadastral Settlement Officer', status: 'Completed' }
    ]
  },
  {
    id: 'PCL-000422',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9923',
    khasraNo: '143/1',
    khataNo: 'KHT-410',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Kailash Chand Jain',
    ownerContact: '+91 97531 22987',
    areaSqM: 312.0,
    areaSqFt: 3358.3,
    perimeterM: 72.8,
    centroid: [23.1818, 79.9872],
    coordinates: [
      [23.1822, 79.9868],
      [23.1822, 79.9878],
      [23.1814, 79.9878],
      [23.1814, 79.9868]
    ],
    landUse: 'Commercial',
    buildingStatus: 'Commercial Structure',
    buildingFootprints: [
      [
        [23.1821, 79.9869],
        [23.1821, 79.9876],
        [23.1815, 79.9876],
        [23.1815, 79.9869]
      ]
    ],
    aiConfidence: 89.5,
    gtStatus: 'Mismatch',
    topologyStatus: 'Overlap',
    approvalStatus: 'Correction Requested',
    assignedSurveyorId: 'SURV-105',
    assignedSurveyorName: 'Anjali Verma',
    gnssData: {
      latitude: 23.1818,
      longitude: 79.9872,
      elevationM: 393.1,
      accuracyCm: 3.4,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 24,
      hdop: 0.85,
      baseStationId: 'CORS-JBP-NORTH'
    },
    discrepancyFlag: true,
    discrepancyNote: 'AI extracted boundary overhangs 1.2m on East pathway due to commercial awning roof projection.',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:15', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-21 14:10', actor: 'Surveyor Anjali Verma', status: 'Flagged', notes: 'Roof overhang discrepancy' },
      { stage: 'Topology Validated', timestamp: '2026-09-22 10:30', actor: 'DE-9IM Rule Engine', status: 'Flagged', notes: 'Overlap with road buffer' },
      { stage: 'Admin Reviewed', timestamp: 'Pending', actor: 'Admin', status: 'Pending' },
      { stage: 'Government Approved', timestamp: 'Pending', actor: 'Authority', status: 'Pending' }
    ]
  },
  {
    id: 'PCL-000423',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9924',
    khasraNo: '143/2',
    khataNo: 'KHT-411',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Sanjay Kumar Mishra',
    ownerContact: '+91 98930 11442',
    areaSqM: 156.2,
    areaSqFt: 1681.3,
    perimeterM: 50.0,
    centroid: [23.1828, 79.9872],
    coordinates: [
      [23.1832, 79.9868],
      [23.1832, 79.9878],
      [23.1824, 79.9878],
      [23.1824, 79.9868]
    ],
    landUse: 'Residential',
    buildingStatus: 'Single Storey Pucca',
    buildingFootprints: [
      [
        [23.1830, 79.9870],
        [23.1830, 79.9875],
        [23.1826, 79.9875],
        [23.1826, 79.9870]
      ]
    ],
    aiConfidence: 95.1,
    gtStatus: 'Pending',
    topologyStatus: 'Valid',
    approvalStatus: 'Surveyor Verified',
    assignedSurveyorId: 'SURV-102',
    assignedSurveyorName: 'Rajesh Sharma',
    gnssData: {
      latitude: 23.1828,
      longitude: 79.9872,
      elevationM: 392.6,
      accuracyCm: 2.3,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 25,
      hdop: 0.81,
      baseStationId: 'CORS-JBP-NORTH'
    },
    fieldRemarks: 'Surveyor verified on tablet. Awaiting topology snap check.',
    verifiedDate: '2026-09-25 09:15 AM',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:18', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-25 09:15', actor: 'Surveyor Rajesh Sharma', status: 'Completed' },
      { stage: 'Topology Validated', timestamp: 'Pending', actor: 'DE-9IM Rule Engine', status: 'In Progress' },
      { stage: 'Admin Reviewed', timestamp: 'Pending', actor: 'Admin', status: 'Pending' },
      { stage: 'Government Approved', timestamp: 'Pending', actor: 'Authority', status: 'Pending' }
    ]
  },
  {
    id: 'PCL-004824',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9925',
    khasraNo: '144/1',
    khataNo: 'KHT-412',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Dr. Alok Verma & Smt. Neha Verma',
    ownerContact: '+91 94258 77610',
    areaSqM: 420.0,
    areaSqFt: 4520.8,
    perimeterM: 84.0,
    centroid: [23.1808, 79.9862],
    coordinates: [
      [23.1812, 79.9858],
      [23.1812, 79.9866],
      [23.1804, 79.9866],
      [23.1804, 79.9858]
    ],
    landUse: 'Institutional',
    buildingStatus: 'Permanent 2-Storey RCC',
    buildingFootprints: [
      [
        [23.1810, 79.9860],
        [23.1810, 79.9865],
        [23.1805, 79.9865],
        [23.1805, 79.9860]
      ]
    ],
    aiConfidence: 98.2,
    gtStatus: 'Verified',
    topologyStatus: 'Valid',
    approvalStatus: 'Government Approved',
    assignedSurveyorId: 'SURV-102',
    assignedSurveyorName: 'Rajesh Sharma',
    gnssData: {
      latitude: 23.1808,
      longitude: 79.9862,
      elevationM: 391.9,
      accuracyCm: 1.5,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 29,
      hdop: 0.68,
      baseStationId: 'CORS-JBP-NORTH'
    },
    certificateNo: 'CAD-MP-JBP-2026-04824',
    qrCodeData: 'GOV-CADASTRE-MP-PCL004824-SEALED',
    approvedDate: '2026-09-24 04:10 PM',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:20', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-19 15:40', actor: 'Surveyor Rajesh Sharma', status: 'Completed' },
      { stage: 'Topology Validated', timestamp: '2026-09-20 11:20', actor: 'DE-9IM Rule Engine', status: 'Completed' },
      { stage: 'Admin Reviewed', timestamp: '2026-09-23 16:00', actor: 'SDM Jabalpur', status: 'Completed' },
      { stage: 'Government Approved', timestamp: '2026-09-24 16:10', actor: 'Settlement Officer', status: 'Completed' }
    ]
  },
  {
    id: 'PCL-004825',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9926',
    khasraNo: '144/2',
    khataNo: 'KHT-413',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Municipal Parks & Open Spaces Board',
    ownerContact: '+91 761 2400100',
    areaSqM: 580.4,
    areaSqFt: 6247.3,
    perimeterM: 98.2,
    centroid: [23.1808, 79.9872],
    coordinates: [
      [23.1812, 79.9868],
      [23.1812, 79.9878],
      [23.1804, 79.9878],
      [23.1804, 79.9868]
    ],
    landUse: 'Public & Green',
    buildingStatus: 'Vacant Land',
    buildingFootprints: [],
    aiConfidence: 99.1,
    gtStatus: 'Verified',
    topologyStatus: 'Valid',
    approvalStatus: 'Government Approved',
    gnssData: {
      latitude: 23.1808,
      longitude: 79.9872,
      elevationM: 391.7,
      accuracyCm: 2.0,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 27,
      hdop: 0.74,
      baseStationId: 'CORS-JBP-NORTH'
    },
    certificateNo: 'CAD-MP-JBP-2026-04825-PUB',
    approvedDate: '2026-09-23 02:20 PM',
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:22', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-18 16:10', actor: 'Surveyor Anjali Verma', status: 'Completed' },
      { stage: 'Topology Validated', timestamp: '2026-09-19 12:40', actor: 'DE-9IM Rule Engine', status: 'Completed' },
      { stage: 'Admin Reviewed', timestamp: '2026-09-22 14:30', actor: 'SDM Jabalpur', status: 'Completed' },
      { stage: 'Government Approved', timestamp: '2026-09-23 14:20', actor: 'Settlement Officer', status: 'Completed' }
    ]
  },
  {
    id: 'PCL-004826',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9927',
    khasraNo: '145/1',
    khataNo: 'KHT-414',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Om Prakash Tiwari & Sons',
    ownerContact: '+91 98270 55123',
    areaSqM: 210.0,
    areaSqFt: 2260.4,
    perimeterM: 60.0,
    centroid: [23.1838, 79.9862],
    coordinates: [
      [23.1842, 79.9858],
      [23.1842, 79.9866],
      [23.1834, 79.9866],
      [23.1834, 79.9858]
    ],
    landUse: 'Residential',
    buildingStatus: 'Semi-pucca',
    buildingFootprints: [
      [
        [23.1840, 79.9860],
        [23.1840, 79.9864],
        [23.1836, 79.9864],
        [23.1836, 79.9860]
      ]
    ],
    aiConfidence: 91.2,
    gtStatus: 'Pending',
    topologyStatus: 'Gap',
    approvalStatus: 'AI Generated',
    assignedSurveyorId: 'SURV-102',
    assignedSurveyorName: 'Rajesh Sharma',
    gnssData: {
      latitude: 23.1838,
      longitude: 79.9862,
      elevationM: 393.4,
      accuracyCm: 2.8,
      gnssStatus: 'RTK FLOAT',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 22,
      hdop: 0.94,
      baseStationId: 'CORS-JBP-NORTH'
    },
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:25', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: 'Pending', actor: 'Field Surveyor', status: 'Pending' },
      { stage: 'Topology Validated', timestamp: 'Pending', actor: 'DE-9IM Rule Engine', status: 'Flagged', notes: '0.4m gap with northern road' },
      { stage: 'Admin Reviewed', timestamp: 'Pending', actor: 'Admin', status: 'Pending' },
      { stage: 'Government Approved', timestamp: 'Pending', actor: 'Authority', status: 'Pending' }
    ]
  },
  {
    id: 'PCL-004827',
    projectId: 'PRJ-JBP-2026',
    propertyId: 'PROP-2026-9928',
    khasraNo: '145/2',
    khataNo: 'KHT-415',
    ward: 'Ward 14 - Civil Lines East',
    ownerName: 'Shri Balaji Auto Enterprises',
    ownerContact: '+91 93001 88450',
    areaSqM: 380.5,
    areaSqFt: 4095.6,
    perimeterM: 80.2,
    centroid: [23.1838, 79.9872],
    coordinates: [
      [23.1842, 79.9868],
      [23.1842, 79.9878],
      [23.1834, 79.9878],
      [23.1834, 79.9868]
    ],
    landUse: 'Commercial',
    buildingStatus: 'Commercial Structure',
    buildingFootprints: [
      [
        [23.1841, 79.9870],
        [23.1841, 79.9877],
        [23.1835, 79.9877],
        [23.1835, 79.9870]
      ]
    ],
    aiConfidence: 94.7,
    gtStatus: 'Verified',
    topologyStatus: 'Valid',
    approvalStatus: 'Topology Validated',
    assignedSurveyorId: 'SURV-108',
    assignedSurveyorName: 'Vikram Choudhary',
    gnssData: {
      latitude: 23.1838,
      longitude: 79.9872,
      elevationM: 393.6,
      accuracyCm: 1.9,
      gnssStatus: 'RTK FIXED',
      corsStatus: 'Connected (Station IND-MP-04)',
      satellites: 26,
      hdop: 0.79,
      baseStationId: 'CORS-JBP-NORTH'
    },
    timeline: [
      { stage: 'AI Generated', timestamp: '2026-08-18 14:28', actor: 'AI Segmentation Engine', status: 'Completed' },
      { stage: 'Surveyor Verified', timestamp: '2026-09-22 11:15', actor: 'Surveyor Vikram Choudhary', status: 'Completed' },
      { stage: 'Topology Validated', timestamp: '2026-09-23 09:40', actor: 'DE-9IM Rule Engine', status: 'Completed' },
      { stage: 'Admin Reviewed', timestamp: 'Pending', actor: 'Admin', status: 'In Progress' },
      { stage: 'Government Approved', timestamp: 'Pending', actor: 'Authority', status: 'Pending' }
    ]
  }
];

export const MOCK_TOPOLOGY_ISSUES: TopologyIssue[] = [
  {
    id: 'TOP-2026-081',
    parcelId: 'PCL-000422',
    secondaryParcelId: 'PCL-000423',
    projectId: 'PRJ-JBP-2026',
    errorType: 'Overlapping parcels',
    severity: 'Critical',
    location: [23.1822, 79.9868],
    areaM2: 8.4,
    description: 'Calculated polygon geometry overlaps with adjoining parcel boundary by 8.4 m² along the western boundary fence.',
    status: 'Open',
    assignedSurveyor: 'Anjali Verma (SURV-105)',
    detectedDate: '2026-09-22 10:30 AM'
  },
  {
    id: 'TOP-2026-082',
    parcelId: 'PCL-004826',
    projectId: 'PRJ-JBP-2026',
    errorType: 'Gaps / Slivers',
    severity: 'Moderate',
    location: [23.1842, 79.9862],
    areaM2: 2.1,
    description: '0.4m unmapped sliver gap between northern parcel compound wall and municipal road corridor right-of-way.',
    status: 'In Review',
    assignedSurveyor: 'Rajesh Sharma (SURV-102)',
    detectedDate: '2026-09-23 08:45 AM'
  },
  {
    id: 'TOP-2026-083',
    parcelId: 'PCL-004827',
    projectId: 'PRJ-JBP-2026',
    errorType: 'Self-intersections',
    severity: 'Low',
    location: [23.1834, 79.9878],
    areaM2: 0.8,
    description: 'Vertex loop self-intersection detected at southeastern corner during polygon regularization step.',
    status: 'Resolved',
    assignedSurveyor: 'Vikram Choudhary (SURV-108)',
    detectedDate: '2026-09-21 16:15 PM',
    resolvedDate: '2026-09-23 09:40 AM',
    resolutionMethod: 'Auto-Snapping Algorithm (snapped to 0.05m tolerance)'
  },
  {
    id: 'TOP-2026-084',
    parcelId: 'PCL-004821',
    secondaryParcelId: 'LEGACY-PCL-142',
    projectId: 'PRJ-JBP-2026',
    errorType: 'Duplicate geometries',
    severity: 'Moderate',
    location: [23.1818, 79.9862],
    areaM2: 184.6,
    description: 'Duplicate legacy GIS polygon ID 142 conflicting with newly segmented drone boundary PCL-004821.',
    status: 'Resolved',
    assignedSurveyor: 'Rajesh Sharma (SURV-102)',
    detectedDate: '2026-09-20 09:10 AM',
    resolvedDate: '2026-09-21 09:15 AM',
    resolutionMethod: 'Legacy geometry superseded with RTK Drone boundary'
  },
  {
    id: 'TOP-2026-085',
    parcelId: 'PCL-000422',
    projectId: 'PRJ-JBP-2026',
    errorType: 'Boundary mismatches',
    severity: 'Critical',
    location: [23.1818, 79.9872],
    areaM2: 12.6,
    description: '1.2m offset between AI drone building boundary projection and Ground Truth CORS surveyed boundary points.',
    status: 'Open',
    assignedSurveyor: 'Anjali Verma (SURV-105)',
    detectedDate: '2026-09-22 11:20 AM'
  }
];

export const MOCK_ROAD_CORRIDORS: RoadCorridor[] = [
  {
    id: 'RD-01',
    name: 'Civil Lines Main Boulevard',
    type: 'Primary Road',
    widthM: 18.0,
    coordinates: [
      [23.1850, 79.9856],
      [23.1800, 79.9856]
    ]
  },
  {
    id: 'RD-02',
    name: 'Sector 4 Internal Access Road',
    type: 'Secondary Access',
    widthM: 10.0,
    coordinates: [
      [23.1823, 79.9850],
      [23.1823, 79.9885]
    ]
  },
  {
    id: 'RD-03',
    name: 'Green Park North Connector',
    type: 'Secondary Access',
    widthM: 10.0,
    coordinates: [
      [23.1833, 79.9850],
      [23.1833, 79.9885]
    ]
  },
  {
    id: 'RD-04',
    name: 'Public Walkway & Utility Corridor',
    type: 'Pedestrian Corridor',
    widthM: 4.5,
    coordinates: [
      [23.1850, 79.9867],
      [23.1800, 79.9867]
    ]
  }
];

export const MOCK_SURVEYORS: SurveyorUser[] = [
  {
    id: 'SURV-102',
    name: 'Rajesh Sharma',
    officialId: 'GOV-SURV-102',
    email: 'rajesh.sharma@cadastre.gov',
    assignedZone: 'Jabalpur Zone A (Civil Lines East)',
    assignedParcelsCount: 42,
    verifiedCount: 22,
    pendingCount: 18,
    discrepancyCount: 1,
    revisitCount: 1,
    accuracyRating: 98.6,
    activeDeviceId: 'TRIMBLE-TDC600-RTK #8812',
    lastSync: '4 minutes ago',
    status: 'Online / In Field'
  },
  {
    id: 'SURV-105',
    name: 'Anjali Verma',
    officialId: 'GOV-SURV-105',
    email: 'anjali.verma@cadastre.gov',
    assignedZone: 'Jabalpur Zone A (Civil Lines West)',
    assignedParcelsCount: 38,
    verifiedCount: 20,
    pendingCount: 14,
    discrepancyCount: 3,
    revisitCount: 1,
    accuracyRating: 97.2,
    activeDeviceId: 'LEICA-ZENOMOBILE-RTK #4190',
    lastSync: '12 minutes ago',
    status: 'Online / In Field'
  },
  {
    id: 'SURV-108',
    name: 'Vikram Choudhary',
    officialId: 'GOV-SURV-108',
    email: 'vikram.c@cadastre.gov',
    assignedZone: 'Jabalpur Zone B (Cantt Sector)',
    assignedParcelsCount: 45,
    verifiedCount: 30,
    pendingCount: 12,
    discrepancyCount: 2,
    revisitCount: 1,
    accuracyRating: 99.1,
    activeDeviceId: 'SOUTH-GALAXY-G1-RTK #1104',
    lastSync: '28 minutes ago',
    status: 'Online / In Field'
  },
  {
    id: 'SURV-112',
    name: 'Priya Sengupta',
    officialId: 'GOV-SURV-112',
    email: 'priya.s@cadastre.gov',
    assignedZone: 'Jabalpur Zone C (Smart City Tech Park)',
    assignedParcelsCount: 30,
    verifiedCount: 24,
    pendingCount: 6,
    discrepancyCount: 0,
    revisitCount: 0,
    accuracyRating: 99.4,
    activeDeviceId: 'STONEX-S900A-RTK #9021',
    lastSync: '1 hour ago',
    status: 'Syncing'
  }
];

export const MOCK_GRIEVANCES: CitizenGrievance[] = [
  {
    id: 'TKT-2026-8812',
    parcelId: 'PCL-004821',
    propertyId: 'PROP-2026-9921',
    applicantName: 'Rameshwar Prasad Sharma',
    applicantPhone: '+91 98261 44321',
    applicantEmail: 'rameshwar.sharma@example.com',
    issueType: 'Boundary Overlap',
    description: 'Adjoining property owner Kailash Chand has constructed a temporary shed extending 0.5m over my eastern boundary wall.',
    status: 'Field Surveyor Assigned',
    filedDate: '2026-09-21 14:15 PM',
    supportingDocName: 'Sale_Deed_Registry_1998.pdf',
    surveyorAssigned: 'Rajesh Sharma (SURV-102)',
    resolutionRemarks: 'Field inspection scheduled for 27 Sep 2026 with RTK-CORS survey.'
  },
  {
    id: 'TKT-2026-8815',
    parcelId: 'PCL-000421',
    propertyId: 'PROP-2026-9922',
    applicantName: 'Vandana Devi Gupta',
    applicantPhone: '+91 94251 88712',
    applicantEmail: 'vandana.gupta@example.com',
    issueType: 'Name Correction',
    description: 'Owner name spelled as "Vandana Devi" in draft notice instead of "Vandana Devi Gupta" as per Aadhaar and Registry.',
    status: 'Resolved',
    filedDate: '2026-09-19 11:30 AM',
    supportingDocName: 'Aadhaar_and_Registry_Copy.pdf',
    resolutionRemarks: 'Name updated in official cadastral master record. Certified copy generated.'
  },
  {
    id: 'TKT-2026-8819',
    parcelId: 'PCL-000422',
    propertyId: 'PROP-2026-9923',
    applicantName: 'Kailash Chand Jain',
    applicantPhone: '+91 97531 22987',
    applicantEmail: 'kailash.jain@example.com',
    issueType: 'Land Use Mismatch',
    description: 'Ground floor property is mixed commercial retail shop, please record under Mixed Commercial/Residential code.',
    status: 'Under Review',
    filedDate: '2026-09-23 16:40 PM',
    supportingDocName: 'Trade_License_2025_26.pdf',
    surveyorAssigned: 'Anjali Verma (SURV-105)'
  }
];

export const MOCK_AUDIT_LOGS: CadastralAuditLog[] = [
  {
    id: 'AUD-88912',
    timestamp: '26 Sep 2026, 12:18 PM',
    user: 'Admin-01 (SDM Jabalpur)',
    role: 'Government Authority',
    action: 'Parcel Approval & Gazette Sanction',
    parcelId: 'PCL-000421',
    projectId: 'PRJ-JBP-2026',
    status: 'Approved',
    hash: '0x8f7a912e5c8932b1',
    ipAddress: '10.142.6.45 (Gov-NICNET)',
    details: 'Digital Cadastral Certificate CAD-MP-JBP-2026-00421 signed and sealed.'
  },
  {
    id: 'AUD-88911',
    timestamp: '26 Sep 2026, 11:42 AM',
    user: 'Surveyor-102 (Rajesh Sharma)',
    role: 'Field Surveyor',
    action: 'Field Verification & RTK Sync',
    parcelId: 'PCL-004821',
    projectId: 'PRJ-JBP-2026',
    status: 'Verified',
    hash: '0x3c99a01f78ea2290',
    ipAddress: '192.168.43.110 (Trimble RTK CORS)',
    details: 'Verified boundary with 4 RTK-GNSS control points (accuracy ±2.1cm).'
  },
  {
    id: 'AUD-88910',
    timestamp: '25 Sep 2026, 04:30 PM',
    user: 'AI Pipeline Engine v4.2',
    role: 'Automated AI Engine',
    action: 'AI Feature Extraction Completed',
    parcelId: 'Zone A (18,420 parcels)',
    projectId: 'PRJ-JBP-2026',
    status: 'Generated',
    hash: '0x77b018ec993d44f1',
    ipAddress: '10.142.6.80 (AI Cluster Node 4)',
    details: 'Extracted 18,420 parcels, 14,210 building footprints with DeepLabV3+.'
  },
  {
    id: 'AUD-88909',
    timestamp: '25 Sep 2026, 02:15 PM',
    user: 'GIS Officer (N. K. Sen)',
    role: 'Government Authority',
    action: 'Topology Sanitization & Auto-Snap',
    parcelId: 'PCL-004827',
    projectId: 'PRJ-JBP-2026',
    status: 'Resolved',
    hash: '0x55aa431980ee9124',
    ipAddress: '10.142.6.48 (Gov-NICNET)',
    details: 'Self-intersection resolved by geometric snap at 0.05m tolerance.'
  },
  {
    id: 'AUD-88908',
    timestamp: '24 Sep 2026, 06:10 PM',
    user: 'Surveyor-105 (Anjali Verma)',
    role: 'Field Surveyor',
    action: 'Boundary Discrepancy Flagged',
    parcelId: 'PCL-000422',
    projectId: 'PRJ-JBP-2026',
    status: 'Flagged',
    hash: '0x12bb994d50aa8390',
    ipAddress: '192.168.43.115 (Leica RTK)',
    details: 'Flagged 1.2m commercial awning overhang on eastern roadway corridor.'
  }
];

export const MOCK_NOTIFICATIONS: CadastralNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'AI Processing Completed',
    message: 'Drone Orthomosaic ORI_Zone_A.tif AI segmentation complete. 18,420 parcel polygons extracted.',
    time: '10 minutes ago',
    type: 'ai',
    targetRole: 'ADMIN',
    unread: true,
    linkModule: 'ai-processing'
  },
  {
    id: 'NOTIF-02',
    title: 'Topology Errors Detected',
    message: 'Rule engine flagged 326 geometry issues (142 overlaps, 98 gaps). Action required.',
    time: '25 minutes ago',
    type: 'topology',
    targetRole: 'ADMIN',
    unread: true,
    linkModule: 'topology'
  },
  {
    id: 'NOTIF-03',
    title: 'Field Verification Completed',
    message: 'Surveyor Rajesh Sharma submitted RTK-CORS verified coordinates for PCL-004821.',
    time: '45 minutes ago',
    type: 'field',
    targetRole: 'ADMIN',
    unread: true,
    linkModule: 'approvals'
  },
  {
    id: 'NOTIF-04',
    title: 'New Parcel Assigned',
    message: 'Parcel PCL-004826 (Ward 14) assigned to you for RTK field boundary verification.',
    time: '1 hour ago',
    type: 'field',
    targetRole: 'SURVEYOR',
    unread: true,
    linkModule: 'field-surveyor'
  },
  {
    id: 'NOTIF-05',
    title: 'Citizen Discrepancy Submitted',
    message: 'New grievance TKT-2026-8812 filed for PCL-004821 regarding eastern compound wall overlap.',
    time: '2 hours ago',
    type: 'citizen',
    targetRole: 'ADMIN',
    unread: false,
    linkModule: 'approvals'
  }
];

export const MOCK_KPIS: CadastralKPIs = {
  totalProjects: 12,
  totalParcelsExtracted: 18420,
  aiVerifiedParcels: 15860,
  fieldVerifiedParcels: 12430,
  topologyErrors: 326,
  pendingApprovals: 2184,
  governmentApprovedParcels: 7736,
  surveyAreaTotalSqKm: 168.5
};

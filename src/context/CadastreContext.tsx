import React, { createContext, useContext, useState } from 'react';
import {
  PortalRole,
  CadastralProject,
  DroneDataset,
  CadastralParcel,
  TopologyIssue,
  AIPipelineStage,
  SurveyorUser,
  CitizenGrievance,
  CadastralAuditLog,
  CadastralNotification,
  CadastralKPIs,
  RoadCorridor
} from '../types/cadastre';
import {
  MOCK_PROJECTS,
  MOCK_DATASETS,
  MOCK_AI_PIPELINE_STAGES,
  MOCK_PARCELS,
  MOCK_TOPOLOGY_ISSUES,
  MOCK_ROAD_CORRIDORS,
  MOCK_SURVEYORS,
  MOCK_GRIEVANCES,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_KPIS
} from '../data/mockCadastre';

interface CadastreContextType {
  // Role & Auth
  currentRole: PortalRole;
  setCurrentRole: (role: PortalRole) => void;
  isLoggedIn: boolean;
  loginAs: (role: PortalRole) => void;
  logout: () => void;

  // Projects
  projects: CadastralProject[];
  selectedProject: CadastralProject;
  setSelectedProjectId: (id: string) => void;
  createProject: (newProj: Partial<CadastralProject>) => void;

  // Datasets
  datasets: DroneDataset[];
  uploadDataset: (dataset: Partial<DroneDataset>) => void;
  deleteDataset: (id: string) => void;

  // AI Pipeline
  pipelineStages: AIPipelineStage[];
  isPipelineRunning: boolean;
  runAIPipeline: () => void;
  resetPipeline: () => void;

  // Parcels
  parcels: CadastralParcel[];
  selectedParcel: CadastralParcel | null;
  setSelectedParcel: (parcel: CadastralParcel | null) => void;
  selectParcelById: (parcelId: string) => void;
  updateParcelBoundary: (parcelId: string, newCoords: [number, number][]) => void;
  verifyParcelBySurveyor: (parcelId: string, remarks: string, photoUrl?: string) => void;
  approveParcel: (parcelId: string) => void;
  rejectParcel: (parcelId: string, reason: string) => void;
  requestCorrection: (parcelId: string, notes: string) => void;
  batchApproveParcels: (parcelIds: string[]) => void;

  // Topology
  topologyIssues: TopologyIssue[];
  resolveTopologyIssue: (issueId: string, method?: string) => void;
  assignSurveyorToIssue: (issueId: string, surveyorName: string) => void;

  // Surveyors
  surveyors: SurveyorUser[];
  activeSurveyor: SurveyorUser;

  // Roads
  roads: RoadCorridor[];

  // Citizen Portal
  grievances: CitizenGrievance[];
  submitGrievance: (grievance: Partial<CitizenGrievance>) => string;
  selectedGrievance: CitizenGrievance | null;
  setSelectedGrievance: (g: CitizenGrievance | null) => void;

  // Audit Logs
  auditLogs: CadastralAuditLog[];
  addAuditLog: (action: string, parcelId: string, status: 'Verified' | 'Approved' | 'Resolved' | 'Generated' | 'Correction Requested' | 'Flagged', details: string) => void;

  // Notifications
  notifications: CadastralNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // KPIs
  kpis: CadastralKPIs;

  // Global Search & Filter
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  activeLandUseFilter: string;
  setActiveLandUseFilter: (filter: string) => void;
  activeStatusFilter: string;
  setActiveStatusFilter: (filter: string) => void;
}

const CadastreContext = createContext<CadastreContextType | undefined>(undefined);

export const CadastreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<PortalRole>('GOVERNMENT_ADMIN');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [projects, setProjects] = useState<CadastralProject[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectIdState] = useState<string>('PRJ-JBP-2026');

  const [datasets, setDatasets] = useState<DroneDataset[]>(MOCK_DATASETS);
  const [pipelineStages, setPipelineStages] = useState<AIPipelineStage[]>(MOCK_AI_PIPELINE_STAGES);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  const [parcels, setParcels] = useState<CadastralParcel[]>(MOCK_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(MOCK_PARCELS[0]);

  const [topologyIssues, setTopologyIssues] = useState<TopologyIssue[]>(MOCK_TOPOLOGY_ISSUES);
  const [surveyors] = useState<SurveyorUser[]>(MOCK_SURVEYORS);
  const [roads] = useState<RoadCorridor[]>(MOCK_ROAD_CORRIDORS);

  const [grievances, setGrievances] = useState<CitizenGrievance[]>(MOCK_GRIEVANCES);
  const [selectedGrievance, setSelectedGrievance] = useState<CitizenGrievance | null>(null);

  const [auditLogs, setAuditLogs] = useState<CadastralAuditLog[]>(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<CadastralNotification[]>(MOCK_NOTIFICATIONS);
  const [kpis, setKpis] = useState<CadastralKPIs>(MOCK_KPIS);

  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [activeLandUseFilter, setActiveLandUseFilter] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeSurveyor = surveyors[0]; // Rajesh Sharma

  const loginAs = (role: PortalRole) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const setSelectedProjectId = (id: string) => {
    setSelectedProjectIdState(id);
  };

  const createProject = (newProj: Partial<CadastralProject>) => {
    const id = `PRJ-${(newProj.city || 'URBAN').substring(0, 3).toUpperCase()}-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const fullProject: CadastralProject = {
      id,
      name: newProj.name || 'New Urban Cadastral Survey',
      city: newProj.city || 'Jabalpur',
      district: newProj.district || 'Jabalpur',
      state: newProj.state || 'Madhya Pradesh',
      surveyAreaSqKm: Number(newProj.surveyAreaSqKm) || 25.0,
      surveyDate: newProj.surveyDate || new Date().toISOString().split('T')[0],
      authority: newProj.authority || 'Urban Land Records Directorate',
      surveyorTeam: newProj.surveyorTeam || 'Survey Team 1',
      status: 'Planning',
      totalParcels: 0,
      aiVerifiedParcels: 0,
      fieldVerifiedParcels: 0,
      topologyErrors: 0,
      approvedParcels: 0,
      pendingApprovals: 0,
      progressPercent: 10,
      crs: 'EPSG:32644 (UTM 44N)',
      centerLat: 23.1815,
      centerLng: 79.9864,
      zoomLevel: 15,
      ...newProj
    };
    setProjects([fullProject, ...projects]);
    setSelectedProjectIdState(id);
    addAuditLog('Project Created', 'ALL', 'Generated', `Created survey project: ${fullProject.name} (${id})`);
  };

  const uploadDataset = (dataset: Partial<DroneDataset>) => {
    const id = `DS-${String(datasets.length + 1).padStart(3, '0')}`;
    const newDs: DroneDataset = {
      id,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      name: dataset.name || `Drone_Data_${id}.tif`,
      type: dataset.type || 'Drone Orthomosaic (ORI)',
      resolution: dataset.resolution || '2.5 cm/px GSD',
      uploadDate: 'Just now',
      fileSizeBytes: 3200000000,
      fileSizeFormatted: '3.0 GB',
      processingStatus: 'Uploaded',
      bandCount: 4,
      crs: 'EPSG:32644 (WGS 84 / UTM 44N)',
      coverageAreaSqKm: selectedProject.surveyAreaSqKm,
      ...dataset
    };
    setDatasets([newDs, ...datasets]);
    addAuditLog('Drone Dataset Uploaded', 'DATASET', 'Verified', `Uploaded ${newDs.name} (${newDs.type}) for ${selectedProject.name}`);
  };

  const deleteDataset = (id: string) => {
    setDatasets(datasets.filter((d) => d.id !== id));
  };

  // AI Pipeline Execution Simulation
  const runAIPipeline = () => {
    setIsPipelineRunning(true);
    setPipelineStages((prev) =>
      prev.map((stg) => ({ ...stg, status: 'Pending', progressPercent: 0 }))
    );

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < MOCK_AI_PIPELINE_STAGES.length) {
        setPipelineStages((stages) =>
          stages.map((stg, i) => {
            if (i < stageIdx) {
              return { ...stg, status: 'Completed', progressPercent: 100 };
            }
            if (i === stageIdx) {
              return { ...stg, status: 'Processing', progressPercent: 85 };
            }
            return { ...stg, status: 'Pending', progressPercent: 0 };
          })
        );
        stageIdx++;
      } else {
        clearInterval(interval);
        setPipelineStages(MOCK_AI_PIPELINE_STAGES);
        setIsPipelineRunning(false);
        addAuditLog('AI Pipeline Execution', 'Zone A', 'Generated', 'Full 9-stage deep learning pipeline completed across 18,420 parcels.');
      }
    }, 600);
  };

  const resetPipeline = () => {
    setPipelineStages(MOCK_AI_PIPELINE_STAGES);
    setIsPipelineRunning(false);
  };

  const selectParcelById = (parcelId: string) => {
    const found = parcels.find((p) => p.id === parcelId);
    if (found) setSelectedParcel(found);
  };

  const updateParcelBoundary = (parcelId: string, newCoords: [number, number][]) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          return {
            ...p,
            coordinates: newCoords,
            topologyStatus: 'Valid',
            timeline: [
              ...p.timeline,
              {
                stage: 'Surveyor Verified',
                timestamp: 'Just now',
                actor: 'Field Surveyor (Rajesh Sharma)',
                status: 'Completed',
                notes: 'Boundary vertex modified on field tablet with RTK CORS snap'
              }
            ]
          };
        }
        return p;
      })
    );
    addAuditLog('Boundary Modified', parcelId, 'Resolved', 'Field boundary vertices manually adjusted and saved.');
  };

  const verifyParcelBySurveyor = (parcelId: string, remarks: string, photoUrl?: string) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          const updated: CadastralParcel = {
            ...p,
            gtStatus: 'Verified',
            approvalStatus: 'Surveyor Verified',
            fieldRemarks: remarks || p.fieldRemarks,
            fieldPhotoUrl: photoUrl || p.fieldPhotoUrl,
            verifiedDate: 'Just now',
            timeline: [
              ...p.timeline,
              {
                stage: 'Surveyor Verified',
                timestamp: 'Just now',
                actor: `Surveyor ${activeSurveyor.name}`,
                status: 'Completed',
                notes: remarks || 'Physically inspected and verified on site with RTK-CORS'
              }
            ]
          };
          if (selectedParcel?.id === parcelId) setSelectedParcel(updated);
          return updated;
        }
        return p;
      })
    );
    setKpis((prev) => ({ ...prev, fieldVerifiedParcels: prev.fieldVerifiedParcels + 1 }));
    addAuditLog('Field Verification', parcelId, 'Verified', `Verified by Surveyor ${activeSurveyor.name} with RTK-CORS (±2.1cm)`);
  };

  const approveParcel = (parcelId: string) => {
    const certNo = `CAD-MP-JBP-2026-${parcelId.replace('PCL-', '')}`;
    const qrData = `GOV-CADASTRE-OFFICIAL-${parcelId}-${certNo}`;

    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          const updated: CadastralParcel = {
            ...p,
            approvalStatus: 'Government Approved',
            approvedDate: 'Just now',
            certificateNo: certNo,
            qrCodeData: qrData,
            timeline: [
              ...p.timeline,
              {
                stage: 'Government Approved',
                timestamp: 'Just now',
                actor: 'Government Authority (SDM Jabalpur)',
                status: 'Completed',
                notes: 'Gazette sanctioned and digital record published.'
              }
            ]
          };
          if (selectedParcel?.id === parcelId) setSelectedParcel(updated);
          return updated;
        }
        return p;
      })
    );

    setKpis((prev) => ({
      ...prev,
      governmentApprovedParcels: prev.governmentApprovedParcels + 1,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    addAuditLog('Parcel Approval', parcelId, 'Approved', `Approved with official cadastral certificate ${certNo}`);
  };

  const rejectParcel = (parcelId: string, reason: string) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          const updated: CadastralParcel = {
            ...p,
            approvalStatus: 'Rejected',
            timeline: [
              ...p.timeline,
              {
                stage: 'Admin Reviewed',
                timestamp: 'Just now',
                actor: 'Government Authority (SDM)',
                status: 'Flagged',
                notes: `Rejected: ${reason}`
              }
            ]
          };
          if (selectedParcel?.id === parcelId) setSelectedParcel(updated);
          return updated;
        }
        return p;
      })
    );
    addAuditLog('Parcel Rejected', parcelId, 'Flagged', `Rejected approval: ${reason}`);
  };

  const requestCorrection = (parcelId: string, notes: string) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          const updated: CadastralParcel = {
            ...p,
            approvalStatus: 'Correction Requested',
            discrepancyFlag: true,
            discrepancyNote: notes,
            timeline: [
              ...p.timeline,
              {
                stage: 'Admin Reviewed',
                timestamp: 'Just now',
                actor: 'Government Authority',
                status: 'Flagged',
                notes: `Sent for field re-survey: ${notes}`
              }
            ]
          };
          if (selectedParcel?.id === parcelId) setSelectedParcel(updated);
          return updated;
        }
        return p;
      })
    );
    addAuditLog('Correction Requested', parcelId, 'Correction Requested', `Returned to surveyor for re-verification: ${notes}`);
  };

  const batchApproveParcels = (parcelIds: string[]) => {
    parcelIds.forEach((id) => approveParcel(id));
  };

  const resolveTopologyIssue = (issueId: string, method: string = 'Auto-Snapping Algorithm (0.05m tolerance)') => {
    setTopologyIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: 'Resolved',
            resolvedDate: 'Just now',
            resolutionMethod: method
          };
        }
        return issue;
      })
    );

    // Also update associated parcel topology status
    const issue = topologyIssues.find((i) => i.id === issueId);
    if (issue) {
      setParcels((prev) =>
        prev.map((p) => {
          if (p.id === issue.parcelId) {
            return { ...p, topologyStatus: 'Valid' };
          }
          return p;
        })
      );
      setKpis((prev) => ({ ...prev, topologyErrors: Math.max(0, prev.topologyErrors - 1) }));
      addAuditLog('Topology Auto-Resolved', issue.parcelId, 'Resolved', `Resolved ${issue.errorType} via ${method}`);
    }
  };

  const assignSurveyorToIssue = (issueId: string, surveyorName: string) => {
    setTopologyIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            assignedSurveyor: surveyorName,
            status: 'In Review'
          };
        }
        return issue;
      })
    );
  };

  const submitGrievance = (grievance: Partial<CitizenGrievance>) => {
    const id = `TKT-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newGrievance: CitizenGrievance = {
      id,
      parcelId: grievance.parcelId || 'PCL-004821',
      propertyId: grievance.propertyId || 'PROP-2026-9921',
      applicantName: grievance.applicantName || 'Citizen Applicant',
      applicantPhone: grievance.applicantPhone || '+91 98765 43210',
      applicantEmail: grievance.applicantEmail || 'citizen@example.com',
      issueType: grievance.issueType || 'Boundary Overlap',
      description: grievance.description || 'Reported boundary discrepancy',
      status: 'Submitted',
      filedDate: 'Just now',
      ...grievance
    };
    setGrievances([newGrievance, ...grievances]);
    addAuditLog('Citizen Grievance Filed', newGrievance.parcelId, 'Generated', `Filed ticket ${id} for ${newGrievance.issueType}`);
    return id;
  };

  const addAuditLog = (
    action: string,
    parcelId: string,
    status: 'Verified' | 'Approved' | 'Resolved' | 'Generated' | 'Correction Requested' | 'Flagged',
    details: string
  ) => {
    const newLog: CadastralAuditLog = {
      id: `AUD-${Math.floor(Math.random() * 90000 + 10000)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      user: currentRole === 'GOVERNMENT_ADMIN' ? 'Admin-01 (SDM)' : currentRole === 'FIELD_SURVEYOR' ? 'Surveyor-102 (Rajesh)' : 'Citizen Portal',
      role: currentRole === 'GOVERNMENT_ADMIN' ? 'Government Authority' : currentRole === 'FIELD_SURVEYOR' ? 'Field Surveyor' : 'Citizen',
      action,
      parcelId,
      projectId: selectedProject.id,
      status,
      hash: `0x${Math.random().toString(16).substring(2, 18)}`,
      ipAddress: '10.142.6.45 (Gov-NICNET)',
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <CadastreContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLoggedIn,
        loginAs,
        logout,
        projects,
        selectedProject,
        setSelectedProjectId,
        createProject,
        datasets,
        uploadDataset,
        deleteDataset,
        pipelineStages,
        isPipelineRunning,
        runAIPipeline,
        resetPipeline,
        parcels,
        selectedParcel,
        setSelectedParcel,
        selectParcelById,
        updateParcelBoundary,
        verifyParcelBySurveyor,
        approveParcel,
        rejectParcel,
        requestCorrection,
        batchApproveParcels,
        topologyIssues,
        resolveTopologyIssue,
        assignSurveyorToIssue,
        surveyors,
        activeSurveyor,
        roads,
        grievances,
        submitGrievance,
        selectedGrievance,
        setSelectedGrievance,
        auditLogs,
        addAuditLog,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        kpis,
        globalSearchQuery,
        setGlobalSearchQuery,
        activeLandUseFilter,
        setActiveLandUseFilter,
        activeStatusFilter,
        setActiveStatusFilter
      }}
    >
      {children}
    </CadastreContext.Provider>
  );
};

export const useCadastre = () => {
  const context = useContext(CadastreContext);
  if (!context) {
    throw new Error('useCadastre must be used within a CadastreProvider');
  }
  return context;
};

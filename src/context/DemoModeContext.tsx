import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useCadastre } from './CadastreContext';

export interface DemoStepItem {
  id: number;
  stepNumber: number;
  title: string;
  targetModule: string;
  targetRole: 'GOVERNMENT_ADMIN' | 'FIELD_SURVEYOR' | 'CITIZEN';
  narration: string;
  actor: string;
  badge: string;
}

export const CADASTRAL_DEMO_STEPS: DemoStepItem[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Government Admin Authenticates & Enters Platform',
    targetModule: 'dashboard',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'SDM / Cadastral Officer logs into the secure Government Authority Command Portal.',
    actor: 'Government Authority (SDM)',
    badge: 'Step 1 of 13'
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Creates Urban Cadastral Survey Project',
    targetModule: 'projects',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Admin creates "Jabalpur Urban Parcel Survey" across 42.5 sq.km with UTM 44N CRS projection.',
    actor: 'Directorate Officer',
    badge: 'Step 2 of 13'
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'Ingests Drone Orthomosaic (ORI), DSM & DTM',
    targetModule: 'drone-datasets',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Admin uploads 2.5cm GSD GeoTIFF orthomosaic, LiDAR DSM/DTM height models and legacy shapefiles.',
    actor: 'GIS Ingestion Daemon',
    badge: 'Step 3 of 13'
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'AI Semantic Segmentation & Feature Extraction',
    targetModule: 'ai-processing',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'DeepLabV3+ with Swin-Large backbone executes 9-stage deep learning inference across 1,240 tiles.',
    actor: 'AI Vision Engine',
    badge: 'Step 4 of 13'
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'Generates 18,420 Automated Parcel Polygons',
    targetModule: 'gis-map',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'AI extracts sub-pixel boundary contours and snaps compound walls into clean GeoJSON polygons.',
    actor: 'AI Polygonizer',
    badge: 'Step 5 of 13'
  },
  {
    id: 6,
    stepNumber: 6,
    title: 'Detects 14,210 Building Footprints & Road Corridors',
    targetModule: 'gis-map',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Mask R-CNN classifies roof structures and RoadNet traces 184 km of municipal access right-of-ways.',
    actor: 'AI Feature Extractor',
    badge: 'Step 6 of 13'
  },
  {
    id: 7,
    stepNumber: 7,
    title: 'Automated Topology Scan Flags 326 Geometry Inconsistencies',
    targetModule: 'topology',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Topology engine identifies 142 parcel overlaps, 98 sliver gaps, and flags them for spatial remediation.',
    actor: 'Topology Daemon',
    badge: 'Step 7 of 13'
  },
  {
    id: 8,
    stepNumber: 8,
    title: 'Auto-Snapping Algorithm Resolves Overlaps',
    targetModule: 'topology',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'System applies 0.05m tolerance auto-snapping to instantly rectify geometry boundaries.',
    actor: 'Auto-Sanitizer',
    badge: 'Step 8 of 13'
  },
  {
    id: 9,
    stepNumber: 9,
    title: 'Field Surveyor Receives Assigned Parcels on Mobile Tablet',
    targetModule: 'field-mobile',
    targetRole: 'FIELD_SURVEYOR',
    narration: 'Surveyor Rajesh Sharma (SURV-102) opens assigned parcel list on field tablet.',
    actor: 'Field Surveyor (SURV-102)',
    badge: 'Step 9 of 13'
  },
  {
    id: 10,
    stepNumber: 10,
    title: 'Field Verification with RTK-CORS & Ground Photos',
    targetModule: 'field-mobile',
    targetRole: 'FIELD_SURVEYOR',
    narration: 'Surveyor connects to IND-MP-04 CORS station (±2.1cm accuracy), captures benchmark photo, and verifies parcel.',
    actor: 'Field Surveyor (Rajesh)',
    badge: 'Step 10 of 13'
  },
  {
    id: 11,
    stepNumber: 11,
    title: 'SDM Reviews & Sanctions Official Gazette Approval',
    targetModule: 'approvals',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Government Authority reviews statutory audit timeline and sanctions final cadastral parcel title.',
    actor: 'SDM / Revenue Officer',
    badge: 'Step 11 of 13'
  },
  {
    id: 12,
    stepNumber: 12,
    title: 'Generates Digitally Signed Certificate with QR Code',
    targetModule: 'approvals',
    targetRole: 'GOVERNMENT_ADMIN',
    narration: 'Official Gazette Certificate CAD-MP-JBP-2026-4821 generated with SHA-256 tamper-evident seal.',
    actor: 'Gazette Registry',
    badge: 'Step 12 of 13'
  },
  {
    id: 13,
    stepNumber: 13,
    title: 'Citizen Searches Parcel & Views Sanctioned Record',
    targetModule: 'citizen',
    targetRole: 'CITIZEN',
    narration: 'Public citizen searches Parcel ID PCL-004821, views certified map, and can submit discrepancy grievances.',
    actor: 'Citizen / Landowner',
    badge: 'Step 13 of 13'
  }
];

interface DemoModeContextType {
  isDemoActive: boolean;
  currentStepIndex: number;
  currentStep: DemoStepItem;
  isPlaying: boolean;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  togglePlayPause: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentStep = CADASTRAL_DEMO_STEPS[currentStepIndex] || CADASTRAL_DEMO_STEPS[0];

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setIsPlaying(false);
  };

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < CADASTRAL_DEMO_STEPS.length - 1) {
        return prev + 1;
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setIsPlaying(false);
        return prev;
      }
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = (index: number) => {
    if (index >= 0 && index < CADASTRAL_DEMO_STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && isDemoActive) {
      timer = setTimeout(() => {
        if (currentStepIndex < CADASTRAL_DEMO_STEPS.length - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, isDemoActive, currentStepIndex, nextStep]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoActive,
        currentStepIndex,
        currentStep,
        isPlaying,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
        goToStep,
        togglePlayPause
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within DemoModeProvider');
  }
  return context;
};

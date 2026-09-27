import React, { useState, useEffect } from 'react';
import { CadastreProvider, useCadastre } from './context/CadastreContext';
import { OfflineSyncProvider } from './context/OfflineSyncContext';
import { DemoModeProvider } from './context/DemoModeContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationToast } from './components/common/NotificationToast';

// Portal Landing & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { SurveyorLoginPage } from './pages/SurveyorLoginPage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';

// Admin Portal Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DroneDatasetsPage } from './pages/DroneDatasetsPage';
import { AIProcessingPage } from './pages/AIProcessingPage';
import { GISParcelMapPage } from './pages/GISParcelMapPage';
import { TopologyValidationPage } from './pages/TopologyValidationPage';
import { GroundTruthPage } from './pages/GroundTruthPage';
import { SurveyorsPage } from './pages/SurveyorsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

// Field Surveyor & Citizen Pages
import { FieldSurveyorPortalPage } from './pages/FieldSurveyorPortalPage';
import { FieldMobilePage } from './pages/FieldMobilePage';
import { CitizenPortalPage } from './pages/CitizenPortalPage';

const adminModuleTitles: Record<string, string> = {
  dashboard: 'Department & Authority Command Dashboard',
  projects: 'Project, City & Zone Management',
  'drone-datasets': 'Drone Dataset Ingestion & Preprocessing',
  'ai-processing': 'AI Processing & Semantic Segmentation Status',
  'gis-map': 'Interactive Web-GIS Parcel Maps',
  topology: 'Topology Validation & Geometry Review',
  'ground-truth': 'CORS RTK Ground Truth Monitoring',
  surveyors: 'Surveyor Field Team Assignment',
  approvals: 'Parcel Approval & Rejection Workflow',
  reports: 'Final Cadastral Map Export & SITREPs',
  'audit-log': 'Immutable System Audit Logs',
  settings: 'System Configuration & Geodetic Settings',
  'field-mobile': 'Field Surveyor Mobile Terminal'
};

type AppRoute = '/' | '/admin' | '/surveyor' | '/citizen';

const MainAppContent: React.FC = () => {
  const { currentRole, isLoggedIn, setCurrentRole } = useCadastre();

  // Initialize route from current window path or default to '/'
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname;
    if (path === '/admin') return '/admin';
    if (path === '/surveyor') return '/surveyor';
    if (path === '/citizen') return '/citizen';
    return '/';
  });

  const [activeAdminModuleId, setActiveAdminModuleId] = useState<string>('dashboard');
  const [activeViewMode, setActiveViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Sync browser URL with routing
  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentRoute('/admin');
        setCurrentRole('GOVERNMENT_ADMIN');
      } else if (path === '/surveyor') {
        setCurrentRoute('/surveyor');
        setCurrentRole('FIELD_SURVEYOR');
      } else if (path === '/citizen') {
        setCurrentRoute('/citizen');
        setCurrentRole('CITIZEN');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentRole]);

  // =========================================================================
  // ROUTE 1: / (Landing Page / Portal Selection)
  // =========================================================================
  if (currentRoute === '/') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <LandingPage
          onSelectPortal={(route) => {
            navigateTo(route);
          }}
        />
        <NotificationToast />
      </div>
    );
  }

  // =========================================================================
  // ROUTE 4: /citizen (Citizen Portal - Requires Login with ID & Password)
  // =========================================================================
  if (currentRoute === '/citizen') {
    // If citizen is not logged in, show Citizen Login
    if (!isLoggedIn || currentRole !== 'CITIZEN') {
      return (
        <CitizenLoginPage
          onLoginSuccess={() => {
            setCurrentRole('CITIZEN');
            navigateTo('/citizen');
          }}
          onBackToLanding={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-purple-600 selection:text-white">
        <Header
          currentModuleTitle="Citizen Portal"
          activeViewMode={activeViewMode}
          setActiveViewMode={setActiveViewMode}
          onBackToLanding={() => navigateTo('/')}
          onSwitchPortal={(portal) => navigateTo(portal)}
        />
        <main className="flex-1 overflow-y-auto">
          <CitizenPortalPage />
        </main>
        <NotificationToast />
      </div>
    );
  }

  // =========================================================================
  // ROUTE 3: /surveyor (Surveyor / Field Verification Portal - Requires Login)
  // =========================================================================
  if (currentRoute === '/surveyor') {
    // If surveyor is not logged in, show dedicated Surveyor Login
    if (!isLoggedIn || currentRole !== 'FIELD_SURVEYOR') {
      return (
        <SurveyorLoginPage
          onLoginSuccess={() => {
            setCurrentRole('FIELD_SURVEYOR');
            navigateTo('/surveyor');
          }}
          onBackToLanding={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-600 selection:text-white">
        <Header
          currentModuleTitle={
            activeViewMode === 'mobile'
              ? 'Surveyor Mobile Terminal'
              : 'Surveyor / Field Verification Portal'
          }
          activeViewMode={activeViewMode}
          setActiveViewMode={setActiveViewMode}
          onBackToLanding={() => navigateTo('/')}
          onSwitchPortal={(portal) => navigateTo(portal)}
        />
        <main className="flex-1 overflow-y-auto pb-24">
          {activeViewMode === 'mobile' ? (
            <FieldMobilePage />
          ) : (
            <FieldSurveyorPortalPage />
          )}
        </main>
        <NotificationToast />
      </div>
    );
  }

  // =========================================================================
  // ROUTE 2: /admin (Government / Admin Portal - Requires Login)
  // =========================================================================
  if (currentRoute === '/admin') {
    // If admin is not logged in, show dedicated Admin Login
    if (!isLoggedIn || currentRole !== 'GOVERNMENT_ADMIN') {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            setCurrentRole('GOVERNMENT_ADMIN');
            navigateTo('/admin');
          }}
          onBackToLanding={() => navigateTo('/')}
        />
      );
    }

    const currentModuleTitle = adminModuleTitles[activeAdminModuleId] || 'Admin Command Center';

    return (
      <div className="min-h-screen bg-gov-bg flex flex-col selection:bg-gov-blue selection:text-white">
        {/* Consistent Government Header */}
        <Header
          currentModuleTitle={currentModuleTitle}
          activeViewMode={activeViewMode}
          setActiveViewMode={setActiveViewMode}
          onBackToLanding={() => navigateTo('/')}
          onSwitchPortal={(portal) => navigateTo(portal)}
          onOpenNotifications={() => setActiveAdminModuleId('approvals')}
        />

        {/* Main Body Viewport */}
        <div className="flex-1 flex overflow-hidden">
          {/* Admin Sidebar with all 12 modules */}
          {activeViewMode === 'desktop' && (
            <Sidebar
              activeModuleId={activeAdminModuleId}
              onSelectModule={(modId) => setActiveAdminModuleId(modId)}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
          )}

          {/* Dynamic Workspace Content */}
          <main className="flex-1 overflow-y-auto pb-24">
            {activeViewMode === 'mobile' ? (
              <FieldMobilePage />
            ) : (
              <>
                {activeAdminModuleId === 'dashboard' && (
                  <DashboardPage
                    onNavigate={(modId) => setActiveAdminModuleId(modId)}
                    onCreateProject={() => setActiveAdminModuleId('projects')}
                  />
                )}

                {activeAdminModuleId === 'projects' && (
                  <ProjectsPage
                    onNavigateToGis={() => setActiveAdminModuleId('gis-map')}
                    onNavigateToDatasets={() => setActiveAdminModuleId('drone-datasets')}
                  />
                )}

                {activeAdminModuleId === 'drone-datasets' && (
                  <DroneDatasetsPage
                    onNavigateToAIProcessing={() => setActiveAdminModuleId('ai-processing')}
                  />
                )}

                {activeAdminModuleId === 'ai-processing' && (
                  <AIProcessingPage
                    onNavigateToMap={() => setActiveAdminModuleId('gis-map')}
                    onNavigateToTopology={() => setActiveAdminModuleId('topology')}
                  />
                )}

                {activeAdminModuleId === 'gis-map' && <GISParcelMapPage />}

                {activeAdminModuleId === 'topology' && (
                  <TopologyValidationPage
                    onNavigateToGis={() => setActiveAdminModuleId('gis-map')}
                  />
                )}

                {activeAdminModuleId === 'ground-truth' && <GroundTruthPage />}

                {activeAdminModuleId === 'surveyors' && (
                  <SurveyorsPage
                    onSwitchToSurveyorPortal={() => {
                      setCurrentRole('FIELD_SURVEYOR');
                      navigateTo('/surveyor');
                    }}
                  />
                )}

                {activeAdminModuleId === 'approvals' && <ApprovalsPage />}

                {activeAdminModuleId === 'reports' && <ReportsPage />}

                {activeAdminModuleId === 'audit-log' && <AuditLogPage />}

                {activeAdminModuleId === 'settings' && <SettingsPage />}

                {activeAdminModuleId === 'field-mobile' && <FieldMobilePage />}
              </>
            )}
          </main>
        </div>

        {/* System Toast Alerts */}
        <NotificationToast />
      </div>
    );
  }

  return null;
};

export function App() {
  return (
    <CadastreProvider>
      <OfflineSyncProvider>
        <DemoModeProvider>
          <MainAppContent />
        </DemoModeProvider>
      </OfflineSyncProvider>
    </CadastreProvider>
  );
}

export default App;

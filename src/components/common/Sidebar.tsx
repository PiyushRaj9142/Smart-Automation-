import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Brain,
  MapPin,
  AlertTriangle,
  Radio,
  Users,
  FileCheck,
  FileText,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCadastre } from '../../context/CadastreContext';

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModuleId,
  onSelectModule,
  collapsed,
  setCollapsed,
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const { topologyIssues, parcels, kpis } = useCadastre();

  const openTopologyCount = topologyIssues.filter((i) => i.status === 'Open' || i.status === 'In Review').length;
  const pendingApprovalsCount = parcels.filter(
    (p) => p.approvalStatus === 'Admin Reviewed' || p.approvalStatus === 'Topology Validated' || p.approvalStatus === 'Surveyor Verified'
  ).length;

  const navSections = [
    {
      title: 'COMMAND & PROJECTS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: Compass, badge: kpis.totalProjects, badgeType: 'info' as const },
        { id: 'drone-datasets', label: 'Drone Datasets', icon: Layers }
      ]
    },
    {
      title: 'EXTRACTION & GIS',
      items: [
        { id: 'ai-processing', label: 'Automated Processing', icon: Brain },
        { id: 'gis-map', label: 'GIS Parcel Map', icon: MapPin },
        {
          id: 'topology',
          label: 'Topology Validation',
          icon: AlertTriangle,
          badge: openTopologyCount > 0 ? openTopologyCount : undefined,
          badgeType: 'danger' as const
        },
        { id: 'ground-truth', label: 'Ground Truth & GNSS', icon: Radio }
      ]
    },
    {
      title: 'GOVERNANCE & APPROVALS',
      items: [
        { id: 'surveyors', label: 'Surveyor Roster', icon: Users },
        {
          id: 'approvals',
          label: 'Gazette Approvals',
          icon: FileCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeType: 'warning' as const
        },
        { id: 'reports', label: 'Reports & Exports', icon: FileText }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'audit-log', label: 'Audit Logs', icon: Database },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 select-none ${
        isMobileDrawer
          ? 'w-full h-full'
          : `hidden lg:flex z-30 ${collapsed ? 'w-16' : 'w-64'}`
      }`}
    >
      {/* Navigation List */}
      <div className="py-2 overflow-y-auto max-h-[calc(100vh-85px)] flex-1">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}>
            {(!collapsed || isMobileDrawer) && (
              <div className="px-4 py-1 text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
            )}

            <div className="space-y-0.5 px-2 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModuleId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={collapsed && !isMobileDrawer ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 sm:py-2 rounded text-xs transition-colors group text-left min-h-[40px] sm:min-h-[34px] ${
                      isActive
                        ? 'bg-gov-blue text-white font-medium shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-gov-navy'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-gov-blue'
                      }`}
                    />

                    {(!collapsed || isMobileDrawer) && (
                      <span className="truncate flex-1 font-medium text-xs">{item.label}</span>
                    )}

                    {(!collapsed || isMobileDrawer) && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-white text-gov-blue'
                            : item.badgeType === 'danger'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : item.badgeType === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-gov-blue border border-blue-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && !isMobileDrawer && item.badge !== undefined && (
                      <span className="w-2 h-2 rounded-full bg-red-600 absolute right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse / Expand Toggle (Only on Desktop Sidebar) */}
      {!isMobileDrawer && (
        <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {!collapsed && (
            <div className="text-[10px] text-slate-400 font-mono">
              PORTAL: GOVERNMENT ADMIN
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition mx-auto min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
};

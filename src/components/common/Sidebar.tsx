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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModuleId,
  onSelectModule,
  collapsed,
  setCollapsed
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
        { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: '2. Projects', icon: Compass, badge: kpis.totalProjects, badgeType: 'info' as const },
        { id: 'drone-datasets', label: '3. Drone Datasets', icon: Layers }
      ]
    },
    {
      title: 'AI PIPELINE & GIS',
      items: [
        { id: 'ai-processing', label: '4. AI Processing', icon: Brain },
        { id: 'gis-map', label: '5. Parcel Maps', icon: MapPin },
        {
          id: 'topology',
          label: '6. Topology Validation',
          icon: AlertTriangle,
          badge: openTopologyCount > 0 ? openTopologyCount : undefined,
          badgeType: 'danger' as const
        },
        { id: 'ground-truth', label: '7. Ground Truth (GT)', icon: Radio }
      ]
    },
    {
      title: 'GOVERNANCE & APPROVALS',
      items: [
        { id: 'surveyors', label: '8. Surveyors', icon: Users },
        {
          id: 'approvals',
          label: '9. Approvals & Gazette',
          icon: FileCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeType: 'warning' as const
        },
        { id: 'reports', label: '10. Reports & Exports', icon: FileText }
      ]
    },
    {
      title: 'AUDIT & CONFIGURATION',
      items: [
        { id: 'audit-log', label: '11. Audit Logs', icon: Database },
        { id: 'settings', label: '12. Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="py-2 overflow-y-auto max-h-[calc(100vh-85px)]">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}>
            {!collapsed && (
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
                    onClick={() => onSelectModule(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors group text-left ${
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

                    {!collapsed && (
                      <span className="truncate flex-1 font-medium">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
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

                    {collapsed && item.badge !== undefined && (
                      <span className="w-2 h-2 rounded-full bg-red-600 absolute right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse / Expand Toggle */}
      <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        {!collapsed && (
          <div className="text-[10px] text-slate-400 font-mono">
            PORTAL: GOVERNMENT ADMIN
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

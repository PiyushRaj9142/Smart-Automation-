import React, { useState } from 'react';
import {
  Bell,
  Shield,
  LogOut,
  MapPin,
  ChevronDown,
  User,
  Landmark,
  UserCheck,
  Building2,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { useCadastre } from '../../context/CadastreContext';
import { PortalRole } from '../../types/cadastre';

interface HeaderProps {
  currentModuleTitle: string;
  activeViewMode?: 'desktop' | 'mobile';
  setActiveViewMode?: (mode: 'desktop' | 'mobile') => void;
  onOpenNotifications?: () => void;
  onBackToLanding?: () => void;
  onSwitchPortal?: (portal: '/admin' | '/surveyor' | '/citizen') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModuleTitle,
  activeViewMode = 'desktop',
  setActiveViewMode,
  onOpenNotifications,
  onBackToLanding,
  onSwitchPortal
}) => {
  const {
    currentRole,
    setCurrentRole,
    projects,
    selectedProject,
    setSelectedProjectId,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    logout
  } = useCadastre();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showProjectSelector, setShowProjectSelector] = useState<boolean>(false);
  const [showSwitchPortalMenu, setShowSwitchPortalMenu] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const roleLabels: Record<
    PortalRole,
    { title: string; subtitle: string; icon: any; color: string; bg: string; route: '/admin' | '/surveyor' | '/citizen' }
  > = {
    GOVERNMENT_ADMIN: {
      title: 'Government / Admin Portal',
      subtitle: 'Centralized Cadastral Survey & Land Record Management',
      icon: Landmark,
      color: 'text-gov-blue',
      bg: 'bg-blue-100 text-gov-blue border-blue-200',
      route: '/admin'
    },
    FIELD_SURVEYOR: {
      title: 'Surveyor / Field Verification Portal',
      subtitle: 'Field Verification & Ground Truthing Workspace',
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      route: '/surveyor'
    },
    CITIZEN: {
      title: 'Citizen Portal',
      subtitle: 'Access Approved Parcel Information & Track Land Record Requests',
      icon: Building2,
      color: 'text-purple-700',
      bg: 'bg-purple-100 text-purple-800 border-purple-200',
      route: '/citizen'
    }
  };

  const currentRoleInfo = roleLabels[currentRole] || roleLabels.GOVERNMENT_ADMIN;

  const handlePortalSwitch = (portalRoute: '/admin' | '/surveyor' | '/citizen') => {
    setShowSwitchPortalMenu(false);
    if (portalRoute === '/admin') setCurrentRole('GOVERNMENT_ADMIN');
    else if (portalRoute === '/surveyor') setCurrentRole('FIELD_SURVEYOR');
    else setCurrentRole('CITIZEN');

    if (onSwitchPortal) onSwitchPortal(portalRoute);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Ministry Banner */}
      <div className="bg-gov-navy text-white text-[11px] px-4 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  onBackToLanding();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-amber-300 hover:text-white rounded border border-slate-600 text-[11px] font-bold transition shadow-xs"
              title="Back to Previous Page / Portal Selection"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">🏛 URBAN CADASTRAL GOVERNANCE PORTAL</span>
            <span className="text-slate-400 hidden sm:inline">| Ministry of Housing & Urban Affairs (MoHUA)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RTK CORS: CONNECTED (IND-MP-04)</span>
          </div>

          {/* Switch Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSwitchPortalMenu(!showSwitchPortalMenu)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-[10px] text-slate-200 font-bold transition"
            >
              <span>Switch Portal</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSwitchPortalMenu && (
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800 animate-in fade-in-50 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Select Active Portal
                </div>

                <button
                  onClick={() => handlePortalSwitch('/admin')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition ${
                    currentRole === 'GOVERNMENT_ADMIN' ? 'bg-blue-50/70 font-bold text-gov-blue' : 'text-slate-700'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-gov-blue" />
                  <div>
                    <div className="leading-tight">Government / Admin</div>
                    <div className="text-[10px] text-slate-400 font-mono">/admin</div>
                  </div>
                </button>

                <button
                  onClick={() => handlePortalSwitch('/surveyor')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition ${
                    currentRole === 'FIELD_SURVEYOR' ? 'bg-emerald-50/70 font-bold text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="leading-tight">Surveyor / Field Verification</div>
                    <div className="text-[10px] text-slate-400 font-mono">/surveyor</div>
                  </div>
                </button>

                <button
                  onClick={() => handlePortalSwitch('/citizen')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition ${
                    currentRole === 'CITIZEN' ? 'bg-purple-50/70 font-bold text-purple-800' : 'text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="leading-tight">Citizen Portal</div>
                    <div className="text-[10px] text-slate-400 font-mono">/citizen</div>
                  </div>
                </button>

                {onBackToLanding && (
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setShowSwitchPortalMenu(false);
                        onBackToLanding();
                      }}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 font-semibold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to Portal Selection (/)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Back Button & Department & Current Project Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onBackToLanding && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  onBackToLanding();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-gov-navy border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs group"
              title="Back to Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-gov-navy group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${currentRoleInfo.bg}`}>
                {currentRoleInfo.title}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
              <h1 className="text-sm sm:text-base font-bold text-gov-navy">
                {currentModuleTitle}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
              {currentRoleInfo.subtitle}
            </p>
          </div>

          {/* Project Selector Dropdown (Admin & Surveyor) */}
          {currentRole !== 'CITIZEN' && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 transition shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-gov-blue" />
                <span className="max-w-[180px] truncate">{selectedProject.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showProjectSelector && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    Active Cadastral Projects
                  </div>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setShowProjectSelector(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition flex items-center justify-between ${
                        proj.id === selectedProject.id ? 'bg-blue-50 font-bold text-gov-blue' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{proj.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">{proj.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: View Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile / Tablet View Switcher (for Field Surveyor) */}
          {currentRole === 'FIELD_SURVEYOR' && setActiveViewMode && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              <button
                onClick={() => setActiveViewMode('desktop')}
                className={`px-2 py-1 rounded transition text-xs font-medium ${
                  activeViewMode === 'desktop' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setActiveViewMode('mobile')}
                className={`px-2 py-1 rounded transition text-xs font-medium ${
                  activeViewMode === 'mobile' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
                }`}
              >
                Tablet / Mobile
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-gov-navy transition relative"
              title="Cadastral Event Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-gov-navy uppercase tracking-wide">
                    Event Notifications ({unreadCount})
                  </span>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-gov-blue hover:underline"
                  >
                    Mark All Read
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto mt-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2 rounded text-xs transition cursor-pointer ${
                        n.unread ? 'bg-blue-50/80 border border-blue-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu / Logout */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-md transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-gov-navy flex items-center justify-center font-bold text-xs">
                {currentRole === 'GOVERNMENT_ADMIN' ? 'SD' : currentRole === 'FIELD_SURVEYOR' ? 'RS' : 'CT'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-800">{currentRoleInfo.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentRole === 'GOVERNMENT_ADMIN' ? 'admin@cadastre.gov' : currentRole === 'FIELD_SURVEYOR' ? 'surveyor@cadastre.gov' : 'citizen@example.com'}
                  </div>
                </div>

                {onBackToLanding && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onBackToLanding();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                    <span>Portal Selection (/)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    if (onBackToLanding) onBackToLanding();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-700 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  MapPin,
  ChevronDown,
  User,
  Landmark,
  UserCheck,
  Building2,
  Layers,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Check
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
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentModuleTitle,
  activeViewMode = 'desktop',
  setActiveViewMode,
  onOpenNotifications,
  onBackToLanding,
  onSwitchPortal,
  onToggleMobileNav,
  isMobileNavOpen
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
      title: 'Government / Admin',
      subtitle: 'Cadastral Survey & Land Record Management',
      icon: Landmark,
      color: 'text-gov-blue',
      bg: 'bg-blue-50 text-gov-blue border-blue-200',
      route: '/admin'
    },
    FIELD_SURVEYOR: {
      title: 'Surveyor / Field Portal',
      subtitle: 'Field Verification & Ground Truthing',
      icon: UserCheck,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      route: '/surveyor'
    },
    CITIZEN: {
      title: 'Citizen Portal',
      subtitle: 'Public Land Records & Certificate Search',
      icon: Building2,
      color: 'text-purple-800',
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs select-none w-full min-w-0">
      {/* Top Administrative Bar */}
      <div className="bg-gov-navy text-white text-[11px] px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBackToLanding && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  onBackToLanding();
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 hover:text-white rounded border border-slate-700 text-[10px] sm:text-[11px] font-medium transition flex-shrink-0"
              title="Return to Portal Gateway"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Gateway</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="font-semibold text-slate-100 truncate text-[11px] sm:text-xs">
              Urban Cadastral Portal
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline text-[11px] truncate">
              Ministry of Housing & Urban Affairs
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden lg:inline">CORS RTK: Connected (IND-MP-04)</span>
            <span className="lg:hidden">RTK OK</span>
          </div>

          {/* Switch Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSwitchPortalMenu(!showSwitchPortalMenu)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-[10px] sm:text-[11px] text-slate-200 font-medium transition"
            >
              <span>Switch</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSwitchPortalMenu && (
              <div className="absolute right-0 mt-1 w-60 sm:w-64 bg-white rounded-lg shadow-gov-lg border border-slate-200 py-1 z-50 text-slate-800 animate-in fade-in-50 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  Select Active Role Portal
                </div>

                <button
                  onClick={() => handlePortalSwitch('/admin')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                    currentRole === 'GOVERNMENT_ADMIN' ? 'bg-blue-50 font-semibold text-gov-blue' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Landmark className="w-4 h-4 text-gov-blue flex-shrink-0" />
                    <div className="truncate">
                      <div className="leading-tight truncate">Government / Admin</div>
                      <div className="text-[10px] text-slate-400 font-mono">/admin</div>
                    </div>
                  </div>
                  {currentRole === 'GOVERNMENT_ADMIN' && <Check className="w-3.5 h-3.5 text-gov-blue flex-shrink-0" />}
                </button>

                <button
                  onClick={() => handlePortalSwitch('/surveyor')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                    currentRole === 'FIELD_SURVEYOR' ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <UserCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <div className="truncate">
                      <div className="leading-tight truncate">Surveyor / Field</div>
                      <div className="text-[10px] text-slate-400 font-mono">/surveyor</div>
                    </div>
                  </div>
                  {currentRole === 'FIELD_SURVEYOR' && <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />}
                </button>

                <button
                  onClick={() => handlePortalSwitch('/citizen')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                    currentRole === 'CITIZEN' ? 'bg-purple-50 font-semibold text-purple-800' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    <div className="truncate">
                      <div className="leading-tight truncate">Citizen Portal</div>
                      <div className="text-[10px] text-slate-400 font-mono">/citizen</div>
                    </div>
                  </div>
                  {currentRole === 'CITIZEN' && <Check className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />}
                </button>

                {onBackToLanding && (
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setShowSwitchPortalMenu(false);
                        onBackToLanding();
                      }}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 font-medium"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to Gateway (/)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Left: Mobile Nav Hamburger + Department & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Navigation Drawer Button (Admin & Surveyor) */}
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-gov-navy hover:bg-slate-100 active:bg-slate-200 rounded-md transition flex items-center justify-center min-h-[40px] min-w-[40px]"
              aria-label={isMobileNavOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              title="Toggle Navigation Menu"
            >
              {isMobileNavOpen ? (
                <span className="text-lg font-bold">✕</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold border truncate max-w-[110px] sm:max-w-none ${currentRoleInfo.bg}`}>
                {currentRoleInfo.title}
              </span>
              <span className="text-slate-300 text-xs hidden xs:inline">&bull;</span>
              <h1 className="text-xs sm:text-sm font-bold text-gov-navy truncate">
                {currentModuleTitle}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block mt-0.5 truncate">
              {currentRoleInfo.subtitle}
            </p>
          </div>

          {/* Project Selector Dropdown (Admin & Surveyor) */}
          {currentRole !== 'CITIZEN' && (
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-gov-blue flex-shrink-0" />
                <span className="max-w-[140px] truncate">{selectedProject.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showProjectSelector && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-gov-lg border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
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
                        proj.id === selectedProject.id ? 'bg-blue-50 font-semibold text-gov-blue' : 'text-slate-700'
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
            <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              <button
                onClick={() => setActiveViewMode('desktop')}
                className={`px-2.5 py-1 rounded transition text-xs font-medium ${
                  activeViewMode === 'desktop' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setActiveViewMode('mobile')}
                className={`px-2.5 py-1 rounded transition text-xs font-medium ${
                  activeViewMode === 'mobile' ? 'bg-white shadow-2xs text-emerald-800 font-semibold' : 'text-slate-600'
                }`}
              >
                Field Tablet
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-gov-navy transition relative"
              title="Cadastral Event Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-gov-lg border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                    Notifications ({unreadCount})
                  </span>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-gov-blue hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto mt-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2 rounded text-xs transition cursor-pointer ${
                        n.unread ? 'bg-blue-50/60 border border-blue-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
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
              className="flex items-center gap-1.5 p-1 hover:bg-slate-100 rounded-md transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 text-gov-navy border border-slate-200 flex items-center justify-center font-bold text-xs">
                {currentRole === 'GOVERNMENT_ADMIN' ? 'SD' : currentRole === 'FIELD_SURVEYOR' ? 'RS' : 'CT'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-gov-lg border border-slate-200 py-1 z-50 text-xs">
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
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                    <span>Portal Gateway (/)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    if (onBackToLanding) onBackToLanding();
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-700 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
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


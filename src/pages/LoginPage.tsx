import React, { useState } from 'react';
import {
  Landmark,
  UserCheck,
  Building2,
  ArrowRight,
  Shield,
  CheckCircle2,
  Compass,
  Layers,
  MapPin,
  Radio,
  FileCheck,
  Search,
  Lock,
  Mail,
  X,
  Sparkles,
  Database,
  Eye,
  Globe2
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { PortalRole } from '../types/cadastre';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { loginAs } = useCadastre();

  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [showCustomAuthModal, setShowCustomAuthModal] = useState<boolean>(false);
  const [modalRole, setModalRole] = useState<PortalRole>('GOVERNMENT_ADMIN');
  const [customEmail, setCustomEmail] = useState<string>('admin@cadastre.gov');
  const [customPassword, setCustomPassword] = useState<string>('admin123');

  const handleDirectEnter = (role: PortalRole) => {
    loginAs(role);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleOpenAuthModal = (role: PortalRole) => {
    setModalRole(role);
    if (role === 'GOVERNMENT_ADMIN') {
      setCustomEmail('admin@cadastre.gov');
      setCustomPassword('admin123');
    } else if (role === 'FIELD_SURVEYOR') {
      setCustomEmail('surveyor@cadastre.gov');
      setCustomPassword('survey123');
    } else {
      setCustomEmail('citizen@example.com');
      setCustomPassword('citizen123');
    }
    setShowCustomAuthModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(modalRole);
    setShowCustomAuthModal(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 selection:bg-gov-blue selection:text-white">
      {/* Official Government Top Bar */}
      <div className="bg-gov-navy text-white text-xs px-4 sm:px-8 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-gov-navy flex items-center justify-center font-bold text-[10px]">
              🏛
            </div>
            <span className="font-semibold tracking-wide uppercase text-[11px]">
              {language === 'EN'
                ? 'Ministry of Housing & Urban Affairs | Survey & Cadastral Directorate'
                : 'आवासन और शहरी कार्य मंत्रालय | सर्वेक्षण एवं भू-अभिलेख निदेशालय'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400 hidden md:inline">
            National GIS Cadastral Network (NGCN-v4.2)
          </span>
          <button
            type="button"
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 font-mono text-amber-300 transition"
          >
            {language === 'EN' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Front Page Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero Branding Section */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-gov-blue text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-gov-blue" />
            <span>National Urban Cadastre AI & Governance Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gov-navy tracking-tight leading-tight">
            Urban Cadastral Governance Portal
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-600 max-w-2xl mx-auto">
            AI-Powered Urban Parcel Mapping, Verification & Land Record Management
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed pt-1">
            Transform high-resolution drone orthomosaics, DSM/DTM surface height models, and ground truth CORS telemetry into verified, legally compliant cadastral records with automated topology validation and multi-tier government governance.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THREE PROFESSIONAL PORTAL CARDS (SIDE-BY-SIDE ON DESKTOP & RESPONSIVE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* CARD 1 — GOVERNMENT / ADMIN PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-gov-blue transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              {/* Header with Icon */}
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-blue-50 text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition duration-200">
                  <Landmark className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-gov-blue rounded uppercase">
                  Authority Access
                </span>
              </div>

              {/* Title & Short Description */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-gov-blue transition">
                  Government / Admin Portal
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Centralized portal for survey authorities to manage cadastral mapping, AI processing and approvals.
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => handleDirectEnter('GOVERNMENT_ADMIN')}
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy active:bg-slate-900 text-white font-bold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Feature Points */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Capabilities:
                </div>
                {[
                  'Department / Survey Authority Dashboard',
                  'Project / City / Zone Management',
                  'Drone Dataset Upload',
                  'AI Processing Status',
                  'Parcel Approval / Rejection',
                  'Topology Error Review',
                  'GT Verification Monitoring',
                  'Surveyor Assignment',
                  'Final Cadastral Map Export',
                  'Audit Logs'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-blue flex-shrink-0" />
                    <span className="text-[11px] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Credentials Helper */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Demo: admin@cadastre.gov</span>
              <button
                type="button"
                onClick={() => handleOpenAuthModal('GOVERNMENT_ADMIN')}
                className="text-gov-blue hover:underline font-bold font-sans text-[11px]"
              >
                Custom Login
              </button>
            </div>
          </div>

          {/* CARD 2 — SURVEYOR / FIELD VERIFICATION PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-600 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              {/* Header with Icon */}
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded uppercase">
                  Field Operations
                </span>
              </div>

              {/* Title & Short Description */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-emerald-700 transition">
                  Surveyor / Field Verification
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Field verification workspace for surveyors to validate AI-generated parcel boundaries and cadastral features.
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => handleDirectEnter('FIELD_SURVEYOR')}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Surveyor Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Feature Points */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Capabilities:
                </div>
                {[
                  'Assigned Parcels',
                  'Map + Satellite / Drone View',
                  'AI-Generated Boundary',
                  'Verify / Edit / Reject',
                  'GNSS / CORS Coordinate Capture',
                  'Ground Photos',
                  'Field Remarks',
                  'Sync Status'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                    <span className="text-[11px] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Credentials Helper */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Demo: surveyor@cadastre.gov</span>
              <button
                type="button"
                onClick={() => handleOpenAuthModal('FIELD_SURVEYOR')}
                className="text-emerald-700 hover:underline font-bold font-sans text-[11px]"
              >
                Custom Login
              </button>
            </div>
          </div>

          {/* CARD 3 — CITIZEN PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-600 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              {/* Header with Icon & Public Access Badge */}
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition duration-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded uppercase">
                  Public Access
                </span>
              </div>

              {/* Title & Short Description */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-purple-700 transition">
                  Citizen Portal
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Public access for viewing approved parcel information and submitting land-record related requests.
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => handleDirectEnter('CITIZEN')}
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Citizen Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Feature Points */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Capabilities:
                </div>
                {[
                  'Search Parcel / Property',
                  'View Approved Parcel Information',
                  'Application / Status Tracking',
                  'Report Boundary Discrepancy',
                  'Download Approved Map / Document'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                    <span className="text-[11px] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Credentials Helper */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Demo: citizen@example.com</span>
              <button
                type="button"
                onClick={() => handleOpenAuthModal('CITIZEN')}
                className="text-purple-700 hover:underline font-bold font-sans text-[11px]"
              >
                Custom Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Custom Auth / Password Modal */}
      {showCustomAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-xs uppercase tracking-wider font-mono">
                  {modalRole === 'GOVERNMENT_ADMIN'
                    ? 'Government Authority Login'
                    : modalRole === 'FIELD_SURVEYOR'
                    ? 'Field Surveyor Login'
                    : 'Citizen Portal Authentication'}
                </h3>
              </div>
              <button
                onClick={() => setShowCustomAuthModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Email / Username
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue text-xs font-medium"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue text-xs font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-gov-navy font-mono">
                Default Demo Credentials Pre-filled.
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomAuthModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded font-bold transition shadow-sm"
                >
                  Authenticate & Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 text-slate-500 text-[11px] px-4 py-3 text-center">
        <span>
          © 2026 Urban Cadastral AI Platform | National Land Records Modernization Programme (NLRMP) | Survey Directorate
        </span>
      </footer>
    </div>
  );
};

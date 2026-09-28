import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  FileCheck,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  QrCode,
  Printer,
  X,
  Send,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Compass,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { CadastralParcel, CitizenGrievance, GrievanceIssueType } from '../types/cadastre';
import { CadastralMap } from '../components/gis/CadastralMap';

export const CitizenPortalPage: React.FC = () => {
  const {
    parcels,
    selectedParcel,
    setSelectedParcel,
    grievances,
    submitGrievance,
    selectedProject,
    setCurrentRole
  } = useCadastre();

  const [searchQuery, setSearchQuery] = useState<string>('PCL-004821');
  const [activeTab, setActiveTab] = useState<'search' | 'report' | 'track'>('search');
  const [searchedParcel, setSearchedParcel] = useState<CadastralParcel | null>(
    parcels.find((p) => p.id === 'PCL-004821') || parcels[0]
  );
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [ticketIdSuccess, setTicketIdSuccess] = useState<string | null>(null);

  // Grievance Form State
  const [grievanceForm, setGrievanceForm] = useState({
    parcelId: searchedParcel?.id || 'PCL-004821',
    propertyId: searchedParcel?.propertyId || 'PROP-2026-9921',
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    issueType: 'Boundary Overlap' as GrievanceIssueType,
    description: '',
    supportingDocName: 'Deed_Document_Scanned.pdf'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = parcels.find(
      (p) =>
        p.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.propertyId.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.khasraNo.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.ownerName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    if (found) {
      setSearchedParcel(found);
      setSelectedParcel(found);
      setGrievanceForm((prev) => ({
        ...prev,
        parcelId: found.id,
        propertyId: found.propertyId
      }));
    } else {
      alert('No matching parcel found in the official registry. Please try searching PCL-004821, PCL-000421, or 142/1.');
    }
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceForm.applicantName || !grievanceForm.description) return;

    const ticketId = submitGrievance({
      ...grievanceForm,
      parcelId: searchedParcel?.id || grievanceForm.parcelId
    });

    setTicketIdSuccess(ticketId);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 selection:bg-purple-600 selection:text-white w-full min-w-0">
      {/* Sub-Header Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gov-navy">
                Public Land Records & Parcel Search
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Official Cadastral Land Title & Grievance Registry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md transition text-center min-h-[36px] sm:min-h-[32px] flex items-center justify-center ${
                activeTab === 'search'
                  ? 'bg-white text-purple-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md transition text-center min-h-[36px] sm:min-h-[32px] flex items-center justify-center ${
                activeTab === 'report'
                  ? 'bg-white text-purple-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md transition text-center min-h-[36px] sm:min-h-[32px] flex items-center justify-center ${
                activeTab === 'track'
                  ? 'bg-white text-purple-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track ({grievances.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Success Banner if Ticket Created */}
        {ticketIdSuccess && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-lg text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Grievance Ticket Successfully Registered!</h4>
                <p className="text-xs text-emerald-900 mt-0.5">
                  Your reference ticket number is{' '}
                  <strong className="font-mono text-emerald-950">{ticketIdSuccess}</strong>. An authorized SDM revenue officer has been assigned.
                </p>
              </div>
            </div>
            <button
              onClick={() => setTicketIdSuccess(null)}
              className="px-3 py-1 bg-white border border-emerald-300 text-emerald-900 rounded text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: Search Property & View Official Parcel Map */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Hero Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 text-center max-w-3xl mx-auto">
              <div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-full uppercase tracking-wider font-mono">
                  Online Urban Cadastre Registry
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gov-navy mt-2">
                  Verify Property Title, Boundary Map & Sanction Status
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
                  Enter your unique Parcel ID, Property Identification Number (PIN), or Revenue Khasra Number.
                </p>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCL-004821 or 142/1 or PROP-2026-9921"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-purple-600 font-mono shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap"
                >
                  Search Registry
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <span>Quick demo lookups:</span>
                {['PCL-004821', 'PCL-000421', 'PCL-000422', '142/1'].map((demo) => (
                  <button
                    key={demo}
                    type="button"
                    onClick={() => {
                      setSearchQuery(demo);
                      const found = parcels.find(
                        (p) => p.id === demo || p.khasraNo === demo
                      );
                      if (found) {
                        setSearchedParcel(found);
                        setSelectedParcel(found);
                      }
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-purple-50 text-purple-900 border border-slate-200 rounded font-mono font-semibold"
                  >
                    {demo}
                  </button>
                ))}
              </div>
            </div>

            {/* Searched Parcel Information & Map Preview */}
            {searchedParcel && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Parcel Legal Details */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-700">
                        {searchedParcel.id}
                      </span>
                      <h3 className="text-base font-bold text-gov-navy mt-0.5">
                        Official Land Record Summary
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase ${
                        searchedParcel.approvalStatus === 'Government Approved'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {searchedParcel.approvalStatus === 'Government Approved'
                        ? '✓ GAZETTE SANCTIONED'
                        : 'SURVEY IN PROGRESS'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-medium">Property PIN:</span>
                        <div className="font-mono font-bold text-slate-800">{searchedParcel.propertyId}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Registered Owner:</span>
                        {/* Privacy masking for public citizen portal */}
                        <div className="font-bold text-slate-900">
                          {searchedParcel.ownerName.replace(/(\w{2})\w+(\w{2})/, '$1****$2')}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Khasra / Khata:</span>
                        <div className="font-mono font-bold text-slate-800">
                          {searchedParcel.khasraNo} &bull; {searchedParcel.khataNo}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Ward Jurisdiction:</span>
                        <div className="font-medium text-slate-800">{searchedParcel.ward}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-medium">Certified Area:</span>
                        <div className="font-mono font-bold text-emerald-800 text-sm">
                          {searchedParcel.areaSqM} m²
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ({searchedParcel.areaSqFt} sq.ft)
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Land-Use Category:</span>
                        <div className="font-bold text-slate-800">{searchedParcel.landUse}</div>
                        <div className="text-[10px] text-slate-500">{searchedParcel.buildingStatus}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                      <div className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                        <span>Survey of India CORS Telemetry Fixed</span>
                      </div>
                      <p className="text-[11px] text-purple-900">
                        Boundary vertices measured with sub-centimeter geodetic accuracy (±{searchedParcel.gnssData.accuracyCm} cm).
                      </p>
                    </div>
                  </div>

                  {/* Citizen Actions */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Approved Cadastral Certificate & Map</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('report')}
                      className="w-full px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Report Boundary Discrepancy or Grievance</span>
                    </button>
                  </div>
                </div>

                {/* Right: Interactive Public Map */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-purple-700" />
                        <span>Public Cadastral Map Viewport</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Orthophoto satellite overlay with property boundary and building plinth.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <CadastralMap height="h-[460px]" showControls={true} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Report Boundary Discrepancy Form */}
        {activeTab === 'report' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl mx-auto space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded font-mono uppercase">
                  Citizen Grievance Redressal Cell
                </span>
              </div>
              <h2 className="text-lg font-bold text-gov-navy mt-1">
                Report a Cadastral Boundary Discrepancy or Encroachment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit an official boundary review application. An assigned government surveyor will re-verify the property using RTK-CORS telemetry.
              </p>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parcel Identifier (PCL-...) *</label>
                  <input
                    type="text"
                    required
                    value={grievanceForm.parcelId}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, parcelId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 font-mono font-bold text-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                  <select
                    value={grievanceForm.issueType}
                    onChange={(e) =>
                      setGrievanceForm({ ...grievanceForm, issueType: e.target.value as GrievanceIssueType })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 font-medium text-slate-800"
                  >
                    <option value="Boundary Overlap">Boundary Overlap with Neighbor</option>
                    <option value="Encroachment">Physical Encroachment on Property</option>
                    <option value="Measurement Error">Discrepancy in Area Measurement</option>
                    <option value="Land Use Mismatch">Incorrect Land-Use Classification</option>
                    <option value="Building Omission">Building Structure Missing on Map</option>
                    <option value="Name Correction">Owner Name / Title Correction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Verma"
                    value={grievanceForm.applicantName}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, applicantName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={grievanceForm.applicantPhone}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, applicantPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Detailed Narrative of Discrepancy *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the boundary difference, physical compound stone markers, or specific encroachment area..."
                    value={grievanceForm.description}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Supporting Document / Site Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                    <UploadCloud className="w-6 h-6 text-purple-700 mx-auto mb-1" />
                    <span className="font-semibold text-slate-700">
                      {grievanceForm.supportingDocName || 'Upload registry deed, photo, or tax receipt'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Grievance Application</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Track Application Status */}
        {activeTab === 'track' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-gov-navy">
                  Application & Grievance Tracking Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status of all submitted boundary correction requests and surveyor dispatches.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('report')}
                className="px-3 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 rounded text-xs font-bold hover:bg-purple-100"
              >
                + New Application
              </button>
            </div>

            <div className="space-y-3">
              {grievances.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-purple-700">{g.id}</span>
                      <span className="text-[10px] px-2 py-0.2 bg-slate-200 text-slate-800 rounded font-bold">
                        Parcel: {g.parcelId}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{g.issueType}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'Field Surveyor Assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{g.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
                    <div>
                      Filed: <strong>{g.filedDate}</strong> &bull; Applicant: <strong>{g.applicantName}</strong>
                    </div>
                    {g.surveyorAssigned && (
                      <div className="text-emerald-700 font-semibold">
                        Assigned Surveyor: {g.surveyorAssigned} (RTK Field Visit Scheduled)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Gazette Certificate View Modal */}
      {showCertificateModal && searchedParcel && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gov-navy w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b-4 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-gov-navy flex items-center justify-center text-xl font-bold">
                  🏛
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wider uppercase">
                    GOVERNMENT OF MADHYA PRADESH
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    Urban Cadastral & Land Records Directorate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs bg-slate-50/50">
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-base font-extrabold text-gov-navy uppercase tracking-wide">
                  PUBLIC CADASTRAL MAP & TITLE EXCERPT
                </h2>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  Gazette Sanction No: <strong>{searchedParcel.certificateNo || 'CAD-MP-JBP-2026-4821'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Parcel Identifier:</span>
                  <div className="font-mono font-bold text-gov-navy text-sm">{searchedParcel.id}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Registered Owner:</span>
                  <div className="font-bold text-slate-900 text-sm">{searchedParcel.ownerName}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Khasra / Khata:</span>
                  <div className="font-mono font-bold text-slate-800">
                    {searchedParcel.khasraNo} / {searchedParcel.khataNo}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Area Measurement:</span>
                  <div className="font-mono font-bold text-emerald-800 text-sm">
                    {searchedParcel.areaSqM} m² ({searchedParcel.areaSqFt} sq.ft)
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Land-Use Designation:</span>
                  <div className="font-bold text-slate-800">{searchedParcel.landUse}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Survey Authority:</span>
                  <div className="font-medium text-slate-800">{selectedProject.authority}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <QrCode className="w-10 h-10 text-gov-navy" />
                  </div>
                  <div>
                    <div className="font-bold text-gov-navy text-xs">Digitally Sealed by SDM</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                      Verify online at: portal.cadastre.gov.in/verify
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-emerald-800 font-bold">
                  ✓ VERIFIED STATUTORY RECORD
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

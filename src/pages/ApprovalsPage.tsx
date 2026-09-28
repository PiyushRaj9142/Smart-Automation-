import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Landmark,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Printer,
  Download,
  QrCode,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { CadastralParcel, ParcelApprovalStatus } from '../types/cadastre';
import { CadastralMap } from '../components/gis/CadastralMap';

export interface ApprovalsPageProps {
  onNavigateToMap?: (parcelId?: string) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onNavigateToMap }) => {
  const {
    parcels,
    selectedParcel,
    selectParcelById,
    approveParcel,
    rejectParcel,
    requestCorrection,
    batchApproveParcels,
    selectedProject
  } = useCadastre();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>([]);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [certParcel, setCertParcel] = useState<CadastralParcel | null>(null);

  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [correctionNotes, setCorrectionNotes] = useState<string>('');
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);

  const pendingApprovals = parcels.filter(
    (p) => p.approvalStatus === 'Admin Reviewed' || p.approvalStatus === 'Topology Validated' || p.approvalStatus === 'Surveyor Verified'
  );
  const approvedParcels = parcels.filter((p) => p.approvalStatus === 'Government Approved');

  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.propertyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedParcelIds.length === filteredParcels.length) {
      setSelectedParcelIds([]);
    } else {
      setSelectedParcelIds(filteredParcels.map((p) => p.id));
    }
  };

  const toggleSelectParcel = (id: string) => {
    setSelectedParcelIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = () => {
    if (selectedParcelIds.length === 0) return;
    batchApproveParcels(selectedParcelIds);
    setSelectedParcelIds([]);
  };

  const openCertificate = (parcel: CadastralParcel) => {
    setCertParcel(parcel);
    setShowCertModal(true);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              Statutory Gazette Sanctioning Desk
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500">
              Authority: <strong className="text-slate-800">{selectedProject.authority}</strong>
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <FileCheck className="w-5 h-5 text-gov-blue" />
            <span>Cadastral Approval Workflow & Official Gazette Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Execute statutory sub-divisional magistrate (SDM) reviews, sanction final cadastral maps, and publish digitally verifiable land certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedParcelIds.length > 0 && (
            <button
              onClick={handleBatchApprove}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sanction Selected ({selectedParcelIds.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              const pendingIds = pendingApprovals.map((p) => p.id);
              batchApproveParcels(pendingIds);
            }}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sanction All Verified ({pendingApprovals.length})</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Approval Progression Pipeline Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
          Statutory Multi-Tier Cadastral Governance Timeline
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {[
            { step: '1. AI Generated', count: '18,420', desc: 'Raw polygon extraction', color: 'bg-blue-50 border-blue-200 text-gov-blue' },
            { step: '2. Surveyor Verified', count: '12,430', desc: 'RTK CORS ±2.1cm check', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
            { step: '3. Topology Validated', count: '15,910', desc: 'Zero overlap certified', color: 'bg-amber-50 border-amber-200 text-amber-900' },
            { step: '4. Admin Reviewed', count: '9,920', desc: 'Revenue compliance', color: 'bg-purple-50 border-purple-200 text-purple-900' },
            { step: '5. Gov Sanctioned', count: '7,736', desc: 'Official Gazette Record', color: 'bg-blue-600 text-white font-bold' }
          ].map((s, idx) => (
            <div key={idx} className={`p-2.5 rounded border ${s.color}`}>
              <div className="text-[10px] font-bold font-mono opacity-80 uppercase">{s.step}</div>
              <div className="text-base font-extrabold font-mono mt-0.5">{s.count}</div>
              <div className="text-[10px] opacity-75 mt-0.5 truncate">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Parcel ID (PCL-004821), Khasra No, Owner Name, Ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Approval Statuses</option>
            <option value="Admin Reviewed">Admin Reviewed</option>
            <option value="Topology Validated">Topology Validated</option>
            <option value="Surveyor Verified">Surveyor Verified</option>
            <option value="Government Approved">Government Approved (Gazetted)</option>
            <option value="Correction Requested">Correction Requested</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Split View: Parcels Approval Table & Selected Parcel Review Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedParcelIds.length > 0 && selectedParcelIds.length === filteredParcels.length}
                onChange={toggleSelectAll}
                className="rounded border-slate-300 text-gov-blue focus:ring-0"
              />
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Cadastral Parcel Docket ({filteredParcels.length} items)
              </span>
            </div>

            <span className="text-[10px] text-slate-500 font-mono">
              {approvedParcels.length} Gazetted &bull; {pendingApprovals.length} Awaiting Sanction
            </span>
          </div>

          <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-8"></th>
                  <th className="py-2.5 px-3">Parcel ID & Owner</th>
                  <th className="py-2.5 px-3">Area & Use</th>
                  <th className="py-2.5 px-3">AI & CORS</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Sanction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParcels.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const isChecked = selectedParcelIds.includes(parcel.id);
                  const isApproved = parcel.approvalStatus === 'Government Approved';

                  return (
                    <tr
                      key={parcel.id}
                      onClick={() => selectParcelById(parcel.id)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectParcel(parcel.id)}
                          className="rounded border-slate-300 text-gov-blue focus:ring-0"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-gov-blue">{parcel.id}</div>
                        <div className="text-slate-800 font-semibold">{parcel.ownerName}</div>
                        <div className="text-[10px] text-slate-500">
                          Khasra: {parcel.khasraNo} &bull; {parcel.ward}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">{parcel.areaSqM} m²</div>
                        <div className="text-[10px] text-slate-500">{parcel.landUse}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-emerald-700 font-bold">
                          {parcel.aiConfidence}% AI
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          RTK ±{parcel.gnssData.accuracyCm}cm
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            isApproved
                              ? 'bg-blue-100 text-gov-blue border border-blue-200'
                              : parcel.approvalStatus === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : parcel.approvalStatus === 'Correction Requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {parcel.approvalStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {!isApproved ? (
                          <button
                            onClick={() => approveParcel(parcel.id)}
                            className="px-2.5 py-1 bg-gov-blue hover:bg-gov-navy text-white rounded text-[11px] font-bold transition shadow-xs"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => openCertificate(parcel)}
                            className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-gov-blue border border-slate-300 rounded text-[10px] font-bold flex items-center justify-center gap-1 mx-auto"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Gazette Cert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Parcel Docket Review */}
        <div className="lg:col-span-5 space-y-4">
          {selectedParcel ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue">
                      {selectedParcel.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-mono rounded font-bold">
                      {selectedParcel.propertyId}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gov-navy mt-1">
                    {selectedParcel.ownerName}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    selectedParcel.approvalStatus === 'Government Approved'
                      ? 'bg-blue-100 text-gov-blue'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {selectedParcel.approvalStatus}
                </span>
              </div>

              {/* Map Preview */}
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <CadastralMap height="h-[220px]" showControls={false} />
              </div>

              {/* Legal & Geometric Metrics */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-medium">Khasra Number:</span>
                    <div className="font-mono font-bold text-slate-800">{selectedParcel.khasraNo}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Khata Number:</span>
                    <div className="font-mono font-bold text-slate-800">{selectedParcel.khataNo}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Calculated Area:</span>
                    <div className="font-mono font-bold text-gov-navy">
                      {selectedParcel.areaSqM} m² ({selectedParcel.areaSqFt} sq.ft)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Land-Use Category:</span>
                    <div className="font-bold text-slate-800">{selectedParcel.landUse}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Building Footprint:</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.buildingStatus}</span>
                </div>

                {selectedParcel.fieldRemarks && (
                  <div className="pt-2 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500 font-semibold">Surveyor Remarks:</span>
                    <div className="text-slate-700 italic mt-0.5">{selectedParcel.fieldRemarks}</div>
                  </div>
                )}
              </div>

              {/* Timeline Flow */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Cadastral Verification Audit History
                </h4>
                <div className="space-y-2">
                  {selectedParcel.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-gov-blue mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>{entry.stage}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            {entry.timestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{entry.actor}</div>
                        {entry.notes && (
                          <div className="text-[10px] text-slate-600 italic mt-0.5">
                            "{entry.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                {selectedParcel.approvalStatus !== 'Government Approved' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => approveParcel(selectedParcel.id)}
                      className="flex-1 px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sanction & Approve (Gazette)</span>
                    </button>

                    <button
                      onClick={() => setShowCorrectionModal(true)}
                      className="px-3 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Re-Survey</span>
                    </button>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-3 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 rounded text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openCertificate(selectedParcel)}
                    className="w-full px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View & Download Official Gazette Certificate</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs">
              Select a parcel from the docket to review its statutory timeline.
            </div>
          )}
        </div>
      </div>

      {/* Gazette Certificate Modal */}
      {showCertModal && certParcel && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gov-navy w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Certificate Header */}
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
                    Directorate of Land Records & Urban Cadastral Registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="p-6 space-y-4 text-xs bg-slate-50/50">
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-base font-extrabold text-gov-navy uppercase tracking-wide">
                  OFFICIAL CADASTRAL TITLE & BOUNDARY RECORD
                </h2>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  Certificate No: <strong>{certParcel.certificateNo || 'CAD-MP-JBP-2026-4821'}</strong> &bull; Gazette Sanctioned
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Parcel Identifier:</span>
                  <div className="font-mono font-bold text-gov-navy text-sm">{certParcel.id}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Registered Owner:</span>
                  <div className="font-bold text-slate-900 text-sm">{certParcel.ownerName}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Revenue Khasra / Khata:</span>
                  <div className="font-mono font-bold text-slate-800">
                    {certParcel.khasraNo} / {certParcel.khataNo}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Certified Area:</span>
                  <div className="font-mono font-bold text-emerald-800 text-sm">
                    {certParcel.areaSqM} m² ({certParcel.areaSqFt} sq.ft)
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Sanctioned Land Use:</span>
                  <div className="font-bold text-slate-800">{certParcel.landUse}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Geodetic Datum:</span>
                  <div className="font-mono text-slate-700">{selectedProject.crs}</div>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="p-3 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <QrCode className="w-10 h-10 text-gov-navy" />
                  </div>
                  <div>
                    <div className="font-bold text-gov-navy text-xs">Digitally Sealed by SDM</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                      Hash: 0x8a91b4c3e2f1d9... &bull; RTK CORS Fixed
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-emerald-700 font-bold font-mono">
                    ✓ GAZETTE SANCTIONED
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Date: 26-Sep-2026</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition min-h-[36px]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(certParcel, null, 2)], {
                        type: 'application/json'
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `GAZETTE-CERT-${certParcel.id}.json`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm min-h-[36px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedParcel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-red-700 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase">Reject Cadastral Approval</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Please provide the statutory justification for rejecting parcel{' '}
                <strong className="font-mono text-slate-800">{selectedParcel.id}</strong>:
              </p>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Discrepancy in owner title deed vs registered municipal khasra..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-red-500"
              />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    rejectParcel(selectedParcel.id, rejectReason || 'Administrative objection');
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 bg-red-700 text-white font-bold rounded"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && selectedParcel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase">Request Field Re-Survey</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Specify instructions for field surveyor re-verification on parcel{' '}
                <strong className="font-mono text-slate-800">{selectedParcel.id}</strong>:
              </p>
              <textarea
                rows={3}
                required
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                placeholder="e.g. Verify eastern boundary wall corner benchmark with physical RTK measurement..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    requestCorrection(selectedParcel.id, correctionNotes || 'Re-verification required');
                    setShowCorrectionModal(false);
                    setCorrectionNotes('');
                  }}
                  className="px-4 py-2 bg-amber-600 text-white font-bold rounded"
                >
                  Send to Surveyor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

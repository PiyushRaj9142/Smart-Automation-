import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useCadastre();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    let csv = 'Audit ID,Timestamp,User,Role,Action,Parcel ID,Project ID,Status,Cryptographic Hash,IP Address,Details\n';
    csv += auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.parcelId}","${l.projectId}","${l.status}","${l.hash}","${l.ipAddress}","${l.details}"`
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `AUDIT-TRAIL-${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              Statutory Compliance Ledger
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Database className="w-5 h-5 text-gov-blue" />
            <span>Immutable Cadastral Audit Trail & Mutation Security Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed, tamper-evident record of all AI inferences, surveyor vertex modifications, topology auto-snapping, and SDM approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs font-mono font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>TAMPER-EVIDENT LEDGER: ACTIVE (SHA-256)</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit ID, user, action, parcel ID, cryptographic hash..."
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
            <option value="ALL">All Action Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Approved">Approved</option>
            <option value="Resolved">Resolved</option>
            <option value="Generated">Generated</option>
            <option value="Correction Requested">Correction Requested</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Audit ID & Time</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action & Target Parcel</th>
                <th className="py-3 px-4">Audit Narrative & Payload</th>
                <th className="py-3 px-4">SHA-256 Signature</th>
                <th className="py-3 px-4">Network Node</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-gov-blue text-xs">{log.id}</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{log.timestamp}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-gov-navy text-xs">{log.user}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.role}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 text-xs">{log.action}</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Target: <strong className="text-gov-blue">{log.parcelId}</strong>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-700 leading-snug">{log.details}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {log.hash.substring(0, 12)}...
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono text-slate-500">{log.ipAddress}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        log.status === 'Approved'
                          ? 'bg-blue-100 text-gov-blue border border-blue-200'
                          : log.status === 'Verified' || log.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : log.status === 'Correction Requested'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

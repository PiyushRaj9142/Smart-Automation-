import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  MapPin,
  Sparkles,
  Zap,
  Eye,
  UserCheck,
  Check,
  X,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Layers,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { TopologyErrorType, TopologyIssue } from '../types/cadastre';
import { CadastralMap } from '../components/gis/CadastralMap';

export interface TopologyValidationPageProps {
  onNavigateToGis?: (parcelId?: string) => void;
  onNavigateToMap?: (parcelId?: string) => void;
}

export const TopologyValidationPage: React.FC<TopologyValidationPageProps> = ({
  onNavigateToGis,
  onNavigateToMap
}) => {
  const {
    topologyIssues,
    resolveTopologyIssue,
    assignSurveyorToIssue,
    surveyors,
    selectParcelById,
    selectedProject
  } = useCadastre();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedIssue, setSelectedIssue] = useState<TopologyIssue | null>(topologyIssues[0] || null);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedSurveyor, setSelectedSurveyor] = useState<string>(surveyors[0]?.name || 'Rajesh Sharma');

  const totalGeometries = 18420;
  const totalIssues = topologyIssues.length;
  const resolvedCount = topologyIssues.filter((i) => i.status === 'Resolved').length;
  const openCount = topologyIssues.filter((i) => i.status === 'Open' || i.status === 'In Review').length;
  const overlapsCount = topologyIssues.filter((i) => i.errorType === 'Overlapping parcels').length;
  const gapsCount = topologyIssues.filter((i) => i.errorType === 'Gaps / Slivers').length;
  const selfIntersectionsCount = topologyIssues.filter((i) => i.errorType === 'Self-intersections').length;

  const filteredIssues = topologyIssues.filter((issue) => {
    const matchesSearch =
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || issue.errorType === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleResolve = (issueId: string) => {
    resolveTopologyIssue(issueId, 'Auto-Snapping Algorithm (0.05m tolerance threshold)');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssue) {
      assignSurveyorToIssue(selectedIssue.id, selectedSurveyor);
      setShowAssignModal(false);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase rounded font-mono">
              Geometric Sanity Engine v4.2
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500">
              Project: <strong className="text-slate-800">{selectedProject.name}</strong>
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Automated Cadastral Topology Validation & Geometry Sanitizer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify and resolve multi-parcel overlaps, sliver gaps, self-intersecting boundaries, and duplicate polygon geometries before government legal sanction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Batch auto-resolve all open overlaps
              topologyIssues
                .filter((i) => i.status === 'Open' && i.errorType === 'Overlapping parcels')
                .forEach((i) => handleResolve(i.id));
            }}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Auto-Resolve All Overlaps (Snapping)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Total Geometries</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {totalGeometries.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">100% Vector Scanned</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-emerald-700 font-medium">Valid Polygons</div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            {(totalGeometries - openCount).toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
            {(((totalGeometries - openCount) / totalGeometries) * 100).toFixed(1)}% Clean
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-amber-700 font-medium">Overlaps Detected</div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1">{overlapsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Encroachment Risks</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-blue-700 font-medium">Gaps / Slivers</div>
          <div className="text-xl font-bold font-mono text-blue-800 mt-1">{gapsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Unassigned Pockets</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-purple-700 font-medium">Self-Intersections</div>
          <div className="text-xl font-bold font-mono text-purple-800 mt-1">
            {selfIntersectionsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Non-simple Polygons</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-emerald-700 font-medium">Resolved by System</div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Auto-snapped</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by issue ID (TOP-...), parcel ID (PCL-...), or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Error Types</option>
            <option value="Overlapping parcels">Overlapping parcels</option>
            <option value="Gaps / Slivers">Gaps / Slivers</option>
            <option value="Self-intersections">Self-intersections</option>
            <option value="Duplicate geometries">Duplicate geometries</option>
            <option value="Boundary mismatches">Boundary mismatches</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Split View: Issues Table & Selected Issue Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Issues Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Discrepancy & Anomaly Register ({filteredIssues.length} entries)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Tolerance: 0.05m</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Issue ID & Type</th>
                  <th className="py-2.5 px-3">Target Parcel</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  return (
                    <tr
                      key={issue.id}
                      onClick={() => {
                        setSelectedIssue(issue);
                        selectParcelById(issue.parcelId);
                      }}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-gov-blue">{issue.id}</div>
                        <div className="text-slate-800 font-semibold mt-0.5">{issue.errorType}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[220px]">
                          {issue.description}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{issue.parcelId}</span>
                        {issue.secondaryParcelId && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Overlap with: {issue.secondaryParcelId}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold font-mono uppercase ${
                            issue.severity === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : issue.severity === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-gov-blue'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold font-mono uppercase ${
                            issue.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : issue.status === 'In Review'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {issue.status}
                        </span>
                        {issue.assignedSurveyor && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Assigned: {issue.assignedSurveyor}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {issue.status !== 'Resolved' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(issue.id);
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition shadow-xs"
                            title="Auto-snap geometry & resolve"
                          >
                            Auto-Resolve
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold font-mono flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Issue Deep Dive & Map Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {selectedIssue ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded uppercase">
                    {selectedIssue.id} &bull; {selectedIssue.severity}
                  </span>
                  <h3 className="text-sm font-bold text-gov-navy mt-1">
                    {selectedIssue.errorType}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    selectedIssue.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {selectedIssue.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Primary Parcel ID:</span>
                    <span className="font-mono font-bold text-gov-navy">{selectedIssue.parcelId}</span>
                  </div>
                  {selectedIssue.secondaryParcelId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Adjacent Parcel ID:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {selectedIssue.secondaryParcelId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Centroid Coordinates:</span>
                    <span className="font-mono text-slate-700">
                      {selectedIssue.location[0].toFixed(5)}°N, {selectedIssue.location[1].toFixed(5)}°E
                    </span>
                  </div>
                  {selectedIssue.areaM2 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Discrepancy Area:</span>
                      <span className="font-mono font-bold text-red-600">
                        {selectedIssue.areaM2} m²
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Anomaly Description
                  </label>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                    {selectedIssue.description}
                  </p>
                </div>

                {selectedIssue.resolutionMethod && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Resolution Applied:</span>
                    </div>
                    <div className="text-[11px] mt-0.5">{selectedIssue.resolutionMethod}</div>
                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                      Resolved: {selectedIssue.resolvedDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Map Viewport Crop */}
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <CadastralMap height="h-[240px]" showControls={false} />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
                {selectedIssue.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolve(selectedIssue.id)}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auto-Snap Resolve (0.05m)</span>
                  </button>
                )}

                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4 text-gov-blue" />
                  <span>Assign Surveyor</span>
                </button>

                {onNavigateToGis && (
                  <button
                    onClick={() => onNavigateToGis(selectedIssue.parcelId)}
                    className="p-2 bg-blue-50 text-gov-blue hover:bg-blue-100 rounded text-xs transition"
                    title="Open Full Map"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs">
              Select an issue from the table to view details and inspect on map.
            </div>
          )}
        </div>
      </div>

      {/* Assign Surveyor Modal */}
      {showAssignModal && selectedIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Assign Field Surveyor to Anomaly
                </h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Issue Target:</span>
                <div className="font-bold font-mono text-gov-navy text-sm mt-0.5">
                  {selectedIssue.id} ({selectedIssue.parcelId})
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Field Surveyor & Team *
                </label>
                <select
                  value={selectedSurveyor}
                  onChange={(e) => setSelectedSurveyor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:border-gov-blue"
                >
                  {surveyors.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.officialId}) - Zone: {s.assignedZone} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold transition shadow-sm"
                >
                  Assign & Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Sparkles,
  FileCheck,
  X
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { CadastralProject, ProjectStatus } from '../types/cadastre';

interface ProjectsPageProps {
  onNavigateToGis?: (projectId: string) => void;
  onNavigateToDatasets?: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigateToGis,
  onNavigateToDatasets
}) => {
  const {
    projects,
    selectedProject,
    setSelectedProjectId,
    createProject
  } = useCadastre();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: '',
    city: '',
    district: '',
    state: 'Madhya Pradesh',
    surveyAreaSqKm: 25.0,
    surveyDate: new Date().toISOString().split('T')[0],
    authority: 'Directorate of Land Records & Settlement',
    surveyorTeam: 'Team Garuda Alpha (12 Surveyors)',
    status: 'Planning' as ProjectStatus
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.city) return;

    createProject(newProject);
    setShowCreateModal(false);
    setNewProject({
      name: '',
      city: '',
      district: '',
      state: 'Madhya Pradesh',
      surveyAreaSqKm: 25.0,
      surveyDate: new Date().toISOString().split('T')[0],
      authority: 'Directorate of Land Records & Settlement',
      surveyorTeam: 'Team Garuda Alpha (12 Surveyors)',
      status: 'Planning'
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Field Verification':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Topology Validation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'AI Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Data Uploaded':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2">
            <Compass className="w-5 h-5 text-gov-blue" />
            <span>Cadastral Survey Project Management Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Municipal cadastral boundaries, drone flight missions, and multi-zone urban land record initiatives.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Survey Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, city, district, project ID..."
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
            <option value="ALL">All Project Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Data Uploaded">Data Uploaded</option>
            <option value="AI Processing">AI Processing</option>
            <option value="AI Completed">AI Completed</option>
            <option value="Field Verification">Field Verification</option>
            <option value="Topology Validation">Topology Validation</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Project ID & Name</th>
                <th className="py-3 px-4">Jurisdiction & Authority</th>
                <th className="py-3 px-4">Survey Area & Date</th>
                <th className="py-3 px-4">Surveyor Team</th>
                <th className="py-3 px-4">Status & Progress</th>
                <th className="py-3 px-4 text-right">Parcels & Metrics</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => {
                const isSelected = p.id === selectedProject.id;
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isSelected ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    {/* ID & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gov-blue text-xs">{p.id}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 bg-gov-blue text-white rounded text-[9px] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gov-navy text-xs mt-0.5">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.crs}</div>
                    </td>

                    {/* Jurisdiction */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">
                        {p.city}, {p.district}
                      </div>
                      <div className="text-slate-500 text-[11px]">{p.state}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {p.authority}
                      </div>
                    </td>

                    {/* Survey Area & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-bold">{p.surveyAreaSqKm} km²</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{p.surveyDate}</span>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium">{p.surveyorTeam}</div>
                      <div className="text-[10px] text-emerald-700 font-mono">RTK CORS Active</div>
                    </td>

                    {/* Status & Progress */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase font-mono ${getStatusBadge(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gov-blue h-full"
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-600">
                          {p.progressPercent}%
                        </span>
                      </div>
                    </td>

                    {/* Parcels */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {p.totalParcels.toLocaleString()} Parcels
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        <span className="text-emerald-700 font-semibold">{p.approvedParcels} Approved</span> &bull;{' '}
                        <span className="text-amber-700 font-semibold">{p.topologyErrors} Errors</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedProjectId(p.id)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-semibold transition"
                          title="Select as active survey project"
                        >
                          Select
                        </button>
                        {onNavigateToGis && (
                          <button
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              onNavigateToGis(p.id);
                            }}
                            className="p-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs transition"
                            title="Open in Web-GIS"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Create New Urban Cadastral Survey Project
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ujjain Smart City Urban Cadastre Mapping"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ujjain"
                    value={newProject.city}
                    onChange={(e) => setNewProject({ ...newProject, city: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Ujjain"
                    value={newProject.district}
                    onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newProject.state}
                    onChange={(e) => setNewProject({ ...newProject, state: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Survey Area (sq.km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProject.surveyAreaSqKm}
                    onChange={(e) =>
                      setNewProject({ ...newProject, surveyAreaSqKm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Survey Date</label>
                  <input
                    type="date"
                    value={newProject.surveyDate}
                    onChange={(e) => setNewProject({ ...newProject, surveyDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({ ...newProject, status: e.target.value as ProjectStatus })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Data Uploaded">Data Uploaded</option>
                    <option value="AI Processing">AI Processing</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Sponsoring Authority</label>
                  <input
                    type="text"
                    value={newProject.authority}
                    onChange={(e) => setNewProject({ ...newProject, authority: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Assigned Surveyor Team</label>
                  <input
                    type="text"
                    value={newProject.surveyorTeam}
                    onChange={(e) => setNewProject({ ...newProject, surveyorTeam: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold transition shadow-sm"
                >
                  Create & Initialize Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

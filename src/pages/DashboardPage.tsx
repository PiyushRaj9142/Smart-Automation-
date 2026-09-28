import React from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  ChevronRight,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  BarChart3,
  MapPin,
  Landmark,
  Eye,
  Database,
  Users
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useCadastre } from '../context/CadastreContext';
import { useOfflineSync } from '../context/OfflineSyncContext';
import { KpiCard } from '../components/common/KpiCard';
import { CadastralMap } from '../components/gis/CadastralMap';

interface DashboardPageProps {
  onNavigate: (moduleId: string) => void;
  onCreateProject?: () => void;
}

const LAND_USE_PIE_DATA = [
  { name: 'Residential', value: 9840, color: '#3B82F6' },
  { name: 'Commercial', value: 3420, color: '#EC4899' },
  { name: 'Institutional', value: 1650, color: '#8B5CF6' },
  { name: 'Industrial', value: 1120, color: '#64748B' },
  { name: 'Public & Green', value: 1480, color: '#10B981' },
  { name: 'Agricultural', value: 910, color: '#84CC16' }
];

const ZONE_PROGRESS_DATA = [
  { zone: 'Zone A (Civil Lines)', total: 4200, ai: 4200, field: 3950, approved: 3400 },
  { zone: 'Zone B (Wright Town)', total: 3800, ai: 3800, field: 3100, approved: 2200 },
  { zone: 'Zone C (Napier Town)', total: 4500, ai: 4100, field: 2800, approved: 1250 },
  { zone: 'Zone D (Gorakhpur)', total: 3100, ai: 2600, field: 1600, approved: 600 },
  { zone: 'Zone E (Garha Central)', total: 2820, ai: 1160, field: 980, approved: 286 }
];

const TOPOLOGY_ISSUE_DATA = [
  { type: 'Overlaps', count: 142, color: '#EF4444' },
  { type: 'Gaps / Slivers', count: 98, color: '#F59E0B' },
  { type: 'Self-Intersections', count: 44, color: '#8B5CF6' },
  { type: 'Duplicate Polygons', count: 42, color: '#3B82F6' }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onCreateProject }) => {
  const {
    kpis,
    projects,
    selectedProject,
    setSelectedProjectId,
    topologyIssues,
    parcels,
    runAIPipeline,
    isPipelineRunning
  } = useCadastre();

  const { surveyorsFieldStatus } = useOfflineSync();

  const openTopologyIssues = topologyIssues.filter((i) => i.status === 'Open' || i.status === 'In Review').length;

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* 1. Official Government Header & Project Selector Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue font-bold text-[11px] rounded tracking-wide uppercase font-mono">
              Urban Cadastral Governance Engine
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-600 font-medium">
              Authority: <strong className="text-slate-800">{selectedProject.authority}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gov-navy tracking-tight mt-1">
            {selectedProject.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geodetic Datum: <strong>{selectedProject.crs}</strong> &bull; Total Area:{' '}
            <strong>{selectedProject.surveyAreaSqKm} sq.km</strong> &bull; Surveyor Team:{' '}
            <strong>{selectedProject.surveyorTeam}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
            <span className="text-xs text-slate-600 font-medium">Active Survey:</span>
            <select
              value={selectedProject.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-xs font-bold text-gov-navy focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.city} - {p.name} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigate('drone-datasets')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-gov-blue" />
            <span>Upload Datasets</span>
          </button>

          <button
            onClick={() => {
              if (onCreateProject) onCreateProject();
              else onNavigate('projects');
            }}
            className="px-3.5 py-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Survey Project</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (6 Major Cadastral KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="Total Survey Projects"
          value={kpis.totalProjects}
          icon={Compass}
          trend="+3 New"
          trendType="neutral"
          lastUpdated="Current fiscal"
          onClick={() => onNavigate('projects')}
        />
        <KpiCard
          label="Parcels Extracted"
          value={kpis.totalParcelsExtracted.toLocaleString()}
          icon={Layers}
          trend="100% Extracted"
          trendType="positive"
          lastUpdated="AI Pipeline Complete"
          onClick={() => onNavigate('ai-processing')}
        />
        <KpiCard
          label="AI Verified Parcels"
          value={kpis.aiVerifiedParcels.toLocaleString()}
          icon={Sparkles}
          trend="86.1% High Conf."
          trendType="positive"
          lastUpdated="DeepLabV3+ Swin"
          onClick={() => onNavigate('ai-processing')}
        />
        <KpiCard
          label="Field Verified (CORS)"
          value={kpis.fieldVerifiedParcels.toLocaleString()}
          icon={CheckCircle2}
          trend="67.5% Complete"
          trendType="positive"
          lastUpdated="RTK ±2.1cm"
          onClick={() => onNavigate('surveyors')}
        />
        <KpiCard
          label="Geometry / Topology Issues"
          value={kpis.topologyErrors}
          icon={AlertTriangle}
          trend={openTopologyIssues > 0 ? `${openTopologyIssues} Need Review` : 'Clean'}
          trendType="emergency"
          lastUpdated="Auto-detection"
          onClick={() => onNavigate('topology')}
        />
        <KpiCard
          label="Pending Sanctions"
          value={kpis.pendingApprovals.toLocaleString()}
          icon={Clock}
          trend="Awaiting Gazette"
          trendType="negative"
          lastUpdated="SDM Desk"
          onClick={() => onNavigate('approvals')}
        />
      </div>

      {/* 3. VISUAL WORKFLOW PIPELINE COMPONENT (HIGHLIGHT DEMO FEATURE) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider">
                Cadastral Governance & Verification Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time progression from raw drone orthomosaic to legally sanctioned official cadastral record.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAIPipeline}
              disabled={isPipelineRunning}
              className="px-3 py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-gov-blue rounded text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{isPipelineRunning ? 'AI Segmenting...' : 'Simulate Live AI Extraction'}</span>
            </button>
            <button
              onClick={() => onNavigate('approvals')}
              className="px-3 py-1 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1 transition shadow-sm"
            >
              <span>Sanction Approvals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live 5-Stage Stepper Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Stage 1 */}
          <div
            onClick={() => onNavigate('ai-processing')}
            className="p-3.5 rounded-lg border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-200 text-gov-blue rounded">
                STAGE 01
              </span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100%
              </span>
            </div>
            <div className="text-xs font-bold text-gov-navy group-hover:text-gov-blue transition mt-2 uppercase tracking-wide">
              AI Generated
            </div>
            <div className="text-xl font-extrabold text-gov-navy font-mono mt-0.5">
              18,420
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Drone ORI polygon segmentation
            </div>
            <div className="w-full bg-blue-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-gov-blue h-full w-full" />
            </div>
          </div>

          {/* Stage 2 */}
          <div
            onClick={() => onNavigate('surveyors')}
            className="p-3.5 rounded-lg border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded">
                STAGE 02
              </span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 67.5%
              </span>
            </div>
            <div className="text-xs font-bold text-gov-navy group-hover:text-emerald-700 transition mt-2 uppercase tracking-wide">
              Field Verified
            </div>
            <div className="text-xl font-extrabold text-emerald-900 font-mono mt-0.5">
              12,430
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              RTK-CORS ±2.1cm ground truth
            </div>
            <div className="w-full bg-emerald-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[67.5%]" />
            </div>
          </div>

          {/* Stage 3 */}
          <div
            onClick={() => onNavigate('topology')}
            className="p-3.5 rounded-lg border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                STAGE 03
              </span>
              <span className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> 326 Flagged
              </span>
            </div>
            <div className="text-xs font-bold text-gov-navy group-hover:text-amber-800 transition mt-2 uppercase tracking-wide">
              Topology Validated
            </div>
            <div className="text-xl font-extrabold text-amber-950 font-mono mt-0.5">
              15,910 <span className="text-xs font-normal text-slate-500">Valid</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Gap & overlap auto-detection
            </div>
            <div className="w-full bg-amber-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full w-[86.4%]" />
            </div>
          </div>

          {/* Stage 4 */}
          <div
            onClick={() => onNavigate('approvals')}
            className="p-3.5 rounded-lg border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-purple-200 text-purple-900 rounded">
                STAGE 04
              </span>
              <span className="text-[10px] text-purple-800 font-bold">53.8%</span>
            </div>
            <div className="text-xs font-bold text-gov-navy group-hover:text-purple-800 transition mt-2 uppercase tracking-wide">
              Admin Reviewed
            </div>
            <div className="text-xl font-extrabold text-purple-950 font-mono mt-0.5">
              9,920
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Revenue officer compliance check
            </div>
            <div className="w-full bg-purple-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-600 h-full w-[53.8%]" />
            </div>
          </div>

          {/* Stage 5 */}
          <div
            onClick={() => onNavigate('approvals')}
            className="p-3.5 rounded-lg border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-600 text-white rounded">
                FINAL RECORD
              </span>
              <span className="text-[10px] text-blue-900 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-700" /> Sanctioned
              </span>
            </div>
            <div className="text-xs font-bold text-gov-navy group-hover:text-gov-blue transition mt-2 uppercase tracking-wide">
              Government Approved
            </div>
            <div className="text-xl font-extrabold text-gov-navy font-mono mt-0.5">
              7,736
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Official Gazette Certificate Issued
            </div>
            <div className="w-full bg-blue-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-700 h-full w-[42%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Operational Survey Impact & Cadastral Metrics */}
      <div className="bg-white text-slate-800 rounded-xl p-5 border border-slate-200 shadow-gov">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-blue" />
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-mono">
                Cadastral Survey Performance Benchmarks
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative efficiency gains achieved by integrating automated parcel extraction with CORS RTK field verification.
            </p>
          </div>

          <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 font-mono">
            Survey Directorate Standard Compliance
          </div>
        </div>

        {/* 5 Key Impact Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Turnaround Time Reduced</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">78% Faster</div>
            <div className="text-[10px] text-slate-500 mt-0.5">vs. manual ground theodolite</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Processing Speedup</div>
            <div className="text-xl font-bold text-gov-blue font-mono mt-1">8.4x</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Faster parcel vectorization</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Parcels Processed</div>
            <div className="text-xl font-bold text-gov-navy font-mono mt-1">18,420</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across 42.5 km² survey zone</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Boundary Confidence</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">94.8%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Mean Intersection over Union</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-500 font-medium">Topology Integrity Scan</div>
            <div className="text-xl font-bold text-amber-700 font-mono mt-1">326 In Review</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% Geometry auto-check</div>
          </div>
        </div>
      </div>

      {/* 5. Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Zone Progress Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Cadastral Survey Progress by Municipal Zone
              </h3>
              <p className="text-[11px] text-slate-500">
                Parcels extracted, field verified with CORS, and government sanctioned.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-gov-blue hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="total" fill="#94A3B8" name="Total Extracted" radius={[2, 2, 0, 0]} />
                <Bar dataKey="field" fill="#10B981" name="Field Verified (CORS)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="approved" fill="#1D4ED8" name="Sanctioned (Gazette)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Land Use Distribution Pie */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                AI Land-Use Classification Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">18,420 parcels classified via deep learning</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-gov-blue font-bold rounded font-mono">
              95.6% CONFIDENCE
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LAND_USE_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {LAND_USE_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Parcels`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} layout="horizontal" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. Mini Web-GIS Map Preview & Topology Discrepancy Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Mini Live GIS Viewport */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gov-blue" />
                <span>Live Web-GIS Cadastral Viewport (Jabalpur Zone A)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Interactive parcel boundaries, building footprints, and CORS ground truth overlay.
              </p>
            </div>

            <button
              onClick={() => onNavigate('gis-map')}
              className="px-2.5 py-1 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-semibold flex items-center gap-1 transition"
            >
              <span>Full Screen GIS</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-200">
            <CadastralMap height="h-[360px]" showControls={true} />
          </div>
        </div>

        {/* Right: Active Topology Errors & Recent Activity */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Critical Geometry & Topology Inconsistencies</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {openTopologyIssues} geometry anomalies requiring revenue review
                </p>
              </div>

              <button
                onClick={() => onNavigate('topology')}
                className="text-xs text-gov-blue hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 mt-3">
              {topologyIssues.slice(0, 4).map((issue) => (
                <div
                  key={issue.id}
                  className="p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-white hover:border-gov-blue transition flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gov-navy">{issue.id}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase font-mono ${
                          issue.severity === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : issue.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-gov-blue'
                        }`}
                      >
                        {issue.errorType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Parcel: <strong className="text-slate-800 font-mono">{issue.parcelId}</strong> &bull;{' '}
                      {issue.description}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('topology')}
                    className="p-1.5 bg-white hover:bg-blue-50 text-gov-blue border border-slate-200 rounded text-xs transition"
                    title="Inspect on Map"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gov-blue flex-shrink-0" />
              <div className="text-[11px] text-gov-navy">
                <strong>Tamper-Evident Audit Ledger:</strong> 100% of surveyor edits cryptographically hashed.
              </div>
            </div>
            <button
              onClick={() => onNavigate('audit-log')}
              className="text-xs text-gov-blue font-bold hover:underline whitespace-nowrap ml-2"
            >
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* 7. Surveyor Field Sync & Operational Monitoring (Admin Visibility) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono">
                SURVEYOR FIELD STATUS
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">Real-Time Ground Sync Telemetry</span>
            </div>
            <h3 className="text-base font-extrabold text-gov-navy mt-1">
              Field Surveyor Synchronization & Operations Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live monitoring of surveyor field terminals, offline cache status, pending sync queues, and RTK GNSS fixes across all urban survey zones.
            </p>
          </div>

          <button
            onClick={() => onNavigate('surveyors')}
            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Users className="w-3.5 h-3.5 text-gov-blue" />
            <span>Manage Field Team</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Surveyor Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Surveyor Name</th>
                <th className="py-2.5 px-3">Zone / Sector</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Pending Sync</th>
                <th className="py-2.5 px-3">Last Sync Time</th>
                <th className="py-2.5 px-3">Assigned / Verified</th>
                <th className="py-2.5 px-3">GNSS Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {surveyorsFieldStatus.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.officialId}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{s.zone}</td>
                  <td className="py-3 px-3">
                    {s.status === 'Online' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        🟢 Online
                      </span>
                    )}
                    {s.status === 'Offline' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                        🔴 Offline
                      </span>
                    )}
                    {s.status === 'Syncing' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-spin" />
                        🟠 Syncing
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono font-bold text-xs ${
                        s.pendingSyncCount > 0 ? 'text-purple-700 font-extrabold' : 'text-slate-400'
                      }`}
                    >
                      {s.pendingSyncCount} records
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{s.lastSync}</td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-xs font-bold text-slate-900">
                      {s.verifiedParcelsCount} / {s.assignedParcelsCount}
                    </div>
                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${Math.round((s.verifiedParcelsCount / s.assignedParcelsCount) * 100)}%`
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    <span className="text-emerald-700 font-semibold">{s.gnssAccuracy}</span>
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

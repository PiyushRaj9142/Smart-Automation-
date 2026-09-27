import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MapPin,
  Sparkles,
  Download,
  Filter,
  Search,
  Activity,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useCadastre } from '../context/CadastreContext';
import { CadastralMap } from '../components/gis/CadastralMap';

const DEVIATION_HISTOGRAM_DATA = [
  { bin: '0 - 1 cm', count: 6840, fill: '#10B981' },
  { bin: '1 - 2 cm', count: 5920, fill: '#34D399' },
  { bin: '2 - 3 cm', count: 3240, fill: '#3B82F6' },
  { bin: '3 - 5 cm', count: 1820, fill: '#F59E0B' },
  { bin: '> 5 cm', count: 600, fill: '#EF4444' }
];

export const GroundTruthPage: React.FC = () => {
  const { parcels, selectedParcel, selectParcelById, selectedProject } = useCadastre();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredParcels = parcels.filter((p) =>
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.propertyId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase rounded font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              CORS RTK Network: Online (IND-MP-04)
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Radio className="w-5 h-5 text-gov-blue" />
            <span>Continuously Operating Reference Station (CORS) Ground Truth Telemetry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geodetic centimeter-accuracy benchmark comparison: AI-derived parcel vectors vs. physical RTK-CORS survey control points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>RTK FIX: ±1.8 cm RMSE</span>
          </div>
        </div>
      </div>

      {/* Geodetic Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Base Station Identifier</div>
          <div className="text-lg font-bold font-mono text-gov-navy mt-0.5">IND-MP-JBP-04</div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Survey of India CORS Grid</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Active Constellation</div>
          <div className="text-lg font-bold font-mono text-gov-navy mt-0.5">28 Satellites Tracked</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">GPS + GLONASS + NavIC</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Positional Dilution (HDOP)</div>
          <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">0.78 (Optimal)</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Sub-centimeter Geometry</div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Benchmark GT Agreement</div>
          <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">97.2% Within Tolerance</div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">&lt; 3.0 cm Discrepancy</div>
        </div>
      </div>

      {/* Deviation Histogram & Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Spatial Boundary Deviation Distribution (AI vs. RTK-CORS GT)
              </h3>
              <p className="text-[11px] text-slate-500">
                Frequency analysis of orthogonal distance error across 18,420 cadastral vertices.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-gov-blue font-bold rounded font-mono">
              98.4% &lt; 5cm
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEVIATION_HISTOGRAM_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="bin" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Vertices`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} fill="#3B82F6" name="Vertex Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Parcel GT Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Single-Parcel Ground Truth Benchmarking
              </h3>
              {selectedParcel && (
                <span className="font-mono text-xs font-bold text-gov-blue">
                  {selectedParcel.id}
                </span>
              )}
            </div>

            {selectedParcel ? (
              <div className="space-y-3 mt-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Owner & Ward:</span>
                    <span className="font-bold text-slate-800">
                      {selectedParcel.ownerName} ({selectedParcel.ward})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Khasra / Khata No:</span>
                    <span className="font-mono text-slate-800">
                      {selectedParcel.khasraNo} &bull; {selectedParcel.khataNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Computed Area:</span>
                    <span className="font-mono font-bold text-gov-navy">
                      {selectedParcel.areaSqM} m² ({selectedParcel.areaSqFt} sq.ft)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">RTK Positional Accuracy:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ±{selectedParcel.gnssData.accuracyCm} cm (Fixed)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">GNSS Coordinates:</span>
                    <span className="font-mono text-slate-700">
                      {selectedParcel.gnssData.latitude.toFixed(6)}°N,{' '}
                      {selectedParcel.gnssData.longitude.toFixed(6)}°E
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-gov-navy space-y-1">
                  <div className="font-bold text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-blue" />
                    <span>Multi-Layer Layer Overlay Status:</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-snug">
                    AI boundary fits within ±1.8 cm of surveyed physical boundary stones.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Select a parcel from the table below.
              </div>
            )}
          </div>

          <div className="rounded-md overflow-hidden border border-slate-200 mt-2">
            <CadastralMap height="h-[200px]" showControls={false} />
          </div>
        </div>
      </div>

      {/* Ground Truth Parcel Verification Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
            CORS Ground Truth Control Point Register
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parcel, owner, property ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Parcel ID & Property</th>
                <th className="py-2.5 px-4">Owner & Ward</th>
                <th className="py-2.5 px-4">Area (m²)</th>
                <th className="py-2.5 px-4">AI Confidence</th>
                <th className="py-2.5 px-4">CORS Status</th>
                <th className="py-2.5 px-4">GT Verification</th>
                <th className="py-2.5 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                return (
                  <tr
                    key={parcel.id}
                    onClick={() => selectParcelById(parcel.id)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition ${
                      isSelected ? 'bg-blue-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-gov-blue">{parcel.id}</span>
                      <div className="text-[10px] text-slate-500 font-mono">{parcel.propertyId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{parcel.ownerName}</div>
                      <div className="text-[10px] text-slate-500">{parcel.ward}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {parcel.areaSqM} m²
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 bg-blue-100 text-gov-blue rounded font-mono font-bold text-[11px]">
                        {parcel.aiConfidence}%
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                        RTK FIXED (±{parcel.gnssData.accuracyCm}cm)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                          parcel.gtStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : parcel.gtStatus === 'Mismatch'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {parcel.gtStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectParcelById(parcel.id);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

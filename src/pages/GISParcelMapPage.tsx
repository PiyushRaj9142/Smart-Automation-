import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Search,
  Filter,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  Sparkles,
  Compass,
  ArrowUpRight,
  Download,
  Info
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { CadastralMap } from '../components/gis/CadastralMap';
import { CadastralParcel } from '../types/cadastre';

export const GISParcelMapPage: React.FC = () => {
  const {
    parcels,
    selectedParcel,
    setSelectedParcel,
    selectParcelById,
    selectedProject,
    approveParcel
  } = useCadastre();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLandUse, setSelectedLandUse] = useState<string>('ALL');

  const handleParcelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = parcels.find(
      (p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.propertyId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedParcel(found);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1800px] mx-auto space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              Web-GIS Cadastral Viewport (OGC WFS/WMS Compatible)
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">
              CRS: <strong className="text-slate-800 font-mono">{selectedProject.crs}</strong>
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide mt-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gov-blue" />
            <span>Interactive Multi-Layer Urban Cadastre & Orthophoto Map</span>
          </h1>
        </div>

        {/* Quick Search in Map */}
        <form onSubmit={handleParcelSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Jump to Parcel (e.g. PCL-004821)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue font-mono w-64 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold transition shadow-xs"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Main Full-Scale Map */}
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md">
        <CadastralMap height="h-[750px]" showControls={true} />
      </div>
    </div>
  );
};

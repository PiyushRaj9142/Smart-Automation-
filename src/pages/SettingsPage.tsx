import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  RotateCcw,
  MapPin,
  HardDrive,
  Radio,
  Lock,
  Clock,
  Server,
  Save,
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

export const SettingsPage: React.FC = () => {
  const { selectedProject } = useCadastre();

  const [gisTileServer, setGisTileServer] = useState<string>('arcgis');
  const [crsProjection, setCrsProjection] = useState<string>('EPSG:32644 (WGS 84 / UTM Zone 44N)');
  const [corsCasterIp, setCorsCasterIp] = useState<string>('ntrip.surveyofindia.gov.in:2101');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState<number>(0.85);
  const [topologySnapTolerance, setTopologySnapTolerance] = useState<number>(0.05);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-4xl mx-auto text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              System Parameters
            </span>
          </div>
          <h1 className="text-base font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Settings className="w-5 h-5 text-gov-blue" />
            <span>Cadastral Governance Platform Configuration & Geodetic Parameters</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate Reference Systems (CRS), deep-learning inference tolerances, CORS RTK caster endpoints, and topology rules.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters committed to runtime store.</span>
        </div>
      )}

      {/* 1. GIS & Coordinate Reference System */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
          <MapPin className="w-4 h-4 text-gov-blue" />
          <span>1. Geodetic Datum & Coordinate Reference System (CRS)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Primary Basemap Tile Engine</label>
            <select
              value={gisTileServer}
              onChange={(e) => setGisTileServer(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none"
            >
              <option value="arcgis">ArcGIS World Imagery (High-Res Drone & Satellite)</option>
              <option value="carto">CartoDB Voyager (Clean Public Sector Light)</option>
              <option value="opentopo">OpenTopoMap (Topographic Contour Elevation)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Active Projected CRS</label>
            <input
              type="text"
              value={crsProjection}
              onChange={(e) => setCrsProjection(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800 font-semibold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. AI Inference Engine & Topology Parameters */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
          <Cpu className="w-4 h-4 text-purple-700" />
          <span>2. Deep Learning Segmentation & Topology Snapping Rules</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between font-bold text-slate-700 uppercase mb-1">
              <span>AI Parcel Confidence Threshold</span>
              <span className="font-mono text-purple-700">{aiConfidenceThreshold}</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.99"
              step="0.01"
              value={aiConfidenceThreshold}
              onChange={(e) => setAiConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 uppercase mb-1">
              <span>Topology Auto-Snap Tolerance (Meters)</span>
              <span className="font-mono text-purple-700">{topologySnapTolerance} m</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.20"
              step="0.01"
              value={topologySnapTolerance}
              onChange={(e) => setTopologySnapTolerance(parseFloat(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. CORS RTK Base Station Network Endpoints */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
          <Radio className="w-4 h-4 text-emerald-700" />
          <span>3. CORS RTK Base Station Network & NTRIP Caster</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">NTRIP Caster Host & Port</label>
            <input
              type="text"
              value={corsCasterIp}
              onChange={(e) => setCorsCasterIp(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Mountpoint Protocol</label>
            <input
              type="text"
              value="RTCM_3.3_VRS_IND_MP"
              disabled
              className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

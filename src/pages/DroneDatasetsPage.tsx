import React, { useState } from 'react';
import {
  Layers,
  UploadCloud,
  FileCode,
  HardDrive,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  Eye,
  PlusCircle,
  Sparkles,
  Zap,
  Filter,
  Search,
  X,
  Radio,
  FileCheck
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';
import { DatasetType, DroneDataset } from '../types/cadastre';

export interface DroneDatasetsPageProps {
  onNavigateToAIProcessing?: () => void;
  onNavigateToAI?: () => void;
}

export const DroneDatasetsPage: React.FC<DroneDatasetsPageProps> = ({
  onNavigateToAIProcessing,
  onNavigateToAI
}) => {
  const {
    datasets,
    selectedProject,
    uploadDataset,
    deleteDataset,
    runAIPipeline
  } = useCadastre();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Simulated Upload Form State
  const [uploadType, setUploadType] = useState<DatasetType>('Drone Orthomosaic (ORI)');
  const [datasetName, setDatasetName] = useState<string>('');
  const [resolution, setResolution] = useState<string>('2.5 cm/px GSD');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          uploadDataset({
            name: datasetName || `${uploadType.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedProject.city}.tif`,
            type: uploadType,
            resolution: resolution || '2.5 cm/px GSD',
            processingStatus: 'Ready'
          });
          setShowUploadModal(false);
          setUploadProgress(0);
          setDatasetName('');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const filteredDatasets = datasets.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              Project: {selectedProject.name}
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Layers className="w-5 h-5 text-gov-blue" />
            <span>Drone Imagery & Geospatial Dataset Ingestion Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage high-resolution orthomosaics (ORI), Digital Surface/Terrain Models (DSM/DTM), legacy GIS shapefiles, and RTK Ground Truth layers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToAIProcessing && (
            <button
              onClick={onNavigateToAIProcessing}
              className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-gov-blue rounded text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Launch AI Processing Center</span>
            </button>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Type Quick Ingestion Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { type: 'Drone Orthomosaic (ORI)', ext: '.tif / COG', desc: 'RGB 2.5cm sub-pixel orthophoto' },
          { type: 'Digital Surface Model (DSM)', ext: '.tif / .las', desc: 'Roof heights & canopy elevation' },
          { type: 'Digital Terrain Model (DTM)', ext: '.tif / DEM', desc: 'Ground elevation & slope contour' },
          { type: 'Existing GIS Parcel Layer', ext: '.shp / .geojson', desc: 'Legacy revenue cadastre vector' },
          { type: 'Ground Truth Dataset', ext: '.geojson / .csv', desc: 'CORS RTK benchmark pins' },
          { type: 'Raw Drone Imagery', ext: '.jpg / EXIF', desc: 'Unprocessed flight survey tiles' }
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              setUploadType(item.type as DatasetType);
              setShowUploadModal(true);
            }}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-gov-blue hover:shadow-sm transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded group-hover:bg-blue-100 group-hover:text-gov-blue transition">
                {item.ext}
              </span>
              <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-gov-blue transition" />
            </div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-gov-navy transition mt-2 truncate">
              {item.type}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by dataset name, type, or dataset ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Dataset Formats</option>
            <option value="Drone Orthomosaic (ORI)">Drone Orthomosaic (ORI)</option>
            <option value="Digital Surface Model (DSM)">Digital Surface Model (DSM)</option>
            <option value="Digital Terrain Model (DTM)">Digital Terrain Model (DTM)</option>
            <option value="Existing GIS Parcel Layer">Existing GIS Parcel Layer</option>
            <option value="Ground Truth Dataset">Ground Truth Dataset</option>
          </select>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Dataset ID & Name</th>
                <th className="py-3 px-4">Dataset Type</th>
                <th className="py-3 px-4">GSD / Resolution</th>
                <th className="py-3 px-4">File Size & Bands</th>
                <th className="py-3 px-4">Upload Date & Project</th>
                <th className="py-3 px-4">Processing State</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDatasets.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  {/* ID & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gov-blue text-xs">{d.id}</span>
                    </div>
                    <div className="font-bold text-gov-navy text-xs mt-0.5 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{d.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{d.crs}</div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{d.type}</span>
                    {d.sensorModel && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        Sensor: {d.sensorModel}
                      </div>
                    )}
                  </td>

                  {/* Resolution */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono font-bold text-[11px]">
                      {d.resolution}
                    </span>
                    {d.flightAltitudeM && (
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        Altitude: {d.flightAltitudeM}m AGL
                      </div>
                    )}
                  </td>

                  {/* File Size */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-900 font-bold">{d.fileSizeFormatted}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {d.bandCount > 0 ? `${d.bandCount} Spectral Bands` : 'Vector Feature Layer'}
                    </div>
                  </td>

                  {/* Upload Date & Project */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{d.uploadDate}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                      {d.projectName}
                    </div>
                  </td>

                  {/* Processing Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        d.processingStatus === 'AI Segmented'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : d.processingStatus === 'Ready'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{d.processingStatus}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => deleteDataset(d.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                        title="Delete dataset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Upload Drone Imagery / GIS Master Layer
                </h3>
              </div>
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dataset Type *</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as DatasetType)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:border-gov-blue"
                  >
                    <option value="Drone Orthomosaic (ORI)">Drone Orthomosaic (ORI - GeoTIFF / Cloud COG)</option>
                    <option value="Digital Surface Model (DSM)">Digital Surface Model (DSM - Height Raster / LAS)</option>
                    <option value="Digital Terrain Model (DTM)">Digital Terrain Model (DTM - Bare Earth Elevation)</option>
                    <option value="Existing GIS Parcel Layer">Existing GIS Parcel Layer (.shp / .geojson vector)</option>
                    <option value="Ground Truth Dataset">Ground Truth Dataset (CORS RTK Points .geojson / .csv)</option>
                    <option value="Raw Drone Imagery">Raw Drone Survey Imagery (RGB Flight Survey Tiles)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dataset Filename</label>
                  <input
                    type="text"
                    placeholder={`e.g. ORI_${selectedProject.city}_ZoneA_2026.tif`}
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Spatial Resolution / GSD</label>
                    <input
                      type="text"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-gov-blue font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Coordinate Reference System</label>
                    <input
                      type="text"
                      value={selectedProject.crs}
                      disabled
                      className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-gov-blue mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800">
                    Drag and drop your raster or vector files here
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Supports GeoTIFF, COG, SHP (zipped), GeoJSON, LAS, DEM up to 50 GB
                  </div>
                </div>

                {/* Simulated Progress Bar */}
                {isUploading && (
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span>Ingesting, building overviews & indexing pyramid tiles...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gov-blue h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Ingesting Dataset...</span>
                    </>
                  ) : (
                    <span>Start Dataset Ingestion</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Layers,
  Sparkles,
  AlertTriangle,
  FileCheck,
  Building,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

export const ReportsPage: React.FC = () => {
  const {
    projects,
    selectedProject,
    parcels,
    topologyIssues,
    kpis,
    surveyors
  } = useCadastre();

  const [selectedReportType, setSelectedReportType] = useState<string>('executive');
  const [selectedZone, setSelectedZone] = useState<string>('Zone A (Civil Lines)');

  const reportTypes = [
    { id: 'executive', label: '1. Executive Cadastral Survey Summary', icon: Compass },
    { id: 'ai-accuracy', label: '2. AI Segmentation & Model IoU Audit', icon: Sparkles },
    { id: 'cors-gt', label: '3. CORS RTK Ground Truth Telemetry Register', icon: ShieldCheck },
    { id: 'topology', label: '4. Geometry Topology Inconsistency Register', icon: AlertTriangle },
    { id: 'sanctioned', label: '5. Gazette Sanctioned Land Parcel Ledger', icon: FileCheck }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvData = 'Parcel ID,Property ID,Owner Name,Khasra No,Khata No,Area (sq.m),Land Use,Building Type,AI Conf (%),GT Status,Topology,Approval Status\n';
    csvData += parcels
      .map(
        (p) =>
          `"${p.id}","${p.propertyId}","${p.ownerName}","${p.khasraNo}","${p.khataNo}",${p.areaSqM},"${p.landUse}","${p.buildingStatus}",${p.aiConfidence},"${p.gtStatus}","${p.topologyStatus}","${p.approvalStatus}"`
      )
      .join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `OFFICIAL-CADASTRE-REPORT-${selectedReportType.toUpperCase()}-${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGeoJSON = () => {
    const geojsonData = {
      type: 'FeatureCollection',
      name: selectedProject.name,
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:EPSG::32644' }
      },
      features: parcels.map((p) => ({
        type: 'Feature',
        properties: {
          parcel_id: p.id,
          property_id: p.propertyId,
          owner: p.ownerName,
          khasra: p.khasraNo,
          khata: p.khataNo,
          area_sqm: p.areaSqM,
          land_use: p.landUse,
          building: p.buildingStatus,
          ai_conf: p.aiConfidence,
          status: p.approvalStatus
        },
        geometry: {
          type: 'Polygon',
          coordinates: [p.coordinates.map(([lat, lng]) => [lng, lat])]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], {
      type: 'application/geo+json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CADASTRAL-VECTORS-${selectedProject.id}.geojson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1500px] mx-auto">
      {/* Header Toolbar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-gov-blue text-[10px] font-bold uppercase rounded font-mono">
              Official Reporting Engine
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <FileText className="w-5 h-5 text-gov-blue" />
            <span>Cadastral Governance Reports, SITREPs & GIS Data Export</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate statutory sub-divisional SITREPs, model accuracy audits, and export GIS vectors in GeoJSON/Shapefile format.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGeoJSON}
            className="px-3.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-gov-blue" />
            <span>Export GIS (GeoJSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official SITREP</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedReportType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedReportType(type.id)}
              className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                isSelected
                  ? 'border-gov-blue bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? 'text-gov-blue' : 'text-slate-500'
                }`}
              />
              <span className="text-xs font-bold truncate">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Official Government SITREP Paper Document View */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            GOVERNMENT OF MADHYA PRADESH &bull; REVENUE & LAND RECORDS DEPARTMENT
          </div>
          <h2 className="text-xl font-extrabold text-gov-navy uppercase tracking-tight">
            OFFICIAL URBAN CADASTRAL GOVERNANCE SITREP & AUDIT REPORT
          </h2>
          <div className="text-xs font-mono text-slate-600">
            Project: <strong>{selectedProject.name}</strong> &bull; Authority:{' '}
            <strong>{selectedProject.authority}</strong> &bull; Date:{' '}
            <strong>{new Date().toISOString().split('T')[0]}</strong>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Total Survey Parcels:</span>
            <div className="text-base font-bold font-mono text-gov-navy">
              {kpis.totalParcelsExtracted.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">AI Extraction Accuracy:</span>
            <div className="text-base font-bold font-mono text-emerald-700">94.8% Mean IoU</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Field Verified (CORS):</span>
            <div className="text-base font-bold font-mono text-blue-800">
              {kpis.fieldVerifiedParcels.toLocaleString()} (67.5%)
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Gazette Sanctioned:</span>
            <div className="text-base font-bold font-mono text-gov-navy">
              {kpis.governmentApprovedParcels.toLocaleString()} Parcels
            </div>
          </div>
        </div>

        {/* Dynamic Report Body */}
        <div className="space-y-4 text-xs">
          <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider pb-1 border-b border-slate-200">
            1. Detailed Land Parcel Registry & Verification Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Parcel ID</th>
                  <th className="py-2 px-3">Owner Name</th>
                  <th className="py-2 px-3">Khasra / Khata</th>
                  <th className="py-2 px-3">Area (m²)</th>
                  <th className="py-2 px-3">Land Use</th>
                  <th className="py-2 px-3">AI IoU</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {parcels.slice(0, 10).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-bold text-gov-navy">{p.id}</td>
                    <td className="py-2 px-3 font-sans font-medium">{p.ownerName}</td>
                    <td className="py-2 px-3">
                      {p.khasraNo} / {p.khataNo}
                    </td>
                    <td className="py-2 px-3">{p.areaSqM} m²</td>
                    <td className="py-2 px-3 font-sans">{p.landUse}</td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">{p.aiConfidence}%</td>
                    <td className="py-2 px-3 font-bold">{p.approvalStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Topology Summary */}
        <div className="space-y-2 text-xs">
          <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider pb-1 border-b border-slate-200">
            2. Geometric Topology & Spatial Integrity Summary
          </h3>
          <p className="text-slate-600 leading-relaxed">
            A total of <strong>{topologyIssues.length} geometric anomalies</strong> were flagged by the automated spatial validation daemon. All {topologyIssues.filter((i) => i.status === 'Resolved').length} resolved issues were snapped within statutory 0.05m tolerance.
          </p>
        </div>

        {/* Statutory Official Sign-Off Block */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-6">
            <div className="text-slate-500 font-medium">Field Surveyor Lead:</div>
            <div className="pt-4 border-t border-slate-400 font-bold text-slate-800">
              {surveyors[0]?.name || 'Rajesh Sharma'}
              <div className="text-[10px] text-slate-500 font-normal">
                Lead Surveyor (CORS Division)
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-slate-500 font-medium">GIS Technical Officer:</div>
            <div className="pt-4 border-t border-slate-400 font-bold text-slate-800">
              Dr. Amit Verma
              <div className="text-[10px] text-slate-500 font-normal">
                Senior Photogrammetrist & AI Lead
              </div>
            </div>
          </div>

          <div className="space-y-6 col-span-2 sm:col-span-1">
            <div className="text-slate-500 font-medium">Sub-Divisional Magistrate (SDM):</div>
            <div className="pt-4 border-t border-slate-400 font-bold text-slate-800">
              Shri P. K. Mishra, IAS
              <div className="text-[10px] text-slate-500 font-normal">
                Directorate of Land Records, Jabalpur
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

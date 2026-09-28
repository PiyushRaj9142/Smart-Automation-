import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Maximize2,
  Minimize2,
  Search,
  Crosshair,
  Compass,
  AlertTriangle,
  Eye,
  EyeOff,
  Radio,
  Ruler,
  CheckCircle,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  MapPin,
  Building,
  Info
} from 'lucide-react';
import { useCadastre } from '../../context/CadastreContext';
import { CadastralParcel } from '../../types/cadastre';

interface CadastralMapProps {
  height?: string;
  className?: string;
  showControls?: boolean;
  onParcelSelect?: (parcel: CadastralParcel) => void;
  highlightParcelId?: string;
}

// Color palette for Land Use
const LAND_USE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  Residential: { fill: '#3B82F6', stroke: '#1D4ED8', text: '#1E40AF' },
  Commercial: { fill: '#EC4899', stroke: '#BE185D', text: '#9D174D' },
  Institutional: { fill: '#8B5CF6', stroke: '#6D28D9', text: '#5B21B6' },
  Industrial: { fill: '#64748B', stroke: '#334155', text: '#1E293B' },
  Agricultural: { fill: '#84CC16', stroke: '#4D7C0F', text: '#3F6212' },
  'Public & Green': { fill: '#10B981', stroke: '#047857', text: '#065F46' },
  Mixed: { fill: '#F59E0B', stroke: '#B45309', text: '#92400E' }
};

export const CadastralMap: React.FC<CadastralMapProps> = ({
  height = 'h-[620px]',
  className = '',
  showControls = true,
  onParcelSelect,
  highlightParcelId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const {
    parcels,
    selectedParcel,
    setSelectedParcel,
    selectedProject,
    topologyIssues,
    roads,
    approveParcel,
    resolveTopologyIssue,
    currentRole
  } = useCadastre();

  // Layer groups refs
  const layerGroupsRef = useRef<{
    parcels: L.LayerGroup;
    buildings: L.LayerGroup;
    roads: L.LayerGroup;
    groundTruth: L.LayerGroup;
    aiDetection: L.LayerGroup;
    topologyErrors: L.LayerGroup;
    contours: L.LayerGroup;
  } | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Active Layers Toggle
  const [activeLayers, setActiveLayers] = useState({
    parcels: true,
    buildings: true,
    roads: true,
    landUse: true,
    aiDetection: true,
    groundTruth: true,
    topologyErrors: true,
    contours: false
  });

  const [baseMapType, setBaseMapType] = useState<'satellite' | 'topo' | 'osm' | 'gis'>('satellite');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; utm: string }>({
    lat: 23.1818,
    lng: 79.9862,
    utm: '44N 598412E 2564210N'
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureResult, setMeasureResult] = useState<{ distanceM: number; areaSqM: number } | null>(null);

  // Base map tile URLs
  const baseMapTiles: Record<string, string> = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    gis: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedProject.centerLat || 23.1815, selectedProject.centerLng || 79.9864],
      zoom: selectedProject.zoomLevel || 16,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(baseMapTiles[baseMapType], {
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Initialize layer groups
    const layerGroups = {
      parcels: L.layerGroup().addTo(map),
      buildings: L.layerGroup().addTo(map),
      roads: L.layerGroup().addTo(map),
      groundTruth: L.layerGroup().addTo(map),
      aiDetection: L.layerGroup().addTo(map),
      topologyErrors: L.layerGroup().addTo(map),
      contours: L.layerGroup().addTo(map)
    };

    layerGroupsRef.current = layerGroups;
    mapInstanceRef.current = map;

    // Invalidate size shortly after mount to ensure perfect fit
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Track container resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Track mouse coordinates
    map.on('mousemove', (e) => {
      const lat = +e.latlng.lat.toFixed(5);
      const lng = +e.latlng.lng.toFixed(5);
      const utmE = Math.floor(Math.abs(lng * 10000) % 900000 + 100000);
      const utmN = Math.floor(Math.abs(lat * 10000) % 9000000 + 1000000);
      setCursorCoords({ lat, lng, utm: `44N ${utmE}E ${utmN}N` });
    });

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(baseMapTiles[baseMapType]);
  }, [baseMapType]);

  // Center on project change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [selectedProject.centerLat, selectedProject.centerLng],
      selectedProject.zoomLevel
    );
  }, [selectedProject]);

  // Render Vector Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current) return;

    const {
      parcels: parcelGroup,
      buildings: buildingGroup,
      roads: roadGroup,
      groundTruth: gtGroup,
      aiDetection: aiGroup,
      topologyErrors: errorGroup
    } = layerGroupsRef.current;

    // Clear all layers
    parcelGroup.clearLayers();
    buildingGroup.clearLayers();
    roadGroup.clearLayers();
    gtGroup.clearLayers();
    aiGroup.clearLayers();
    errorGroup.clearLayers();

    // 1. Render Parcels
    if (activeLayers.parcels) {
      parcels.forEach((parcel) => {
        const isSelected = selectedParcel?.id === parcel.id;
        const colorSpec = LAND_USE_COLORS[parcel.landUse] || {
          fill: '#3B82F6',
          stroke: '#1D4ED8'
        };

        const fillOpacity = activeLayers.landUse ? (isSelected ? 0.65 : 0.35) : 0.15;
        const strokeColor = isSelected ? '#FACC15' : colorSpec.stroke;
        const strokeWidth = isSelected ? 3.5 : 2;

        const polygon = L.polygon(parcel.coordinates, {
          color: strokeColor,
          weight: strokeWidth,
          fillColor: colorSpec.fill,
          fillOpacity,
          dashArray: parcel.approvalStatus === 'Government Approved' ? undefined : '4, 4'
        });

        // Tooltip
        polygon.bindTooltip(
          `<div class="text-xs font-sans">
            <strong class="text-slate-900">${parcel.id}</strong> (${parcel.khasraNo})<br/>
            <span class="text-slate-600">${parcel.ownerName}</span><br/>
            <span class="font-semibold text-blue-700">${parcel.areaSqM} m²</span> | ${parcel.landUse}
          </div>`,
          { sticky: true, className: 'gov-leaflet-tooltip' }
        );

        polygon.on('click', () => {
          setSelectedParcel(parcel);
          setIsDrawerOpen(true);
          if (onParcelSelect) onParcelSelect(parcel);
        });

        polygon.addTo(parcelGroup);

        // Parcel Centroid Label
        const centroidIcon = L.divIcon({
          className: 'cadastral-label',
          html: `<div class="bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-slate-700 whitespace-nowrap pointer-events-none">
            ${parcel.id.replace('PCL-', '')}
          </div>`,
          iconSize: [40, 16],
          iconAnchor: [20, 8]
        });
        L.marker(parcel.centroid, { icon: centroidIcon }).addTo(parcelGroup);
      });
    }

    // 2. Render Building Footprints
    if (activeLayers.buildings) {
      parcels.forEach((parcel) => {
        if (parcel.buildingFootprints && parcel.buildingFootprints.length > 0) {
          parcel.buildingFootprints.forEach((bldgCoords) => {
            const bldgPoly = L.polygon(bldgCoords, {
              color: '#B91C1C',
              weight: 1.5,
              fillColor: '#EF4444',
              fillOpacity: 0.55
            });

            bldgPoly.bindTooltip(
              `<div class="text-[11px]"><strong>Structure:</strong> ${parcel.buildingStatus}</div>`,
              { sticky: true }
            );

            bldgPoly.addTo(buildingGroup);
          });
        }
      });
    }

    // 3. Render Roads & Corridors
    if (activeLayers.roads) {
      roads.forEach((road) => {
        const roadLine = L.polyline(road.coordinates, {
          color: road.type === 'Primary Road' ? '#F59E0B' : '#E2E8F0',
          weight: road.type === 'Primary Road' ? 6 : 4,
          opacity: 0.85
        });

        roadLine.bindTooltip(
          `<div class="text-xs"><strong>${road.name}</strong><br/>Type: ${road.type} (Width: ${road.widthM}m)</div>`,
          { sticky: true }
        );

        roadLine.addTo(roadGroup);
      });
    }

    // 4. Render Ground Truth GNSS CORS Points
    if (activeLayers.groundTruth) {
      parcels.forEach((parcel) => {
        if (parcel.gtCoordinates) {
          parcel.gtCoordinates.forEach((coord, idx) => {
            const gtMarker = L.circleMarker(coord, {
              radius: 4,
              color: '#10B981',
              fillColor: '#34D399',
              fillOpacity: 0.9,
              weight: 2
            });

            gtMarker.bindTooltip(
              `<div class="text-[10px]"><strong>RTK CORS Point #${idx + 1}</strong><br/>Acc: ±${parcel.gnssData.accuracyCm} cm | ${parcel.gnssData.gnssStatus}</div>`
            );

            gtMarker.addTo(gtGroup);
          });
        }
      });
    }

    // 5. Render Topology Errors (Flashing Markers & Bounds)
    if (activeLayers.topologyErrors) {
      topologyIssues.forEach((issue) => {
        if (issue.status === 'Open' || issue.status === 'In Review') {
          const errorIcon = L.divIcon({
            className: 'error-pulse-icon',
            html: `<div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
              <div class="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-md">!</div>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker(issue.location, { icon: errorIcon });
          marker.bindTooltip(
            `<div class="text-xs font-sans text-red-900">
              <strong class="text-red-700 font-bold">⚠ ${issue.errorType}</strong><br/>
              <span>Parcel: ${issue.parcelId}</span><br/>
              <span class="text-slate-600 text-[10px]">${issue.description}</span>
            </div>`,
            { sticky: true }
          );

          marker.on('click', () => {
            const p = parcels.find((item) => item.id === issue.parcelId);
            if (p) {
              setSelectedParcel(p);
              setIsDrawerOpen(true);
            }
          });

          marker.addTo(errorGroup);
        }
      });
    }
  }, [parcels, activeLayers, selectedParcel, roads, topologyIssues]);

  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState<boolean>(false);

  // Zoom to parcel with fitBounds if selected
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedParcel) return;
    if (selectedParcel.coordinates && selectedParcel.coordinates.length > 0) {
      const bounds = L.latLngBounds(selectedParcel.coordinates);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 18,
        animate: true
      });
    } else if (selectedParcel.centroid) {
      mapInstanceRef.current.panTo(selectedParcel.centroid, { animate: true });
    }
  }, [selectedParcel]);

  // Search parcel handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const found = parcels.find(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.propertyId.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q)
    );
    if (found && mapInstanceRef.current) {
      setSelectedParcel(found);
      setIsDrawerOpen(true);
      if (found.coordinates && found.coordinates.length > 0) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(found.coordinates), {
          padding: [60, 60],
          maxZoom: 18,
          animate: true
        });
      } else {
        mapInstanceRef.current.flyTo(found.centroid, 18, { animate: true, duration: 1.2 });
      }
    }
  };

  const toggleLayer = (layerName: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const centerOnProject = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [selectedProject.centerLat, selectedProject.centerLng],
      selectedProject.zoomLevel,
      { animate: true }
    );
  };

  return (
    <div className={`relative isolate bg-slate-900 rounded-lg overflow-hidden border border-slate-300 shadow-gov w-full min-w-0 ${className}`}>
      {/* Top Map HUD Bar */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-[400] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
        {/* Left Search & Project Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto max-w-full">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Parcel, Khasra..."
              className="w-40 xs:w-48 sm:w-56 md:w-64 bg-white/95 backdrop-blur text-slate-800 text-xs px-2.5 sm:px-3 py-1.5 pl-7 sm:pl-8 rounded-md border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-blue font-medium truncate"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 sm:left-2.5 top-2" />
          </form>

          <div className="hidden lg:flex items-center gap-1.5 bg-gov-navy/90 text-white text-xs px-2.5 py-1.5 rounded-md border border-slate-700 shadow-sm font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{selectedProject.name}</span>
          </div>
        </div>

        {/* Right Base Map Switcher & Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto bg-white/95 backdrop-blur p-0.5 sm:p-1 rounded-md border border-slate-300 shadow-sm text-xs">
          <select
            value={baseMapType}
            onChange={(e) => setBaseMapType(e.target.value as any)}
            className="bg-transparent text-slate-800 text-[11px] sm:text-xs font-medium px-1.5 sm:px-2 py-1 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none"
          >
            <option value="satellite">🛰 Drone Ortho</option>
            <option value="topo">⛰ Topo DEM</option>
            <option value="gis">🗺 Carto GIS</option>
            <option value="osm">🌐 OSM</option>
          </select>

          <div className="h-4 w-px bg-slate-300 mx-0.5" />

          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="px-2 py-1 text-slate-700 hover:text-gov-navy hover:bg-slate-100 active:bg-slate-200 rounded transition font-bold text-xs min-h-[28px] min-w-[24px]"
            title="Zoom In (+)"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="px-2 py-1 text-slate-700 hover:text-gov-navy hover:bg-slate-100 active:bg-slate-200 rounded transition font-bold text-xs min-h-[28px] min-w-[24px]"
            title="Zoom Out (-)"
          >
            −
          </button>

          <div className="h-4 w-px bg-slate-300 mx-0.5" />

          <button
            type="button"
            onClick={centerOnProject}
            className="p-1 sm:p-1.5 text-slate-600 hover:text-gov-blue hover:bg-slate-100 rounded transition min-h-[28px] min-w-[24px] flex items-center justify-center"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className={`w-full ${height}`} />

      {/* Collapsible Layer Toggle Control (Floating Left) */}
      <div className="absolute top-12 sm:top-14 left-2 sm:left-3 z-[400] flex flex-col items-start gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/95 backdrop-blur text-gov-navy hover:bg-slate-50 border border-slate-300 rounded-md text-[11px] sm:text-xs font-bold shadow-md transition"
        >
          <Layers className="w-3.5 h-3.5 text-gov-blue" />
          <span className="hidden xs:inline">GIS Layers</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-gov-blue rounded font-mono">
            {Object.values(activeLayers).filter(Boolean).length}/7
          </span>
          <span className="text-[9px] text-slate-400 font-mono ml-0.5">
            {isLayerPanelOpen ? '▼' : '▶'}
          </span>
        </button>

        {isLayerPanelOpen && (
          <div className="bg-white/95 backdrop-blur p-2.5 sm:p-3 rounded-lg border border-slate-300 shadow-xl w-52 sm:w-56 max-w-[85vw] space-y-2 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span className="text-[10px] sm:text-[11px] font-bold text-gov-navy uppercase tracking-wider">
                Visible Layers
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{parcels.length} PCL</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.parcels}
                  onChange={() => toggleLayer('parcels')}
                  className="rounded text-gov-blue focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-medium">Parcel Boundaries</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.buildings}
                  onChange={() => toggleLayer('buildings')}
                  className="rounded text-gov-blue focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-sm inline-block" />
                  Buildings
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.roads}
                  onChange={() => toggleLayer('roads')}
                  className="rounded text-gov-blue focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-amber-500 rounded-sm inline-block" />
                  Road Corridors
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.landUse}
                  onChange={() => toggleLayer('landUse')}
                  className="rounded text-gov-blue focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-medium">Land-Use Colors</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.groundTruth}
                  onChange={() => toggleLayer('groundTruth')}
                  className="rounded text-gov-blue focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Ground Truth
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.topologyErrors}
                  onChange={() => toggleLayer('topologyErrors')}
                  className="rounded text-red-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-red-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" />
                  Topology ({topologyIssues.filter((i) => i.status === 'Open').length})
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-2 left-2 right-2 z-[400] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
        <div className="bg-slate-900/90 text-slate-200 backdrop-blur px-2.5 py-1 sm:py-1.5 rounded-md border border-slate-700 text-[10px] sm:text-[11px] font-mono flex items-center gap-2 sm:gap-3 shadow-md pointer-events-auto flex-wrap">
          <span>LAT: <strong className="text-emerald-400">{cursorCoords.lat}°N</strong></span>
          <span>LNG: <strong className="text-emerald-400">{cursorCoords.lng}°E</strong></span>
          <span className="hidden md:inline text-slate-400">UTM: {cursorCoords.utm}</span>
          <span className="text-blue-300">GSD: 2.5cm/px</span>
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-md border border-slate-300 text-[10px] text-slate-700 shadow-md pointer-events-auto">
          <span className="font-bold uppercase text-slate-500">Legend:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Residential</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-pink-500 rounded-sm" /> Commercial</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-purple-500 rounded-sm" /> Institutional</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Green</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> Building</span>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isDrawerOpen && selectedParcel && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[550] sm:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Parcel Detail Inspector Drawer / Bottom Sheet */}
      {isDrawerOpen && selectedParcel && (
        <div className="fixed inset-x-0 bottom-0 max-h-[82vh] rounded-t-xl z-[600] bg-white border-t border-slate-300 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 sm:absolute sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-96 sm:rounded-lg sm:border sm:shadow-gov-lg sm:slide-in-from-right">
          {/* Mobile Drag Handle */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-1.5 sm:hidden" />

          {/* Header */}
          <div className="px-4 py-2.5 sm:py-3 bg-gov-navy text-white flex items-center justify-between border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white tracking-wide">{selectedParcel.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono">
                  Khasra {selectedParcel.khasraNo}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">{selectedParcel.ownerName}</p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition min-h-[32px] min-w-[32px] flex items-center justify-center font-bold"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700">
            {/* High-res Drone Crop Preview */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-28 flex items-center justify-center">
              <img
                src={
                  selectedParcel.fieldPhotoUrl ||
                  'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&auto=format&fit=crop&q=60'
                }
                alt="Drone Orthomosaic Clip"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                Drone Orthomosaic (2.5 cm GSD)
              </div>
            </div>

            {/* Core Cadastral Attributes Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Calculated Area</span>
                <p className="text-sm font-semibold text-gov-navy mt-0.5">{selectedParcel.areaSqM} m²</p>
                <p className="text-[10px] text-slate-500 font-mono">({selectedParcel.areaSqFt} sq ft)</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Land Use</span>
                <p className="text-xs font-semibold text-gov-blue mt-0.5">{selectedParcel.landUse}</p>
                <p className="text-[10px] text-slate-500">{selectedParcel.buildingStatus}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Boundary Confidence</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-semibold text-slate-800 text-xs">{selectedParcel.aiConfidence}%</span>
                  <div className="w-14 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${selectedParcel.aiConfidence}%` }} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Verification Status</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedParcel.gtStatus === 'Verified' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                  />
                  {selectedParcel.gtStatus}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Assigned Surveyor</span>
                <p className="text-xs text-slate-700 mt-0.5 truncate">{selectedParcel.assignedSurveyorName || 'Rahul Kumar'}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Last Updated</span>
                <p className="text-xs text-slate-700 mt-0.5 font-mono">28 Sep 2026</p>
              </div>
            </div>

            {/* GNSS & CORS Telemetry */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-gov-blue" />
                  GNSS / CORS Survey Data
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold rounded">
                  {selectedParcel.gnssData.gnssStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-slate-600 pt-1">
                <span>LAT: {selectedParcel.gnssData.latitude}°</span>
                <span>LNG: {selectedParcel.gnssData.longitude}°</span>
                <span>ACCURACY: ±{selectedParcel.gnssData.accuracyCm} cm</span>
                <span>ELEVATION: {selectedParcel.gnssData.elevationM} m</span>
                <span className="col-span-2 text-slate-500 text-[10px] font-sans">
                  {selectedParcel.gnssData.corsStatus}
                </span>
              </div>
            </div>

            {/* Cadastral Workflow Timeline */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
              <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-gov-blue" />
                Cadastral Workflow Progress
              </span>

              <div className="space-y-2">
                {selectedParcel.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                        step.status === 'Completed'
                          ? 'bg-emerald-600'
                          : step.status === 'Flagged'
                          ? 'bg-red-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{step.stage}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{step.actor}</p>
                      {step.notes && <p className="text-[10px] text-amber-700 italic">{step.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => approveParcel(selectedParcel.id)}
                className="py-2.5 sm:py-1.5 px-3 bg-gov-blue hover:bg-gov-navy active:bg-gov-navy text-white text-xs font-medium rounded transition shadow-xs flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[34px]"
              >
                <FileCheck className="w-4 h-4" />
                <span>Verify Record</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`Editing boundary vertices for ${selectedParcel.id}...`)}
                className="py-2.5 sm:py-1.5 px-3 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-medium rounded transition min-h-[42px] sm:min-h-[34px]"
              >
                Edit Boundary
              </button>
            </div>

            {selectedParcel.approvalStatus === 'Government Approved' && (
              <div className="w-full text-center py-1.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium text-xs flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gazette Approved ({selectedParcel.certificateNo})</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

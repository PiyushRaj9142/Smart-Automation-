# AI-Powered Urban Cadastral Mapping & Governance Platform

A comprehensive, role-based Web-GIS platform that transforms high-resolution drone orthomosaics (ORI), Digital Surface/Terrain Models (DSM/DTM), and real-time RTK-CORS telemetry into legally sanctioned, verified cadastral land records.

---

## 🏛 Platform Portals

### 1. Government Authority Admin Portal
- **Dashboard & KPIs**: Total Projects, Total Extracted Parcels, AI Verified, Field Verified, Geometry Issues, and Pending Approvals.
- **5-Stage Live Cadastral Pipeline Stepper**:
  $$\text{AI Generated} \longrightarrow \text{Field Verified} \longrightarrow \text{Topology Validated} \longrightarrow \text{Admin Reviewed} \longrightarrow \text{Government Approved}$$
- **Judge Impact Section**: Quantified prototype efficiency metrics (78% manual effort reduced, 8.4x faster processing, 94.8% IoU accuracy).
- **Project Management Directory**: Multi-zone municipal project initialization and tracking.
- **Drone Datasets Ingestion Center**: Support for GeoTIFF ORI, DSM/DTM height rasters, LiDAR point clouds, legacy `.shp` vector layers, and CORS benchmark datasets.
- **AI Processing Center**: 9-stage deep learning pipeline (DeepLabV3+ with Swin-Large backbone, Active Contour vectorization, Mask R-CNN building extraction, RoadNet corridor tracing).
- **Interactive Multi-Layer Web-GIS**: Full-screen spatial viewport with layer toggles, parcel inspection drawer, and basemap switchers.
- **Automated Topology Validation**: Detection of overlaps, sliver gaps, self-intersections, and duplicate geometries with 0.05m tolerance auto-snapping.
- **CORS RTK Ground Truth Telemetry**: Sub-centimeter geodetic benchmarking against Survey of India CORS network (`IND-MP-04`).
- **Surveyor Roster & Terminal Telemetry**: Real-time tracking of active GNSS hardware and surveyor workloads.
- **Cadastral Approvals & Official Gazette Registry**: Sub-Divisional Magistrate (SDM) sanction workflow with digital QR seal.
- **Reports & SITREPs**: Printable official documents with PDF, CSV, and GeoJSON vector exports.
- **Immutable Audit Trail**: Cryptographically sealed ledger with SHA-256 signatures and IP audit records.

---

### 2. Field Surveyor / Verification Portal
- **Assigned Parcel Workload**: Filterable docket by priority and verification status.
- **Multi-Layer Boundary Inspection**: AI Extracted Polygon (96.8%) vs. Legacy GIS Vector vs. CORS Ground Truth.
- **Live GNSS / CORS Receiver Telemetry**: Real-time display of Latitude, Longitude, Elevation, and RTK FIX status ($\pm 2.1\text{ cm}$).
- **Interactive Boundary Editor**: Vertex modification with physical compound benchmark snapping.
- **Ground Photo Capture**: Geotagged photographic benchmark evidence capture.
- **Mobile/Tablet Responsive Terminal**: Dedicated thumb-friendly interface for field operations.

---

### 3. Citizen Public Services Portal
- **Public Property Search**: Lookup by Parcel ID (`PCL-004821`), PIN (`PROP-2026-9921`), or Revenue Khasra No (`142/1`).
- **Public Web-GIS Viewport**: Interactive boundary, building plinth, and land-use area display.
- **Download Official Gazette Certificate**: Digitally sealed cadastral record with QR code verification.
- **Grievance Redressal Form**: Submit boundary overlap, encroachment, measurement error, or title correction issues with automatic tracking ticket generation (e.g. `TKT-2026-8812`).

---

## 🚀 Demo Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Government Authority** | `admin@cadastre.gov` | `admin123` | Full administrative control (12 modules) |
| **Field Surveyor** | `surveyor@cadastre.gov` | `survey123` | Assigned parcels, RTK-CORS, boundary editor |
| **Citizen** | `citizen@example.com` | `citizen123` | Public parcel search, certificate, grievance |

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Geospatial & Mapping**: Leaflet, React-Leaflet, GeoJSON, EPSG:32644 (UTM Zone 44N)
- **Build Tool**: Vite 8

---

## 📦 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

<img width="1470" height="956" alt="Screenshot 2026-09-29 at 11 01 23 PM" src="https://github.com/user-attachments/assets/d9562968-a812-4105-8b31-f158aa102474" />AI-Based Automated Urban Parcel Mapping and Cadastral Feature Extraction using Drone Imagery, ORI, DSM/DTM & GIS Data
## 🌍 Overview
AI-enabled urban cadastral mapping platform designed to transform drone and geospatial data into **preliminary, validated and GIS-ready urban parcel information**.

The platform combines:

* 🛰️ Drone Imagery
* 🗺️ ORI / Orthophoto
* 📐 DSM / DTM
* 🌐 Existing GIS Data
* 🤖 AI-based Feature Extraction
* 🔷 Parcel Polygonization
* ✅ Automated Topology Validation
* 🎯 Confidence-Based Review
* 📡 GNSS / CORS Field Verification
* 👨‍💼 Government Approval Workflow
* 🌐 Citizen WebGIS

The core philosophy is:
AI assists the cadastral workflow; human surveyors and authorized authorities remain responsible for verification and approval

Urban cadastral mapping often involves manual interpretation and digitization of parcel boundaries. Existing cadastral and GIS datasets can also become outdated because of:

* New construction
* Road modifications
* Property subdivisions
* Urban expansion
* Changing land use
* Other physical changes

Dense urban environments make parcel boundary extraction particularly challenging because buildings, walls, vegetation, roads and closely packed properties can obscure actual boundaries.

At the same time, AI-generated geometries may contain spatial errors such as gaps, overlaps and self-intersections.
# 💡 Proposed Solution
The platform converts aerial and geospatial datasets into preliminary cadastral features and then applies spatial validation and human verification before they enter the official workflow.

### Core Pipeline

Drone / ORI / DSM / DTM / GIS
              │
              ▼
      Data Integration
              │
              ▼
       AI Feature Extraction
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Parcel  Building Road
    Detect  Detect   Detect
       │      │      │
       └──────┼──────┘
              ▼
        AI Segmentation
              │
              ▼
        Polygonization
              │
              ▼
     Topology Validation
              │
              ▼
      Confidence Scoring
              │
       ┌──────┴──────┐
       ▼             ▼
 High Confidence   Low Confidence
       │             │
       │       Surveyor Review
       │             │
       │       GNSS / CORS Check
       │             │
       └──────┬──────┘
              ▼
      Government Workflow
              │
              ▼
       GIS-Ready Output
              │
       ┌──────┴───────┐
       ▼              ▼
 Government       Citizen
   Portal         WebGIS


# ✨ Key Innovation

The proposed system is not limited to automatic parcel detection.

It creates an integrated workflow:

AI Extraction
      +
GIS Processing
      +
Topology Validation
      +
Confidence Scoring
      +
Human Review
      +
Field Verification
      +
Government Workflow
      +
Citizen WebGIS

The system can identify uncertain parcels and direct additional human effort toward those cases.

Each parcel can also carry an associated **evidence and verification trail**, rather than being represented only as a polygon.

---

# 🧠 AI-Powered Feature Extraction

## 1. Parcel Detection

AI processes drone/ORI imagery to identify probable parcel regions and boundaries.

### Input

Drone Imagery
      +
ORI / Orthophoto
      +
Existing GIS

## 2. Building Detection

Separate AI processing identifies building footprints.

Aerial Image
     ↓
Building Detection
     ↓
Building Footprint
     ↓
GIS Feature


## 3. Road & Pathway Detection

The system also identifies roads and pathways to provide additional spatial context for cadastral mapping.

---

# 🔷 Segmentation → Polygonization

AI-generated segmentation masks are converted into vector geometries.
Aerial Imagery
      ↓
AI Segmentation
      ↓
Segmentation Mask
      ↓
Contour Extraction
      ↓
Polygonization
      ↓
Vector Polygon
      ↓
GIS-Ready Geometry

This allows raster-based AI outputs to become usable spatial features.


# ✅ Automated Topology Validation

AI-generated geometries should not directly enter the official cadastral workflow without validation.

AstraTechs therefore introduces an automated topology-validation stage.

### Validation Checks

| Check              | Purpose                          |
| ------------------ | -------------------------------- |
| Gap Detection      | Detect missing spaces            |
| Overlap Detection  | Detect intersecting parcel areas |
| Self-Intersection  | Detect invalid polygon shapes    |
| Duplicate Geometry | Detect repeated features         |
| Polygon Validity   | Check geometric validity         |

AI Polygon
    ↓
Geometry Validation
    ↓
Topology Validation
    ↓
Valid / Invalid
    ↓
Review if Required

The presentation identifies automated detection of gaps, overlaps and invalid geometries as a key component of the proposed system.

---

# 🎯 Confidence-Based Human Review

Not every AI prediction has the same level of certainty.

The platform therefore introduces confidence-based review

                AI Prediction
                     │
                     ▼
              Confidence Score
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     High Confidence       Low Confidence
          │                     │
          ▼                     ▼
   Faster Workflow        Surveyor Review
                                │
                                ▼
                        Field Verification
                                │
                                ▼
                         Final Workflow

This approach allows surveyors to focus attention on uncertain or complex parcel boundaries.

---

# 📡 GNSS / CORS Field Verification

When aerial imagery is insufficient to establish a reliable boundary, the system supports field verification.

### Field Workflow

AI Generated Boundary
          ↓
    Surveyor Review
          ↓
     GNSS / CORS
          ↓
   Ground Observation
          ↓
   Boundary Correction
          ↓
      Verification

This is particularly relevant for ambiguous or disputed parcels.

---

# 🌐 WebGIS Architecture

The platform provides different interfaces for different stakeholders.

``      ┌────────────────────┐
                  │  Government Portal │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │  Spatial Platform  │
                  │                    │
                  │ AI + GIS + DB      │
                  │ Validation         │
                  │ Verification       │
                  └─────────┬──────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
   ┌──────────────────┐          ┌──────────────────┐
   │ Surveyor Portal  │          │  Citizen WebGIS  │
   └──────────────────┘          └──────────────────┘


# 🏛️ Government / Administration Portal

Government users can manage the cadastral workflow through a centralized interface.

### Functions

* Project management
* City / zone management
* Drone dataset upload
* AI processing monitoring
* Parcel review
* Approval / rejection
* Topology-error monitoring
* Surveyor assignment
* GIS export
* Verification tracking
* Audit information

---

# 🧑‍🔧 Surveyor / Field Verification Portal

The surveyor interface focuses on verification and field operations.

### Functions

* Assigned parcels
* Map visualization
* Satellite / drone layers
* AI-generated boundaries
* Verify
* Edit
* Reject
* GNSS/CORS information
* Field photographs
* Remarks
* Synchronization

Surveyors can review AI-generated candidate parcels instead of manually digitizing every parcel from the beginning.

---

# 👥 Citizen WebGIS Portal

The citizen-facing interface provides simpler access to available cadastral information.

### Functions

* Parcel search
* Map visualization
* Available land-record information
* Status viewing
* Discrepancy reporting
* Available information download

Citizen access is separated from administrative editing and approval workflows.

---

# 🏗️ System Architecture

┌─────────────────────────────────────────────┐
│                USER LAYER                   │
│ Government │ Surveyor │ Citizen             │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│              WEBGIS APPLICATION             │
│ Maps │ Search │ Review │ Verification       │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│             GIS / SPATIAL LAYER             │
│ Parcels │ Buildings │ Roads │ GIS Layers    │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│                 AI ENGINE                   │
│ Parcel │ Building │ Road │ Segmentation     │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│           POLYGONIZATION ENGINE             │
│ Contour Extraction → Vector Geometry        │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│             VALIDATION ENGINE               │
│ Gaps │ Overlaps │ Intersections │ Validity  │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│              SPATIAL DATABASE               │
│ Parcels │ GIS │ Verification │ Audit Data   │
└─────────────────────────────────────────────┘

# 🛠️ Technology Stack

The presentation identifies **PostGIS + WebGIS** as part of the spatial architecture and describes a modular AI/GIS approach.

> **Important:** Update the table below with the exact technologies actually implemented in your repository. Do not claim a framework/library simply because it appears in a prototype or proposed architecture.

| Layer              | Technology / Component               |
| ------------------ | ------------------------------------ |
| Frontend           | React.js/Next.js/typescript          |
| WebGIS             | open Layers/ Map libre.              |
| Backend            | Fast Api / Python                    |
| AI / ML            | Pytorch/YOLO/Unet/Sam 2              |
| GIS                | PostGIS / implemented GIS tooling    |
| Database           | Supabase/ PostGIS/ GeoTIFF           |            

---

# 🔄 End-to-End Workflow

## Phase 1 — Data Acquisition

Drone Imagery
ORI
DSM
DTM
Existing GIS
GNSS

## Phase 2 — Data Preparation

Data is integrated into the spatial processing environment.

## Phase 3 — AI Extraction

Parcel
Building
Road

features are detected.
## Phase 4 — Vectorization

AI segmentation masks are converted into vector polygons.

## Phase 5 — Quality Control

Automated topology and geometry validation is performed.

## Phase 6 — Confidence Assessment

The system identifies uncertain outputs.

## Phase 7 — Human Verification

Surveyors review and correct uncertain boundaries.


## Phase 8 — Field Verification

GNSS/CORS and field evidence can be used where required.


## Phase 9 — Government Workflow

Authorized users verify and approve information.


## Phase 10 — WebGIS

Available information is presented through Government, Surveyor and Citizen interfaces.


# 📊 Data Flow

             RAW DATA
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
   Drone        ORI       DSM/DTM
     │           │           │
     └───────────┼───────────┘
                 ▼
          Existing GIS
                 │
                 ▼
        Data Integration
                 │
                 ▼
          AI Processing
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    Parcels   Buildings   Roads
       │         │         │
       └─────────┼─────────┘
                 ▼
          Polygonization
                 │
                 ▼
       Topology Validation
                 │
                 ▼
        Confidence Scoring
                 │
                 ▼
         Human Verification
                 │
                 ▼
          GIS-ready Data


# 📸 Project Screenshots

## 🖥️ Application Dashboard

<img width="1600" height="809" alt="image" src="https://github.com/user-attachments/assets/f0e332b5-5af5-4e43-afc9-1a2b7e375d71" />
<img width="1600" height="804" alt="image" src="https://github.com/user-attachments/assets/67dda0cb-c266-43f7-b843-ccc3331ee88c" />

## 🗺️ WebGIS Map
<img width="1519" height="771" alt="image" src="https://github.com/user-attachments/assets/1ca6633c-1472-4c3b-a9e3-1a119583417c" />

## 🧠 AI Parcel Extraction
<img width="1509" height="773" alt="image" src="https://github.com/user-attachments/assets/447f28d2-f500-466b-9566-62bbb609d3f8" />

## 🔍 Topology Validation
<img width="1507" height="769" alt="image" src="https://github.com/user-attachments/assets/bc0e4d55-62db-4815-85db-0ed2e2d21467" />

## 👨‍🔧 Surveyor Verification
<img width="1509" height="773" alt="image" src="https://github.com/user-attachments/assets/90612adf-7335-4ec1-a447-60401a3be5ad" />

## 🏛️ Government Portal
<img width="1600" height="804" alt="image" src="https://github.com/user-attachments/assets/3fdf3197-482b-4857-a7dc-9f10d2c47271" />

## 👥 Citizen Portal
<img width="1600" height="816" alt="image" src="https://github.com/user-attachments/assets/75d8692d-5a46-4019-a72d-ad1a54b3d554" />

> Replace these paths with the actual screenshot filenames in your repository.

---

# 🎥 Demo
https://smart-automation-ten.vercel.app

## Demo Video
https://youtu.be/QOt0VaGu8As?si=pOkDf-XpLnUQXSJC
# 📂 Repository Structure

├── README.md
├── LICENSE
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── maps/
│   └── assets/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   └── validation/
│
├── ai/
│   ├── parcel-detection/
│   ├── building-detection/
│   ├── road-detection/
│   ├── segmentation/
│   └── polygonization/
│
├── gis/
│   ├── layers/
│   ├── processing/
│   ├── topology/
│   └── exports/
│
├── data/
│   ├── sample/
│   └── README.md
│
├── models/
│
├── docs/
│   ├── screenshots/
│   ├── architecture/
│   └── workflow/
│
└── demo/
⚙️ Installation & Setup

## Prerequisites

Install the technologies required by the actual implementation.

Typical requirements may include:

Git
Node.js
Package Manager
Database
GIS dependencies
AI/ML dependencies



# 🔌 API Architecture

The backend can be organized around the following logical API groups.

| Module         | Example Responsibility          |
| -------------- | ------------------------------- |
| Authentication | User authentication and roles   |
| Projects       | Project/city/zone management    |
| Imagery        | Drone/ORI dataset management    |
| Parcels        | Parcel retrieval and management |
| AI             | AI processing requests          |
| Validation     | Geometry/topology validation    |
| Surveyor       | Field verification              |
| GNSS           | Field coordinate information    |
| Approval       | Government review workflow      |
| WebGIS         | Spatial map services            |
| Export         | GIS data export                 |

### Example API Flow

POST /projects
        ↓
POST /imagery/upload
        ↓
POST /ai/parcel-extraction
        ↓
POST /validation/topology
        ↓
GET /parcels
        ↓
POST /surveyor/verify
        ↓
POST /approval
        ↓
GET /webgis/parcels



# 🧪 Quality Assurance

The platform considers multiple stages of quality control.

### AI Level

Detection
↓
Segmentation
↓
Confidence

### Geometry Level

Polygon
↓
Geometry Validation
↓
Topology Validation

### Human Level


Surveyor Review
↓
Field Verification
↓
Approval

This layered validation approach helps distinguish AI-generated preliminary outputs from verified cadastral information.

---

# 📈 Scalability

The platform is designed around a modular architecture that can scale:

WARD
  ↓
CITY
  ↓
MULTIPLE CITIES
  ↓
MULTIPLE STATES


The presentation identifies continuous updating, ward-to-city-to-multiple-city scaling and integration with planning, property-tax and land-record services as potential applications.

---

# 🌱 Potential Applications

The architecture can support future applications such as:

### 🏙️ Urban Planning

Structured parcel, building and road information for planning workflows.

### 💰 Property Tax

Potential integration with property-tax information and workflows.

### 🗃️ Land Information

Integration with broader land-information systems.

### 🏘️ Smart City Governance

Use of updated geospatial information for data-driven urban governance.

### 🛰️ Cadastral Modernization

AI-assisted updating and verification of urban cadastral datasets.

---

# ⚠️ Limitations & Considerations

The platform is designed as an **AI-assisted cadastral mapping and verification system**.

AI-generated boundaries should not automatically be treated as legally authoritative cadastral boundaries.

Complex cases may require:

* Surveyor review
* GNSS/CORS measurements
* Field evidence
* Administrative verification
* Applicable legal procedures

The project's presentation explicitly retains field/legal verification as part of the proposed workflow.

---

# 🔮 Future Scope

Potential future extensions include:

* Improved AI segmentation models
* Better dense-urban boundary extraction
* More advanced spatial quality checks
* Expanded GNSS/CORS integration
* Multi-city deployment
* Property-tax integration
* Urban planning integration
* Land-information applications
* Additional GIS datasets
* Additional AI models
* Advanced change detection


# 📌 Why This Approach?

The platform brings multiple stages together instead of treating parcel extraction as a standalone AI problem.

                 ┌─────────────┐
                 │   AI        │
                 │ Extraction  │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │    GIS      │
                 │ Processing  │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │ Topology    │
                 │ Validation  │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │ Confidence  │
                 │   Review    │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │  Surveyor   │
                 │ Verification│
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │ Government  │
                 │  Workflow   │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │   Citizen   │
                 │   WebGIS    │
                 └─────────────┘


# 📚 References

The project presentation references:

1. **Department of Land Resources (DoLR)** — NAKSHA
2. **Ministry of Panchayati Raj / Press Information Bureau**
3. **Ministry of Electronics & Information Technology / National Informatics Centre** — SVAMITVA
4. **International Society for Photogrammetry and Remote Sensing (ISPRS)** — research related to visible cadastral boundary delineation
5. **International Journal of Applied Earth Observation and Geoinformation / ScienceDirect** — research related to deep-learning-based automated cadastral boundary delineation

These references are included in the SIH project presentation.

---

# 📄 Project Documentation

Additional documentation:

* 📐 System Architecture
* 🗺️ GIS Workflow
* 🤖 AI Pipeline
* 🔍 Topology Validation
* 🧑‍🔧 Surveyor Workflow
* 🏛️ Government Workflow
* 🌐 Citizen WebGIS
* 📊 Impact & Feasibility

See the `/docs` directory for project documentation.

---


# ⭐ Project Summary

**AstraTechs** is an AI-enabled urban cadastral mapping platform that combines:

> 🛰️ Drone Imagery
> 🧠 Artificial Intelligence
> 🗺️ GIS
> 🔷 Polygonization
> ✅ Topology Validation
> 🎯 Confidence-Based Review
> 📡 GNSS/CORS
> 🧑‍🔧 Surveyor Verification
> 🏛️ Government Workflow
> 🌐 Citizen WebGIS

The objective is to support a more structured, scalable and auditable workflow for urban cadastral mapping while keeping human verification within the process.


Team Name:-AstraTechs
Team Leader:-Piyush Raj
Team Members:- Arti Kumari,Shruti kumari,Ashutosh Sinha
               Shubham Kumar Ishwar, Badal Singh

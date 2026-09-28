import React, { useState } from 'react';
import {
  Landmark,
  UserCheck,
  FileText,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onSelectPortal: (route: '/admin' | '/surveyor' | '/citizen') => void;
}

const translations = {
  EN: {
    back: 'Back',
    bannerTitle: 'Urban Cadastral Governance Portal — Ministry of Housing & Urban Affairs',
    heroBadge: 'National Cadastral Modernization & Urban Land Record Management',
    heroTitlePart1: 'Urban Cadastral',
    heroTitlePart2: 'Governance Portal',
    heroSubtitle: 'AI-Powered Urban Parcel Mapping, Verification & Land Record Management',
    heroDesc:
      'Automate parcel boundary extraction from drone imagery, verify cadastral features in the field, and manage verified land information through a unified geospatial platform.',
    pill1: 'Automated Parcel Extraction',
    pill2: 'CORS RTK Telemetry',
    pill3: 'Topology Rule Engine',
    pill4: 'Gazette Sanctioning',

    // Card 1
    adminRoute: 'ADMINISTRATIVE ACCESS',
    adminTitle: 'Government / Admin Portal',
    adminSubtitle: 'Centralized Cadastral Survey & Land Record Management',
    adminBullet1: 'Automated parcel extraction & drone imagery',
    adminBullet2: 'Automated topology verification & conflict resolution',
    adminBullet3: 'Gazette publication & digital land deed sanctioning',
    adminBullet4: 'Cadastral GIS analytics and spatial reporting',
    adminBtn: 'Open Admin Portal',

    // Card 2
    surveyorRoute: 'FIELD OPERATIONS',
    surveyorTitle: 'Surveyor / Field Verification',
    surveyorSubtitle: 'Field Verification & Ground Truthing Workspace',
    surveyorBullet1: 'Offline-ready parcel inspections & GNSS sync',
    surveyorBullet2: 'On-ground boundary adjustment with CORS RTK',
    surveyorBullet3: 'Geotagged site photography & plinth audit',
    surveyorBullet4: 'Direct wireless synchronization to cadastre',
    surveyorBtn: 'Open Surveyor Portal',

    // Card 3
    citizenRoute: 'PUBLIC ACCESS',
    citizenTitle: 'Citizen Portal',
    citizenSubtitle: 'Public Land Records & Grievance Redressal',
    citizenBullet1: 'Search parcel boundaries & khasra records',
    citizenBullet2: 'Verify official gazette-approved land certificates',
    citizenBullet3: 'Submit boundary correction grievances',
    citizenBullet4: 'Download signed property registry cards',
    citizenBtn: 'Open Citizen Portal',

    // Stats
    stat1Val: '12,480',
    stat1Label: 'Parcels Extracted',
    stat2Val: '11,920',
    stat2Label: 'Verified Records',
    stat3Val: '14.2 km²',
    stat3Label: 'Survey Area Mapped',
    stat4Val: '99.4%',
    stat4Label: 'Topological Accuracy',

    footer:
      '© 2026 Urban Cadastral Governance Portal | Survey of India & Directorate of Urban Land Records | Government of India'
  },
  HI: {
    back: 'पीछे जाएं',
    bannerTitle: 'शहरी भू-अभिलेख शासन पोर्टल — आवासन एवं शहरी कार्य मंत्रालय',
    heroBadge: 'राष्ट्रीय भू-अभिलेख आधुनिकीकरण एवं शहरी भूमि प्रबंधन प्रणाली',
    heroTitlePart1: 'शहरी भू-अभिलेख',
    heroTitlePart2: 'शासन पोर्टल',
    heroSubtitle: 'एआई-संचालित शहरी भूखंड मानचित्रण, सत्यापन एवं भू-अभिलेख प्रबंधन',
    heroDesc:
      'ड्रोन इमेजरी से स्वचालित पार्सल सीमा निष्कर्षण, क्षेत्रीय सत्यापन एवं एकीकृत भू-स्थानिक पोर्टल के माध्यम से प्रमाणित भू-अभिलेख प्रबंधन।',
    pill1: 'स्वचालित पार्सल निष्कर्षण',
    pill2: 'CORS RTK टेलीमेट्री',
    pill3: 'टोपोलॉजी नियम इंजन',
    pill4: 'गजट स्वीकृति',

    // Card 1
    adminRoute: 'प्रशासनिक पहुंच',
    adminTitle: 'सरकारी / प्रशासन पोर्टल',
    adminSubtitle: 'केंद्रीकृत भू-सर्वेक्षण एवं भू-अभिलेख प्रबंधन',
    adminBullet1: 'स्वचालित पार्सल निष्कर्षण एवं ड्रोन इमेजरी',
    adminBullet2: 'स्वचालित टोपोलॉजी सत्यापन एवं विवाद समाधान',
    adminBullet3: 'गजट प्रकाशन एवं डिजिटल अभिलेख स्वीकृति',
    adminBullet4: 'भू-स्थानिक एनालिटिक्स एवं रिपोर्टिंग डैशबोर्ड',
    adminBtn: 'प्रशासक पोर्टल खोलें',

    // Card 2
    surveyorRoute: 'क्षेत्रीय कार्य',
    surveyorTitle: 'सर्वेक्षक / क्षेत्रीय सत्यापन',
    surveyorSubtitle: 'क्षेत्रीय सत्यापन एवं ग्राउंड ट्रूथिंग कार्यक्षेत्र',
    surveyorBullet1: 'ऑफ़लाइन पार्सल निरीक्षण एवं GNSS सिंक',
    surveyorBullet2: 'CORS RTK आधारित सटीक सीमा समायोजन',
    surveyorBullet3: 'जियोटैग फोटो एवं निर्माण ऑडिट',
    surveyorBullet4: 'केंद्रीय सर्वर पर स्वचालित वायरलेस सिंक',
    surveyorBtn: 'सर्वेक्षक पोर्टल खोलें',

    // Card 3
    citizenRoute: 'सार्वजनिक पहुंच',
    citizenTitle: 'नागरिक पोर्टल',
    citizenSubtitle: 'स्वीकृत पार्सल विवरण देखें एवं शिकायत निवारण',
    citizenBullet1: 'पार्सल सीमाएं एवं खसरा विवरण खोजें',
    citizenBullet2: 'गजट स्वीकृत आधिकारिक प्रमाण पत्र सत्यापित करें',
    citizenBullet3: 'सीमा सुधार शिकायत ऑनलाइन दर्ज करें',
    citizenBullet4: 'हस्ताक्षरित डिजिटल अधिकार पत्र डाउनलोड करें',
    citizenBtn: 'नागरिक पोर्टल खोलें',

    // Stats
    stat1Val: '12,480',
    stat1Label: 'मैप किए गए पार्सल',
    stat2Val: '11,920',
    stat2Label: 'सत्यापित अभिलेख',
    stat3Val: '14.2 km²',
    stat3Label: 'सर्वेक्षित क्षेत्रफल',
    stat4Val: '99.4%',
    stat4Label: 'टोपोलॉजिकल सटीकता',

    footer:
      '© 2026 शहरी भू-अभिलेख शासन पोर्टल | भारतीय सर्वेक्षण विभाग एवं भूमि अभिलेख निदेशालय'
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal }) => {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 selection:bg-gov-blue selection:text-white relative overflow-x-hidden font-sans">
      {/* Top Bar: Back Button & Language Converter */}
      <div className="bg-gov-navy text-white text-xs px-4 sm:px-8 py-2 border-b border-slate-700 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        {/* Left: Back Button & Subtitle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white rounded border border-slate-700 text-xs font-medium transition"
            title="Go back to previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{t.back}</span>
          </button>

          <span className="text-slate-300 font-medium text-xs hidden md:inline tracking-wide">
            {t.bannerTitle}
          </span>
        </div>

        {/* Right: Language Toggle */}
        <div className="flex items-center">
          <div className="inline-flex items-center bg-slate-900/90 p-0.5 rounded border border-slate-700">
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                language === 'EN'
                  ? 'bg-gov-blue text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('HI')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                language === 'HI'
                  ? 'bg-gov-blue text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>हिंदी</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Landing Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-gov-blue" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gov-navy tracking-tight leading-tight">
            {t.heroTitlePart1}{' '}
            <span className="text-gov-blue">
              {t.heroTitlePart2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          {/* 4 Feature Pills Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[t.pill1, t.pill2, t.pill3, t.pill4].map((pill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{pill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THREE REFINED PORTAL CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* CARD 1 — GOVERNMENT / ADMIN PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-gov hover:shadow-gov-md hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-gov-blue text-white flex items-center justify-center shadow-xs">
                  <Landmark className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-gov-blue border border-blue-200 rounded uppercase tracking-wider">
                  {t.adminRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-gov-blue transition">
                  {t.adminTitle}
                </h2>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {t.adminSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.adminBullet1, t.adminBullet2, t.adminBullet3, t.adminBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gov-blue flex-shrink-0 mt-0.5" />
                    <span className="font-normal text-slate-700">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => onSelectPortal('/admin')}
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t.adminBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2 — SURVEYOR / FIELD VERIFICATION PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-gov hover:shadow-gov-md hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded uppercase tracking-wider">
                  {t.surveyorRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-emerald-800 transition">
                  {t.surveyorTitle}
                </h2>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {t.surveyorSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.surveyorBullet1, t.surveyorBullet2, t.surveyorBullet3, t.surveyorBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-normal text-slate-700">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => onSelectPortal('/surveyor')}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t.surveyorBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3 — CITIZEN PORTAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-gov hover:shadow-gov-md hover:border-slate-300 transition-all flex flex-col justify-between group md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded uppercase tracking-wider">
                  {t.citizenRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-lg font-bold text-gov-navy group-hover:text-slate-800 transition">
                  {t.citizenTitle}
                </h2>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {t.citizenSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.citizenBullet1, t.citizenBullet2, t.citizenBullet3, t.citizenBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="font-normal text-slate-700">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => onSelectPortal('/citizen')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t.citizenBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM KPI STATS BAR */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 font-sans">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Parcels Mapped */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gov-navy tracking-tight leading-tight">
                  {t.stat1Val}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{t.stat1Label}</div>
              </div>
            </div>

            {/* Stat 2: Verified Records */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gov-navy tracking-tight leading-tight">
                  {t.stat2Val}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{t.stat2Label}</div>
              </div>
            </div>

            {/* Stat 3: Survey Area Mapped */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gov-navy tracking-tight leading-tight">
                  {t.stat3Val}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{t.stat3Label}</div>
              </div>
            </div>

            {/* Stat 4: Data Accuracy */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gov-navy tracking-tight leading-tight">
                  {t.stat4Val}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{t.stat4Label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="text-slate-500 text-[11px] px-4 py-3 text-center border-t border-slate-200 bg-white">
        <span>{t.footer}</span>
      </footer>
    </div>
  );
};

export default LandingPage;

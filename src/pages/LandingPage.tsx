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
    bannerTitle: 'National Urban Cadastre AI & Multi-Portal Governance System',
    heroBadge: 'National Urban Cadastre AI & Multi-Portal Governance System',
    heroTitlePart1: 'Urban Cadastral',
    heroTitlePart2: 'Governance Portal',
    heroSubtitle: 'AI-Powered Urban Parcel Mapping, Verification & Land Record Management',
    heroDesc:
      'Transform high-resolution drone orthomosaics, DSM/DTM height models, and ground truth CORS telemetry into verified, legally compliant cadastral records with automated topology validation and multi-tier government governance.',
    pill1: 'AI-Powered Mapping',
    pill2: 'Legally Compliant Records',
    pill3: 'Multi-Tier Governance',
    pill4: 'Real-time Verification',

    // Card 1
    adminRoute: 'ROUTE : ADMIN',
    adminTitle: 'Government / Admin Portal',
    adminSubtitle: 'Centralized Cadastral Survey & Land Record Management',
    adminBullet1: 'Manage cadastral mapping and records',
    adminBullet2: 'AI processing and validation',
    adminBullet3: 'Approve and publish land records',
    adminBullet4: 'Analytics and reporting dashboard',
    adminBtn: 'Admin Login',

    // Card 2
    surveyorRoute: 'ROUTE : SURVEYOR',
    surveyorTitle: 'Surveyor / Field Verification',
    surveyorSubtitle: 'Field Verification & Ground Truthing Workspace',
    surveyorBullet1: 'Field data collection and verification',
    surveyorBullet2: 'AI-generated parcel boundaries',
    surveyorBullet3: 'Upload survey measurements',
    surveyorBullet4: 'Real-time synchronization',
    surveyorBtn: 'Surveyor Login',

    // Card 3
    citizenRoute: 'PUBLIC ACCESS : CITIZEN',
    citizenTitle: 'Citizen Portal',
    citizenSubtitle: 'Access Approved Parcel Information & Track Land Record Requests',
    citizenBullet1: 'View approved parcel information',
    citizenBullet2: 'Submit and track land record requests',
    citizenBullet3: 'Access property details and maps',
    citizenBullet4: 'Download verified documents',
    citizenBtn: 'Citizen Portal',

    // Stats
    stat1Val: '12.5M+',
    stat1Label: 'Parcels Mapped',
    stat2Val: '1.2M+',
    stat2Label: 'Verified Records',
    stat3Val: '3.4M+',
    stat3Label: 'Citizen Requests',
    stat4Val: '99.8%',
    stat4Label: 'Data Accuracy',

    footer:
      '© 2026 Urban Cadastral AI Platform | National Land Records Modernization Programme (NLRMP) | Survey Directorate'
  },
  HI: {
    back: 'पीछे जाएं',
    bannerTitle: 'राष्ट्रीय शहरी भू-अभिलेख एआई एवं बहु-पोर्टल शासन प्रणाली',
    heroBadge: 'राष्ट्रीय शहरी भू-अभिलेख एआई एवं बहु-पोर्टल शासन प्रणाली',
    heroTitlePart1: 'शहरी भू-अभिलेख',
    heroTitlePart2: 'शासन पोर्टल',
    heroSubtitle: 'एआई-संचालित शहरी भूखंड मानचित्रण, सत्यापन एवं भू-अभिलेख प्रबंधन',
    heroDesc:
      'उच्च-रिज़ॉल्यूशन ड्रोन ऑर्थोमोज़ेक, DSM/DTM मॉडल और CORS भू-स्थानिक डेटा को स्वचालित टोपोलॉजी सत्यापन एवं बहु-स्तरीय सरकारी शासन के साथ प्रमाणित भू-अभिलेखों में परिवर्तित करें।',
    pill1: 'एआई-संचालित मानचित्रण',
    pill2: 'विधिक प्रमाणित अभिलेख',
    pill3: 'बहु-स्तरीय शासन',
    pill4: 'रीयल-टाइम सत्यापन',

    // Card 1
    adminRoute: 'मार्ग : प्रशासन',
    adminTitle: 'सरकारी / प्रशासन पोर्टल',
    adminSubtitle: 'केंद्रीकृत भू-सर्वेक्षण एवं भू-अभिलेख प्रबंधन',
    adminBullet1: 'भू-मानचित्रण एवं अभिलेख प्रबंधन',
    adminBullet2: 'एआई प्रोसेसिंग एवं सत्यापन',
    adminBullet3: 'भू-अभिलेख स्वीकृति एवं प्रकाशन',
    adminBullet4: 'एनालिटिक्स एवं रिपोर्टिंग डैशबोर्ड',
    adminBtn: 'प्रशासक लॉगिन',

    // Card 2
    surveyorRoute: 'मार्ग : सर्वेक्षक',
    surveyorTitle: 'सर्वेक्षक / क्षेत्रीय सत्यापन',
    surveyorSubtitle: 'क्षेत्रीय सत्यापन एवं ग्राउंड ट्रूथिंग कार्यक्षेत्र',
    surveyorBullet1: 'क्षेत्रीय डेटा संग्रह एवं सत्यापन',
    surveyorBullet2: 'एआई-जनित पार्सल सीमाएं',
    surveyorBullet3: 'सर्वेक्षण माप अपलोड करें',
    surveyorBullet4: 'रीयल-टाइम डेटा सिंक',
    surveyorBtn: 'सर्वेक्षक लॉगिन',

    // Card 3
    citizenRoute: 'सार्वजनिक पहुंच : नागरिक',
    citizenTitle: 'नागरिक पोर्टल',
    citizenSubtitle: 'स्वीकृत पार्सल विवरण देखें एवं भू-अभिलेख अनुरोध ट्रैक करें',
    citizenBullet1: 'स्वीकृत पार्सल विवरण देखें',
    citizenBullet2: 'भू-अभिलेख अनुरोध सबमिट एवं ट्रैक करें',
    citizenBullet3: 'संपत्ति विवरण एवं मानचित्र देखें',
    citizenBullet4: 'प्रमाणित दस्तावेज डाउनलोड करें',
    citizenBtn: 'नागरिक पोर्टल',

    // Stats
    stat1Val: '12.5M+',
    stat1Label: 'मैप किए गए पार्सल',
    stat2Val: '1.2M+',
    stat2Label: 'सत्यापित अभिलेख',
    stat3Val: '3.4M+',
    stat3Label: 'नागरिक अनुरोध',
    stat4Val: '99.8%',
    stat4Label: 'डेटा सटीकता',

    footer:
      '© 2026 शहरी संवर्ग एआई मंच | राष्ट्रीय भूमि अभिलेख आधुनिकीकरण कार्यक्रम (NLRMP) | सर्वेक्षण निदेशालय'
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal }) => {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF4FF] via-[#F8FAFC] to-[#F5F3FF] flex flex-col justify-between text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Decorative Grid and Ambient Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Back Button & Language Converter */}
      <div className="bg-[#0B1528] text-white text-xs px-4 sm:px-8 py-2.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Left: Back Button & Subtitle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 text-white rounded-lg border border-slate-700 text-xs font-semibold transition shadow-xs"
            title="Go back to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <span className="text-slate-300 font-medium text-xs hidden md:inline tracking-wide">
            {t.bannerTitle}
          </span>
        </div>

        {/* Right: Language Toggle (A English / अ हिंदी) */}
        <div className="flex items-center">
          <div className="inline-flex items-center bg-[#070D18] p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-3.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                language === 'EN'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-black">A</span>
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('HI')}
              className={`px-3.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                language === 'HI'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-black">अ</span>
              <span>हिंदी</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Landing Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-3.5 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t.heroTitlePart1}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t.heroTitlePart2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base font-bold text-slate-700 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          {/* 4 Feature Pills Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {[t.pill1, t.pill2, t.pill3, t.pill4].map((pill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
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
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            {/* Soft background corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center shadow-md p-3">
                  <Landmark className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg uppercase tracking-wider">
                  {t.adminRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                  {t.adminTitle}
                </h2>
                <div className="text-xs text-blue-600 font-bold mt-1">
                  {t.adminSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.adminBullet1, t.adminBullet2, t.adminBullet3, t.adminBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4 relative z-10">
              <button
                type="button"
                onClick={() => onSelectPortal('/admin')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-slate-900 text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-700/20"
              >
                <span>{t.adminBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2 — SURVEYOR / FIELD VERIFICATION PORTAL */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            {/* Soft background corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md p-3">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg uppercase tracking-wider">
                  {t.surveyorRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                  {t.surveyorTitle}
                </h2>
                <div className="text-xs text-emerald-600 font-bold mt-1">
                  {t.surveyorSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.surveyorBullet1, t.surveyorBullet2, t.surveyorBullet3, t.surveyorBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4 relative z-10">
              <button
                type="button"
                onClick={() => onSelectPortal('/surveyor')}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-950 text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20"
              >
                <span>{t.surveyorBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3 — CITIZEN PORTAL */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-md hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden md:col-span-2 lg:col-span-1">
            {/* Soft background corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Header with Icon & Route Badge */}
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-md p-3">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg uppercase tracking-wider">
                  {t.citizenRoute}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition">
                  {t.citizenTitle}
                </h2>
                <div className="text-xs text-purple-600 font-bold mt-1">
                  {t.citizenSubtitle}
                </div>
              </div>

              {/* 4 Feature Bullet Points */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                {[t.citizenBullet1, t.citizenBullet2, t.citizenBullet3, t.citizenBullet4].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="font-medium">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 mt-4 relative z-10">
              <button
                type="button"
                onClick={() => onSelectPortal('/citizen')}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-950 text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-purple-700/20"
              >
                <span>{t.citizenBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM KPI STATS BAR */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 font-sans">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Parcels Mapped */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
                  {t.stat1Val}
                </div>
                <div className="text-xs text-slate-600 font-medium font-sans mt-0.5">{t.stat1Label}</div>
                <div className="w-8 h-1 bg-blue-600 rounded-full mt-1.5" />
              </div>
            </div>

            {/* Stat 2: Verified Records */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
                  {t.stat2Val}
                </div>
                <div className="text-xs text-slate-600 font-medium font-sans mt-0.5">{t.stat2Label}</div>
                <div className="w-8 h-1 bg-emerald-500 rounded-full mt-1.5" />
              </div>
            </div>

            {/* Stat 3: Citizen Requests */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
                  {t.stat3Val}
                </div>
                <div className="text-xs text-slate-600 font-medium font-sans mt-0.5">{t.stat3Label}</div>
                <div className="w-8 h-1 bg-purple-600 rounded-full mt-1.5" />
              </div>
            </div>

            {/* Stat 4: Data Accuracy */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
                  {t.stat4Val}
                </div>
                <div className="text-xs text-slate-600 font-medium font-sans mt-0.5">{t.stat4Label}</div>
                <div className="w-8 h-1 bg-amber-500 rounded-full mt-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="text-slate-400 text-[11px] px-4 py-4 text-center border-t border-slate-200/60 bg-white/50 backdrop-blur-xs relative z-10">
        <span>{t.footer}</span>
      </footer>
    </div>
  );
};

export default LandingPage;

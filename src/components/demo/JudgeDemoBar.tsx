import React from 'react';
import { useDemoMode, CADASTRAL_DEMO_STEPS } from '../../context/DemoModeContext';
import { useCadastre } from '../../context/CadastreContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Radio,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface JudgeDemoBarProps {
  onNavigateToModule: (moduleId: string) => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({ onNavigateToModule }) => {
  const {
    isDemoActive,
    currentStepIndex,
    currentStep,
    isPlaying,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    togglePlayPause
  } = useDemoMode();

  const { setCurrentRole } = useCadastre();

  if (!isDemoActive) return null;

  const progressPercent = Math.round(((currentStepIndex + 1) / CADASTRAL_DEMO_STEPS.length) * 100);

  const handleGoToTarget = () => {
    setCurrentRole(currentStep.targetRole);
    onNavigateToModule(currentStep.targetModule);
  };

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[96%] max-w-4xl bg-slate-900/95 text-white backdrop-blur-md border-2 border-gov-blue rounded-lg shadow-2xl p-2.5 sm:p-3.5 animate-in slide-in-from-bottom-5 duration-200">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-700/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-gov-blue text-white flex items-center justify-center animate-pulse flex-shrink-0">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase text-amber-300 font-mono truncate">
                EVALUATION STORYLINE
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono border border-slate-700">
                {currentStep.stepNumber}/{CADASTRAL_DEMO_STEPS.length} ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right controls: Step Jump & Close */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <select
            value={currentStepIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              goToStep(idx);
              const target = CADASTRAL_DEMO_STEPS[idx];
              if (target) {
                setCurrentRole(target.targetRole);
                onNavigateToModule(target.targetModule);
              }
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] sm:text-xs rounded px-1.5 sm:px-2 py-1 focus:outline-none font-mono max-w-[130px] xs:max-w-[180px] sm:max-w-none truncate"
          >
            {CADASTRAL_DEMO_STEPS.map((s, idx) => (
              <option key={s.id} value={idx}>
                Step {s.stepNumber}: {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={stopDemo}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition min-h-[28px] min-w-[28px] flex items-center justify-center"
            title="Exit Evaluation Storyline"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 my-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gov-blue via-blue-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Info & Narration */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">
              {currentStep.title}
            </span>
            <span className="text-[11px] text-amber-300 font-mono">
              [{currentStep.actor}]
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            {currentStep.narration}
          </p>
        </div>

        {/* Playback Controls & Action */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={handleGoToTarget}
            className="px-2.5 py-1.5 bg-gov-blue hover:bg-blue-600 text-white rounded text-xs font-bold flex items-center gap-1 transition shadow-sm"
            title="Jump to relevant interface module"
          >
            <span>Open {currentStep.targetModule}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
            <button
              onClick={() => {
                prevStep();
                const target = CADASTRAL_DEMO_STEPS[Math.max(0, currentStepIndex - 1)];
                if (target) {
                  setCurrentRole(target.targetRole);
                  onNavigateToModule(target.targetModule);
                }
              }}
              disabled={currentStepIndex === 0}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold flex items-center gap-1 transition"
              title={isPlaying ? 'Pause Auto-Play' : 'Play Auto-Play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                nextStep();
                const target = CADASTRAL_DEMO_STEPS[Math.min(CADASTRAL_DEMO_STEPS.length - 1, currentStepIndex + 1)];
                if (target) {
                  setCurrentRole(target.targetRole);
                  onNavigateToModule(target.targetModule);
                }
              }}
              disabled={currentStepIndex === CADASTRAL_DEMO_STEPS.length - 1}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

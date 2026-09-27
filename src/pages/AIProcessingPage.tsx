import React, { useState } from 'react';
import {
  Zap,
  Layers,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Cpu,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building,
  Compass,
  FileCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

export interface AIProcessingPageProps {
  onNavigateToMap?: () => void;
  onNavigateToGIS?: () => void;
  onNavigateToTopology?: () => void;
}

export const AIProcessingPage: React.FC<AIProcessingPageProps> = ({
  onNavigateToMap,
  onNavigateToGIS,
  onNavigateToTopology
}) => {
  const {
    pipelineStages,
    isPipelineRunning,
    runAIPipeline,
    resetPipeline,
    selectedProject,
    topologyIssues
  } = useCadastre();

  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(2); // Default to semantic segmentation
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);
  const [rdpTolerance, setRdpTolerance] = useState<number>(0.12);

  const selectedStage = pipelineStages[selectedStageIndex] || pipelineStages[0];

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-bold uppercase rounded font-mono">
              Deep Learning Engine v4.2
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
            <span className="text-xs text-slate-500">
              Active Project: <strong className="text-slate-800">{selectedProject.name}</strong>
            </span>
          </div>
          <h1 className="text-lg font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2 mt-1">
            <Brain className="w-5 h-5 text-gov-blue" />
            <span>AI Automated Cadastral Feature Extraction & Processing Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end 9-stage deep learning pipeline converting raw drone orthophotos to verified cadastral parcel polygons, building footprints, right-of-way roads, and land-use classifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetPipeline}
            disabled={isPipelineRunning}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pipeline</span>
          </button>

          <button
            onClick={runAIPipeline}
            disabled={isPipelineRunning}
            className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center gap-2 transition shadow-sm disabled:opacity-75"
          >
            {isPipelineRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Inference on 1,240 Tiles...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Execute Complete AI Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GPU & Hardware Acceleration Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Neural Inference Core</div>
            <div className="text-xs font-bold text-slate-100 mt-0.5 font-mono">
              NVIDIA TensorRT / A100 SXM4
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Inference Throughput</div>
            <div className="text-xs font-bold text-slate-100 mt-0.5 font-mono">
              41.2 ms / 512×512 Tile (98.6 FPS)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Mean Segmentation IoU</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5 font-mono">
              94.8% (Cadastral Standard)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Parcels Extracted</div>
            <div className="text-xs font-bold text-amber-300 mt-0.5 font-mono">
              18,420 Polygons Generated
            </div>
          </div>
        </div>
      </div>

      {/* Main Pipeline Stepper & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 9 Sequential Pipeline Stages */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              9-Stage Automated Pipeline Execution Flow
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Total Elapsed: ~3.8 min (Full Dataset)
            </span>
          </div>

          <div className="space-y-2">
            {pipelineStages.map((stage, idx) => {
              const isSelected = selectedStageIndex === idx;
              const isTopologyStage = stage.stageNumber === 9;
              const hasTopologyIssues = isTopologyStage && topologyIssues.length > 0;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-gov-blue bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs font-mono">
                        {stage.stageNumber}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-gov-navy flex items-center gap-2">
                          <span>{stage.name}</span>
                          {stage.status === 'Completed' && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase font-mono">
                              ✓ Completed
                            </span>
                          )}
                          {stage.status === 'Processing' && (
                            <span className="px-1.5 py-0.2 bg-blue-100 text-gov-blue rounded text-[9px] font-bold uppercase font-mono animate-pulse">
                              ⟳ Running ({stage.progressPercent}%)
                            </span>
                          )}
                          {stage.status === 'Issue' && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold uppercase font-mono">
                              ⚠ 326 Issues
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {stage.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {stage.outputCount.toLocaleString()} {stage.outputMetricLabel}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {stage.processingTimeSec}s &bull; IoU: {stage.accuracyIoU}%
                      </div>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        stage.status === 'Completed'
                          ? 'bg-emerald-500'
                          : stage.status === 'Processing'
                          ? 'bg-gov-blue'
                          : stage.status === 'Issue'
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${stage.progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Stage Deep Dive & Parameter Tuning */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-gov-blue rounded uppercase">
                  Stage {selectedStage.stageNumber} Analysis
                </span>
                <h3 className="text-sm font-bold text-gov-navy mt-1">{selectedStage.name}</h3>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs font-bold text-emerald-700">
                  {selectedStage.accuracyIoU}% IoU
                </div>
                <div className="text-[10px] text-slate-500">Benchmark Score</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Model Architecture & Backbone
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-gov-navy mt-1">
                  {selectedStage.modelArchitecture}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Processing Narrative & Calibration Details
                </label>
                <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedStage.details}
                </p>
              </div>

              {/* Parameter Adjuster */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-gov-blue" />
                  <span>Interactive Hyperparameter Tuning</span>
                </h4>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>AI Confidence Threshold:</span>
                    <span className="font-mono text-gov-blue font-bold">{confidenceThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    className="w-full accent-gov-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                    <span>0.50 (High Recall)</span>
                    <span>0.85 (Recommended)</span>
                    <span>0.99 (High Precision)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>RDP Contour Simplification Tolerance:</span>
                    <span className="font-mono text-gov-blue font-bold">{rdpTolerance}m</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.50"
                    step="0.01"
                    value={rdpTolerance}
                    onChange={(e) => setRdpTolerance(parseFloat(e.target.value))}
                    className="w-full accent-gov-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                    <span>0.05m (Sub-centimeter)</span>
                    <span>0.12m (Optimal)</span>
                    <span>0.50m (Coarse)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Quick Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
              {onNavigateToMap && (
                <button
                  onClick={onNavigateToMap}
                  className="flex-1 px-3 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect in Web-GIS Map</span>
                </button>
              )}

              {onNavigateToTopology && (
                <button
                  onClick={onNavigateToTopology}
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>Topology Errors</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

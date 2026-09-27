import React, { useState } from 'react';
import { Modal } from './Modal';
import { QrCode, Scan, Copy, Check, Printer, Camera } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId?: string;
  title?: string;
  qrPayload?: string;
  mode?: 'generate' | 'scan';
  onScanResult?: (scannedId: string) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  entityId = 'CG-1024',
  title = 'Official Materiel QR Manifest',
  qrPayload = 'EXP-CARGO-CG-1024-OXY-HIGH-ALT',
  mode = 'generate',
  onScanResult
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>(mode);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const copyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const simulateScan = (code: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(code);
      if (onScanResult) onScanResult(code);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'generate' ? `QR Manifest Code — ${entityId}` : 'Materiel & Checkpoint Optical Scanner'}
      subtitle="Encrypted Military/Government Telemetry Format ISO/IEC 18004"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] font-mono text-slate-500">
            FORMAT: SEC-QR-256
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold"
          >
            Close
          </button>
        </div>
      }
    >
      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 mb-4 pb-2 gap-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'generate'
              ? 'bg-gov-blue text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Generate / Print QR</span>
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'scan'
              ? 'bg-gov-blue text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Optical Scanner</span>
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div className="flex flex-col items-center justify-center py-2 text-center">
          {/* Visual SVG QR Code Frame */}
          <div className="p-4 bg-white border-2 border-slate-800 rounded-lg shadow-sm flex flex-col items-center relative">
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner Position Detection Patterns */}
              <rect x="5" y="5" width="26" height="26" fill="black" />
              <rect x="8" y="8" width="20" height="20" fill="white" />
              <rect x="11" y="11" width="14" height="14" fill="black" />

              <rect x="69" y="5" width="26" height="26" fill="black" />
              <rect x="72" y="8" width="20" height="20" fill="white" />
              <rect x="75" y="11" width="14" height="14" fill="black" />

              <rect x="5" y="69" width="26" height="26" fill="black" />
              <rect x="8" y="72" width="20" height="20" fill="white" />
              <rect x="11" y="75" width="14" height="14" fill="black" />

              {/* Data matrix pattern */}
              <rect x="36" y="8" width="5" height="5" fill="black" />
              <rect x="44" y="8" width="5" height="5" fill="black" />
              <rect x="56" y="8" width="5" height="5" fill="black" />
              <rect x="36" y="16" width="5" height="5" fill="black" />
              <rect x="48" y="16" width="5" height="5" fill="black" />
              <rect x="36" y="24" width="5" height="5" fill="black" />
              <rect x="44" y="24" width="5" height="5" fill="black" />
              <rect x="52" y="24" width="5" height="5" fill="black" />

              {/* Central Shield Marker */}
              <rect x="40" y="40" width="20" height="20" fill="#0F4C81" rx="3" />
              <path d="M46 50 L50 54 L56 46" stroke="white" strokeWidth="2" fill="none" />

              {/* Bottom matrix patterns */}
              <rect x="36" y="69" width="5" height="5" fill="black" />
              <rect x="44" y="69" width="5" height="5" fill="black" />
              <rect x="52" y="69" width="5" height="5" fill="black" />
              <rect x="69" y="44" width="5" height="5" fill="black" />
              <rect x="76" y="44" width="5" height="5" fill="black" />
              <rect x="84" y="44" width="5" height="5" fill="black" />
              <rect x="69" y="52" width="5" height="5" fill="black" />
              <rect x="84" y="52" width="5" height="5" fill="black" />
              <rect x="69" y="60" width="5" height="5" fill="black" />
              <rect x="76" y="60" width="5" height="5" fill="black" />
              <rect x="84" y="60" width="5" height="5" fill="black" />
              <rect x="69" y="69" width="5" height="5" fill="black" />
              <rect x="84" y="69" width="5" height="5" fill="black" />
              <rect x="69" y="76" width="5" height="5" fill="black" />
              <rect x="76" y="76" width="5" height="5" fill="black" />
              <rect x="84" y="84" width="5" height="5" fill="black" />
              <rect x="36" y="84" width="5" height="5" fill="black" />
              <rect x="48" y="84" width="5" height="5" fill="black" />
              <rect x="56" y="84" width="5" height="5" fill="black" />
            </svg>
            <div className="mt-2 text-[10px] font-mono font-bold text-slate-800 tracking-wider">
              {entityId}
            </div>
          </div>

          <div className="mt-3 w-full bg-slate-50 border border-slate-200 rounded p-2 text-left">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">Payload Content:</div>
            <div className="font-mono text-xs text-gov-navy break-all bg-white p-2 rounded border border-slate-200 select-all">
              {qrPayload}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 w-full">
            <button
              onClick={copyPayload}
              className="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Payload' : 'Copy Hash'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-1.5 bg-gov-blue hover:bg-gov-navy text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Asset Label</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-2">
          {/* Simulated Scanner Camera Viewfinder */}
          <div className="w-full h-56 bg-slate-900 rounded-lg relative overflow-hidden flex flex-col items-center justify-center border-2 border-slate-700">
            {/* Viewfinder reticle */}
            <div className="w-40 h-40 border-2 border-gov-blue border-dashed rounded relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />

              {/* Scanning red laser line */}
              {isScanning ? (
                <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-bounce" />
              ) : (
                <Camera className="w-8 h-8 text-slate-500" />
              )}
            </div>

            <div className="absolute bottom-2 text-[11px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
              {isScanning ? 'ACQUIRING OPTICAL LOCK...' : 'POINT CAMERA AT EXPEDITION QR TAG'}
            </div>
          </div>

          {/* Quick Simulation Targets */}
          <div className="mt-4 w-full text-left">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Simulate Optical Tag Scan:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateScan('EXP-CARGO-CG-1024-OXY-HIGH-ALT')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left text-xs transition"
              >
                <div className="font-bold text-gov-navy">CG-1024 (Oxygen Cylinders)</div>
                <div className="text-[10px] text-slate-500 font-mono">Diskit Logistics Node</div>
              </button>

              <button
                onClick={() => simulateScan('EXP-CARGO-CG-1025-MED-TRAUMA')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left text-xs transition"
              >
                <div className="font-bold text-gov-navy">CG-1025 (Trauma Surgical)</div>
                <div className="text-[10px] text-slate-500 font-mono">Panikhar Camp</div>
              </button>

              <button
                onClick={() => simulateScan('EXP-CHECKPOINT-CP-03-NORTH-PULLU')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left text-xs transition"
              >
                <div className="font-bold text-gov-navy">CP-03 (North Pullu)</div>
                <div className="text-[10px] text-slate-500 font-mono">Checkpoint Staging</div>
              </button>

              <button
                onClick={() => simulateScan('EXP-PERSONNEL-P-1024-RAHUL')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left text-xs transition"
              >
                <div className="font-bold text-gov-navy">P-1024 (Rahul Kumar)</div>
                <div className="text-[10px] text-slate-500 font-mono">Field Operations Lead</div>
              </button>
            </div>
          </div>

          {scannedResult && (
            <div className="mt-3 w-full p-3 bg-emerald-50 border border-emerald-300 rounded text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Verification Successful</span>
              </div>
              <div className="font-mono text-xs text-slate-800 mt-1 break-all bg-white p-2 rounded border border-emerald-200">
                {scannedResult}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

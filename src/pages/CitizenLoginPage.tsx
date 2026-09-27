import React, { useState } from 'react';
import {
  Building2,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
  User,
  CheckCircle2
} from 'lucide-react';
import { useCadastre } from '../context/CadastreContext';

interface CitizenLoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding
}) => {
  const { loginAs } = useCadastre();
  const [email, setEmail] = useState<string>('citizen@example.com');
  const [password, setPassword] = useState<string>('citizen123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('CITIZEN');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <div className="bg-gov-navy text-white text-xs px-4 sm:px-8 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-amber-300 hover:text-white rounded border border-slate-600 text-xs font-bold transition shadow-xs"
            title="Go back to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-gov-navy flex items-center justify-center font-bold text-[10px]">
              🏛
            </div>
            <span className="font-semibold tracking-wide uppercase text-[11px]">
              Ministry of Housing & Urban Affairs | Citizen Land Services
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:block">
          Citizen Land Services Gateway
        </div>
      </div>

      {/* Main Form Center */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-7 shadow-sm space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gov-navy">Citizen Portal</h1>
            <p className="text-xs text-slate-500">
              Access Approved Parcel Information & Track Land Record Requests
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Citizen Email / Mobile ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-purple-600 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-2.5 bg-purple-50 rounded border border-purple-200 text-[11px] text-slate-600 font-mono space-y-0.5">
              <div className="font-bold text-purple-900 font-sans">DEMO CITIZEN CREDENTIALS:</div>
              <div>User: <strong className="text-purple-800 font-mono">citizen@example.com</strong></div>
              <div>Pass: <strong className="text-purple-800 font-mono">citizen123</strong></div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <span>Login & Enter Citizen Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              ← Return to Portal Selection
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 text-slate-500 text-[11px] px-4 py-2.5 text-center">
        <span>© 2026 Urban Cadastral AI Platform | National Land Records Programme</span>
      </footer>
    </div>
  );
};

import React from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  isMobileMode: boolean;
  onToggleMode: (val: boolean) => void;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  isMobileMode,
  onToggleMode,
  children,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Device Viewport Mode Switcher */}
      <div className="mb-4 flex items-center gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <button
          onClick={() => onToggleMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            !isMobileMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full App Canvas</span>
        </button>

        <button
          onClick={() => onToggleMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isMobileMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Phone Frame</span>
        </button>
      </div>

      {/* Frame Container */}
      {isMobileMode ? (
        <div className="relative w-full max-w-[430px] rounded-[48px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-cyan-500/20">
          {/* Inner Phone Body */}
          <div className="relative w-full rounded-[40px] overflow-hidden bg-[#070A12] border border-cyan-500/20 flex flex-col min-h-[780px] max-h-[880px] shadow-inner">
            {/* Android Status Bar */}
            <div className="h-9 px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-300 select-none z-30 shrink-0">
              <span className="font-semibold tracking-tight">04:05</span>
              
              {/* Punch-hole camera */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner mx-auto" />

              <div className="flex items-center gap-1.5 text-slate-400">
                <Signal className="w-3 h-3 text-cyan-400" />
                <Wifi className="w-3 h-3 text-cyan-400" />
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Scrollable Phone App Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4">
              {children}
            </div>

            {/* Android Bottom Navigation Gesture Bar */}
            <div className="h-6 flex items-center justify-center shrink-0 pb-1">
              <div className="w-32 h-1 rounded-full bg-slate-600/80" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          {children}
        </div>
      )}
    </div>
  );
};

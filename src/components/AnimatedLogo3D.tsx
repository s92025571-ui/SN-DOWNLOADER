import React from 'react';
import { motion } from 'motion/react';
import { APP_CONFIG } from '../constants/config';
import { Sparkles, ArrowDownToLine } from 'lucide-react';

interface AnimatedLogo3DProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const AnimatedLogo3D: React.FC<AnimatedLogo3DProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconDimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }[size];

  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* 3D Raised Icon Container */}
      <motion.div
        whileHover={{ scale: 1.05, rotateZ: 2 }}
        whileTap={{ scale: 0.96 }}
        className={`relative ${iconDimensions} rounded-2xl p-0.5 shrink-0 cursor-pointer group`}
      >
        {/* Neon Ambient Rim Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />
        
        {/* Obsidian Glass Core with 3D Image */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 border border-cyan-400/30 shadow-2xl flex items-center justify-center">
          <img
            src={APP_CONFIG.iconAsset}
            alt="SN Downloader 3D Icon"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if image fails
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-cyan-400">
                    <span class="font-extrabold text-lg tracking-tighter">SN</span>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* Glossy Reflection Highlight */}
        <div className="absolute inset-x-1 top-1 h-2/5 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
      </motion.div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              SN
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Downloader
            </span>
          </h1>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase tracking-wider">
            v2.4
          </span>
        </div>

        {showSubtitle && (
          <p className="text-xs font-medium text-slate-400 tracking-wide flex items-center gap-1">
            <span>By</span>
            <span className="text-slate-200 font-semibold">{APP_CONFIG.brandName}</span>
          </p>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { APP_CONFIG } from '../constants/config';
import { Sparkles, ShieldCheck, Video, Music, CheckCircle2 } from 'lucide-react';
import { Platform } from '../types';

interface PlatformBadgesProps {
  onSelectSample: (url: string) => void;
  selectedPlatform?: Platform;
}

export const PlatformBadges: React.FC<PlatformBadgesProps> = ({
  onSelectSample,
  selectedPlatform,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Supported Platforms
        </h3>
        <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DRM & Policy Compliant</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {APP_CONFIG.platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          const sample = APP_CONFIG.sampleUrls.find((s) => s.platform === platform.id);

          return (
            <motion.div
              key={platform.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (sample) {
                  onSelectSample(sample.url);
                }
              }}
              className={`relative cursor-pointer rounded-2xl p-3 transition-all duration-300 text-left overflow-hidden ${
                isSelected
                  ? 'glass-panel border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'glass-panel hover:border-slate-600'
              }`}
            >
              {/* Subtle Platform-Colored Ambient Accent */}
              <div
                className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ backgroundColor: platform.color }}
              />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {platform.name}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>

                {/* Features Mini Tags */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  <span>{platform.features[0]}</span>
                  <span>·</span>
                  <span>{platform.features[1]}</span>
                </div>

                {/* Quick Paste Prompt */}
                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-cyan-300">
                  <span className="truncate">Sample Link</span>
                  <span className="text-cyan-400 font-semibold text-[10px]">Tap to Load</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

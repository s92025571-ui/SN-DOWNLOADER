import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VideoInfo, QualityOption } from '../types';
import {
  Download,
  Film,
  Music,
  Check,
  Sparkles,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface VideoPreviewCardProps {
  video: VideoInfo;
  onDownload: (quality: QualityOption) => void;
  isDownloading: boolean;
  onOpenOfficial?: (url: string) => void;
}

export const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
  video,
  onDownload,
  isDownloading,
  onOpenOfficial,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>(
    video.qualityOptions[0] || {
      id: '1080p',
      label: '1080p Full HD',
      resolution: '1920x1080',
      format: 'mp4',
      approxSize: '24.8 MB',
      hasAudio: true,
      isWatermarkFree: true,
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-3xl p-5 border border-cyan-500/25 space-y-5 text-left relative overflow-hidden"
    >
      {/* Background neon ambient highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Media Info Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Thumbnail with overlay duration */}
        <div className="relative w-full sm:w-44 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-800 shadow-md">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono font-medium text-slate-200">
            {video.duration}
          </div>

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase">
            {video.platform}
          </div>
        </div>

        {/* Title, Author & Stats */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
            {video.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {video.author}
            </span>
            {video.viewCount && (
              <>
                <span>·</span>
                <span>{video.viewCount}</span>
              </>
            )}
            {video.likesCount && (
              <>
                <span>·</span>
                <span>{video.likesCount}</span>
              </>
            )}
          </div>

          {/* Watermark-Free Clean Source Status */}
          <div className="pt-1 flex items-center gap-2">
            {video.cleanSourceAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clean Source (No Watermark)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Standard Creator Stream</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quality Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Select Format & Quality</span>
          <span className="text-cyan-400 font-normal lowercase">High Speed Multi-Thread</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {video.qualityOptions.map((opt) => {
            const isSelected = selectedQuality.id === opt.id;
            const isAudio = opt.format === 'mp3';

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedQuality(opt)}
                className={`flex flex-col text-left p-3 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900/90 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    {isAudio ? (
                      <Music className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {opt.resolution}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span className="uppercase font-mono">{opt.format}</span>
                  <span className="font-mono text-slate-300 font-semibold">{opt.approxSize}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isDownloading}
          onClick={() => onDownload(selectedQuality)}
          className={`flex-1 h-13 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
            isDownloading
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white shadow-cyan-500/25 border border-cyan-300/30'
          }`}
        >
          <Download className="w-5 h-5 stroke-[2.2]" />
          <span>
            {isDownloading ? 'Download in Progress...' : `Download ${selectedQuality.label} (${selectedQuality.approxSize})`}
          </span>
        </motion.button>

        {onOpenOfficial && (
          <button
            type="button"
            onClick={() => onOpenOfficial(video.url)}
            className="px-4 h-13 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            title="Open link in official platform app or website"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Open in Platform</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { DownloadItem } from '../types';
import {
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FolderDown,
  Play,
  Share2,
  HardDrive
} from 'lucide-react';

interface DownloadProgressBarProps {
  item: DownloadItem;
  onCancel: (id: string) => void;
  onRetry: (item: DownloadItem) => void;
  onPlay?: (item: DownloadItem) => void;
}

export const DownloadProgressBar: React.FC<DownloadProgressBarProps> = ({
  item,
  onCancel,
  onRetry,
  onPlay,
}) => {
  const isCompleted = item.status === 'completed';
  const isFailed = item.status === 'failed' || item.status === 'cancelled';
  const isDownloading = item.status === 'downloading';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-3xl p-4 sm:p-5 border text-left transition-all relative overflow-hidden ${
        isCompleted
          ? 'glass-panel border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-slate-900/90'
          : isFailed
          ? 'glass-panel border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-slate-900/90'
          : 'glass-panel border-cyan-500/40'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Downloaded Successfully</span>
              </span>
            )}
            {isFailed && (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{item.errorMessage || 'Download Interrupted'}</span>
              </span>
            )}
            {isDownloading && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Downloading Media...</span>
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-white truncate">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 font-mono">
            {item.fileName}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isDownloading && (
            <button
              onClick={() => onCancel(item.id)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Cancel Download"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isFailed && (
            <button
              onClick={() => onRetry(item)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}

          {isCompleted && onPlay && (
            <button
              onClick={() => onPlay(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Preview / Play</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="relative w-full h-3 rounded-full bg-slate-950/80 overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            className={`h-full rounded-full transition-all duration-200 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : isFailed
                ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
            }`}
            style={{ width: `${item.progress}%` }}
          >
            {/* Shimmer animation on active download */}
            {isDownloading && (
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            )}
          </motion.div>
        </div>

        {/* Metrics Row: Speed, Percentage, ETA, Size */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{item.progress}%</span>
            {isDownloading && (
              <>
                <span>·</span>
                <span className="text-cyan-300 font-medium">{item.speed}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDownloading && item.eta && (
              <span>ETA: {item.eta}</span>
            )}
            {isCompleted && (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <FolderDown className="w-3.5 h-3.5" />
                <span>Saved to Downloads</span>
              </span>
            )}
            <span>{(item.downloadedBytes / (1024 * 1024)).toFixed(1)} / {(item.totalBytes / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

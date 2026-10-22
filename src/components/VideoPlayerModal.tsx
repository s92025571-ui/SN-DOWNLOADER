import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadItem } from '../types';
import { X, Play, Volume2, Film, Music, Download, CheckCircle2 } from 'lucide-react';

interface VideoPlayerModalProps {
  item: DownloadItem | null;
  onClose: () => void;
  onSaveToDisk: (item: DownloadItem) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
  onSaveToDisk,
}) => {
  if (!item) return null;

  const isAudio = item.quality.format === 'mp3';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl p-5 border border-cyan-400/40 shadow-2xl text-left overflow-hidden space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {isAudio ? (
                <Music className="w-5 h-5 text-purple-400" />
              ) : (
                <Film className="w-5 h-5 text-cyan-400" />
              )}
              <h3 className="text-sm font-bold text-white truncate max-w-xs">
                {item.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Media Player Area */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
            {item.fileBlobUrl && !isAudio ? (
              <video
                src={item.fileBlobUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : item.fileBlobUrl && isAudio ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-3 w-full">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Volume2 className="w-8 h-8" />
                </div>
                <audio src={item.fileBlobUrl} controls className="w-full" />
              </div>
            ) : (
              // Fallback preview
              <div className="relative w-full h-full">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/40 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white">Media Saved to Downloads</span>
                  <span className="text-[11px] text-slate-300 font-mono mt-0.5">{item.fileName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Platform: <strong className="text-cyan-300 uppercase">{item.platform}</strong></span>
            <span>Format: <strong className="text-slate-200">{item.quality.resolution} ({item.quality.format})</strong></span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => onSaveToDisk(item)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Save Copy to Device</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

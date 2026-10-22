import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadItem, Platform } from '../types';
import {
  Download,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  FileVideo,
  FileAudio,
  HardDrive,
  FolderOpen
} from 'lucide-react';

interface DownloadsViewProps {
  downloads: DownloadItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onRetryItem: (item: DownloadItem) => void;
  onPlayItem: (item: DownloadItem) => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  downloads,
  onClearHistory,
  onDeleteItem,
  onRetryItem,
  onPlayItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = downloads.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'completed') {
      return matchesSearch && item.status === 'completed';
    }
    if (filterStatus === 'failed') {
      return matchesSearch && (item.status === 'failed' || item.status === 'cancelled');
    }
    return matchesSearch;
  });

  const totalCompletedSizeMB = downloads
    .filter((d) => d.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalBytes / (1024 * 1024), 0);

  return (
    <div className="space-y-4 text-left">
      {/* Top Header Strip with Storage summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <span>Downloads Vault</span>
          </h2>
          <p className="text-xs text-slate-400">
            {downloads.length} items logged · {totalCompletedSizeMB.toFixed(1)} MB saved
          </p>
        </div>

        {downloads.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 p-1 rounded-xl">
                <span className="text-[11px] text-rose-300 font-semibold px-2">Clear all?</span>
                <button
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved videos by title or platform..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl shrink-0">
          {(['all', 'completed', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                filterStatus === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads List */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Download className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No downloads found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'Try a different search query'
                : 'Paste a video URL on the Home screen to download your first media clip.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          <AnimatePresence>
            {filtered.map((item) => {
              const isAudio = item.quality.format === 'mp3';
              const isComplete = item.status === 'completed';
              const isFailed = item.status === 'failed' || item.status === 'cancelled';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel rounded-2xl p-3 sm:p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[8px] font-bold text-cyan-300 uppercase">
                        {item.platform}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-slate-300 font-medium">{item.quality.resolution}</span>
                        <span>·</span>
                        <span className="uppercase">{item.quality.format}</span>
                        <span>·</span>
                        <span>{(item.totalBytes / (1024 * 1024)).toFixed(1)} MB</span>
                        <span>·</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Status badge */}
                      <div className="mt-1 flex items-center gap-1 text-[11px]">
                        {isComplete && (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Saved in Downloads</span>
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-rose-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{item.errorMessage || 'Failed'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {isComplete && (
                      <button
                        onClick={() => onPlayItem(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </button>
                    )}

                    {isFailed && (
                      <button
                        onClick={() => onRetryItem(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

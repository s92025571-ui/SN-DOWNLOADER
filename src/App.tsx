import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Link2,
  Clipboard,
  Sparkles,
  Download,
  AlertCircle,
  FolderDown,
  HardDrive,
  Settings,
  HelpCircle,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  RotateCcw,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import { AppSettings, DownloadItem, QualityOption, VideoInfo } from './types';
import { APP_CONFIG } from './constants/config';
import { analyzeUrl, extractMediaDetails } from './utils/urlParser';
import { downloadEngine } from './utils/downloadEngine';

import { AnimatedLogo3D } from './components/AnimatedLogo3D';
import { WhatsAppButton } from './components/WhatsAppButton';
import { PlatformBadges } from './components/PlatformBadges';
import { VideoPreviewCard } from './components/VideoPreviewCard';
import { DownloadProgressBar } from './components/DownloadProgressBar';
import { DownloadsView } from './components/DownloadsView';
import { SettingsView } from './components/SettingsView';
import { AndroidCodeExplorer } from './components/AndroidCodeExplorer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AndroidFrame } from './components/AndroidFrame';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'downloads' | 'android' | 'settings'>('home');
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  // Settings State (Persisted in localStorage)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sn_downloader_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      whatsappNumber: APP_CONFIG.defaultWhatsAppNumber,
      whatsappMessage: APP_CONFIG.defaultWhatsAppMessage,
      defaultQuality: '1080p',
      autoAnalyzeClipboard: true,
      highSpeedThreads: 8,
      theme: 'midnight',
      savePath: 'Android/Downloads',
      watermarkFreeByDefault: true,
    };
  });

  // Downloads History (Persisted in localStorage)
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('sn_downloader_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Active Download State
  const [activeDownload, setActiveDownload] = useState<DownloadItem | null>(null);

  // URL Input & Media Analysis State
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedVideo, setAnalyzedVideo] = useState<VideoInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorSuggestion, setErrorSuggestion] = useState<string | null>(null);
  const [unsupportedOfficialUrl, setUnsupportedOfficialUrl] = useState<string | null>(null);

  // Playback Modal State
  const [selectedPlaybackItem, setSelectedPlaybackItem] = useState<DownloadItem | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('sn_downloader_settings', JSON.stringify(settings));
  }, [settings]);

  // Save downloads to localStorage
  useEffect(() => {
    localStorage.setItem('sn_downloader_history', JSON.stringify(downloads));
  }, [downloads]);

  // Handle URL Analysis
  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl ?? urlInput).trim();
    setErrorMessage(null);
    setErrorSuggestion(null);
    setUnsupportedOfficialUrl(null);

    if (!targetUrl) {
      setErrorMessage('Please enter or paste a valid video URL.');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzedVideo(null);

    // Simulate realistic asynchronous network metadata resolution
    setTimeout(() => {
      const result = analyzeUrl(targetUrl);

      if (!result.isValid) {
        setIsAnalyzing(false);
        setErrorMessage(result.error || 'Unable to parse this link.');
        setErrorSuggestion(result.suggestion || null);
        setUnsupportedOfficialUrl(result.officialUrl || null);
        return;
      }

      try {
        const details = extractMediaDetails(targetUrl, result.platform);
        setAnalyzedVideo(details);
      } catch (err: unknown) {
        setErrorMessage('Failed to extract media details. Please check the URL.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 550);
  };

  // Handle Paste from Clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        if (settings.autoAnalyzeClipboard) {
          handleAnalyze(text);
        }
      }
    } catch {
      // If clipboard permission is not granted in iframe
      const manual = window.prompt('Paste video link here:');
      if (manual) {
        setUrlInput(manual);
        if (settings.autoAnalyzeClipboard) {
          handleAnalyze(manual);
        }
      }
    }
  };

  // Trigger Download
  const handleStartDownload = async (quality: QualityOption) => {
    if (!analyzedVideo) return;

    // Reset error
    setErrorMessage(null);

    try {
      const item = await downloadEngine.startDownload(
        analyzedVideo,
        quality,
        (progressItem) => {
          setActiveDownload({ ...progressItem });
          // Update in downloads list if present
          setDownloads((prev) => {
            const index = prev.findIndex((d) => d.id === progressItem.id);
            if (index >= 0) {
              const copy = [...prev];
              copy[index] = progressItem;
              return copy;
            }
            return [progressItem, ...prev];
          });
        },
        (completedItem) => {
          setActiveDownload(null);
          // Update in downloads list
          setDownloads((prev) => {
            const updated = prev.filter((d) => d.id !== completedItem.id);
            return [completedItem, ...updated];
          });

          // Trigger festive confetti
          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.7 },
              colors: ['#00E5FF', '#9333EA', '#10B981', '#ffffff'],
            });
          } catch {
            // ignore
          }
        },
        (failedItem, errMsg) => {
          setActiveDownload(null);
          setDownloads((prev) => {
            const updated = prev.filter((d) => d.id !== failedItem.id);
            return [failedItem, ...updated];
          });
          setErrorMessage(`Download failed: ${errMsg}`);
        }
      );

      setActiveDownload(item);
      setDownloads((prev) => [item, ...prev]);
    } catch (err: unknown) {
      setErrorMessage('Could not initiate download. Please check network connection.');
    }
  };

  const handleCancelActiveDownload = (id: string) => {
    downloadEngine.cancelDownload(id);
    setActiveDownload(null);
  };

  const handleRetryDownload = (item: DownloadItem) => {
    const videoInfo: VideoInfo = {
      url: item.url,
      title: item.title,
      author: 'Creator',
      thumbnail: item.thumbnail,
      duration: '0:30',
      durationSeconds: 30,
      platform: item.platform,
      cleanSourceAvailable: item.quality.isWatermarkFree,
      qualityOptions: [item.quality],
    };
    setAnalyzedVideo(videoInfo);
    handleStartDownload(item.quality);
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearHistory = () => {
    setDownloads([]);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Background High-Tech Ambient Neon Grid Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 py-4 md:py-6">
        {/* Top Bar Contract (Wordmark - Navigation Links - Primary CTA / Android Switcher) */}
        <header className="flex items-center justify-between gap-4 md:gap-8 pb-4 mb-4 border-b border-slate-800/80">
          {/* Zone 1: Brand Wordmark & 3D Logo */}
          <div onClick={() => setActiveTab('home')} className="cursor-pointer">
            <AnimatedLogo3D size="md" showSubtitle={true} />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Downloader
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'downloads'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Downloads</span>
              {downloads.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {downloads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'android'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Android APK & Code</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Zone 3: Quick Action & WhatsApp Direct Trigger */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Support (+923288501635)</span>
            </a>
          </div>
        </header>

        {/* Mobile Sub-Navigation Bar for Small Screens */}
        <div className="flex md:hidden items-center justify-around p-1 mb-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
          >
            Downloader
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'downloads' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
          >
            Vault ({downloads.length})
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'android' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
          >
            APK Code
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'settings' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
          >
            Settings
          </button>
        </div>

        {/* View Content inside Android Frame or Expanded Canvas */}
        <AndroidFrame isMobileMode={isMobileMode} onToggleMode={setIsMobileMode}>
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner with Raised Metallic Accents */}
              <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-cyan-500/20 text-left">
                {/* Background decorative shimmer */}
                <div className="absolute top-0 right-0 w-80 h-full opacity-15 pointer-events-none">
                  <img
                    src={APP_CONFIG.bannerAsset}
                    alt="Background Grid"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative z-10 max-w-xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ultra HD 4K & Clean Source Watermark-Free Engine</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Download Any Video in Seconds with <span className="text-cyan-400">SN Downloader</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Paste links from TikTok, Instagram, YouTube, and Facebook. Extract full 1080p video, original audio MP3s, and direct media files directly to your device.
                  </p>
                </div>
              </div>

              {/* URL Input Box & Analysis Area */}
              <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-cyan-500/30 space-y-3 text-left shadow-2xl">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Video URL or Link</span>
                  <span className="text-slate-500 text-[11px] lowercase">tiktok, instagram, youtube, facebook</span>
                </label>

                <div className="relative flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="Paste TikTok, Instagram, YouTube or Facebook URL here..."
                      className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-all font-mono"
                    />

                    {/* Quick Paste Button inside input */}
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </button>
                  </div>

                  {/* Analyze Button */}
                  <button
                    type="button"
                    onClick={() => handleAnalyze()}
                    disabled={isAnalyzing}
                    className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Video</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Banner with helpful fallback options */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">{errorMessage}</p>
                      {errorSuggestion && <p className="text-[11px] text-slate-400">{errorSuggestion}</p>}
                      {unsupportedOfficialUrl && (
                        <div className="pt-1">
                          <a
                            href={unsupportedOfficialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-semibold"
                          >
                            <span>Open Official Platform Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Supported Platforms Strip */}
              <PlatformBadges
                onSelectSample={(sampleUrl) => {
                  setUrlInput(sampleUrl);
                  handleAnalyze(sampleUrl);
                }}
                selectedPlatform={analyzedVideo?.platform}
              />

              {/* Video Preview & Format Selection Area */}
              {analyzedVideo && (
                <VideoPreviewCard
                  video={analyzedVideo}
                  onDownload={handleStartDownload}
                  isDownloading={!!activeDownload}
                  onOpenOfficial={(url) => window.open(url, '_blank')}
                />
              )}

              {/* Active Download Progress Card */}
              {activeDownload && (
                <DownloadProgressBar
                  item={activeDownload}
                  onCancel={handleCancelActiveDownload}
                  onRetry={handleRetryDownload}
                  onPlay={(item) => setSelectedPlaybackItem(item)}
                />
              )}

              {/* Recent Downloads Preview Strip */}
              {downloads.length > 0 && !activeDownload && (
                <div className="glass-panel rounded-3xl p-5 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FolderDown className="w-4 h-4 text-cyan-400" />
                      <span>Recent Downloads ({downloads.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('downloads')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View All in Vault</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {downloads.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-950"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {item.quality.resolution} · {(item.totalBytes / (1024 * 1024)).toFixed(1)} MB · {item.platform.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedPlaybackItem(item)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors shrink-0"
                        >
                          Play / View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'downloads' && (
            <DownloadsView
              downloads={downloads}
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteDownload}
              onRetryItem={handleRetryDownload}
              onPlayItem={(item) => setSelectedPlaybackItem(item)}
            />
          )}

          {activeTab === 'android' && <AndroidCodeExplorer />}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              onClearStorage={() => {
                localStorage.clear();
                setDownloads([]);
                alert('Storage cache and history cleared.');
              }}
            />
          )}
        </AndroidFrame>

        {/* Floating Green WhatsApp Customer Support Button */}
        <WhatsAppButton
          phoneNumber={settings.whatsappNumber}
          prefillMessage={settings.whatsappMessage}
        />

        {/* Video Player & Export Modal */}
        <VideoPlayerModal
          item={selectedPlaybackItem}
          onClose={() => setSelectedPlaybackItem(null)}
          onSaveToDisk={(item) => {
            if (item.fileBlobUrl) {
              downloadEngine.triggerBrowserFileSave(item.fileBlobUrl, item.fileName);
            }
          }}
        />

        {/* Footer */}
        <footer className="mt-8 pt-4 pb-2 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {APP_CONFIG.appName} · Created by <strong className="text-slate-400">{APP_CONFIG.developer}</strong> ({APP_CONFIG.brandName})
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>WhatsApp Support: <strong className="text-emerald-400 font-mono">{settings.whatsappNumber}</strong></span>
            <span>·</span>
            <button onClick={() => setActiveTab('settings')} className="hover:text-slate-300">
              Settings & Privacy
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

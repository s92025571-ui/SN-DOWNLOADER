import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppSettings } from '../types';
import { APP_CONFIG } from '../constants/config';
import {
  Settings,
  MessageCircle,
  Save,
  Check,
  ShieldAlert,
  HardDrive,
  Info,
  Sparkles,
  ExternalLink,
  Smartphone,
  RotateCcw
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onClearStorage,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [whatsappMessage, setWhatsappMessage] = useState(settings.whatsappMessage);
  const [defaultQuality, setDefaultQuality] = useState(settings.defaultQuality);
  const [autoAnalyze, setAutoAnalyze] = useState(settings.autoAnalyzeClipboard);
  const [watermarkFree, setWatermarkFree] = useState(settings.watermarkFreeByDefault);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      whatsappNumber,
      whatsappMessage,
      defaultQuality,
      autoAnalyzeClipboard: autoAnalyze,
      watermarkFreeByDefault: watermarkFree,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleResetDefaults = () => {
    setWhatsappNumber(APP_CONFIG.defaultWhatsAppNumber);
    setWhatsappMessage(APP_CONFIG.defaultWhatsAppMessage);
    setDefaultQuality('1080p');
    setAutoAnalyze(true);
    setWatermarkFree(true);
  };

  const testUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>App Settings & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure download preferences, customer support contacts, and legal notices.
          </p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl">
            <Check className="w-3.5 h-3.5" />
            <span>Saved!</span>
          </span>
        )}
      </div>

      {/* WhatsApp Support Configuration Card */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                WhatsApp Customer Support Contact
              </h3>
              <p className="text-[11px] text-slate-400">
                Official owner contact channel for user inquiries and troubleshooting.
              </p>
            </div>
          </div>
          <a
            href={testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Test Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Owner Phone Number (with Country Code)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+923288501635"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 focus:border-emerald-400 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Supplied Owner Number: <code className="text-slate-400">{APP_CONFIG.defaultWhatsAppNumber}</code>. You can edit this anytime before release.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Prefilled WhatsApp Message
            </label>
            <textarea
              rows={2}
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Download Preferences */}
      <div className="glass-panel rounded-3xl p-5 border border-cyan-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Download & Engine Settings</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['1080p', '720p', '480p'].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setDefaultQuality(res)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    defaultQuality === res
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200">Auto-Analyze Links</span>
              <p className="text-[11px] text-slate-400">Automatically inspect link when pasted into input</p>
            </div>
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={(e) => setAutoAnalyze(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200">Prioritize Clean Source (No Watermark)</span>
              <p className="text-[11px] text-slate-400">Download authorized clean media stream whenever available</p>
            </div>
            <input
              type="checkbox"
              checked={watermarkFree}
              onChange={(e) => setWatermarkFree(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Legal & Terms Policy */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Platform Terms & Copyright Compliance</span>
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          SN Downloader respects all platform terms of service, intellectual property, and DRM restrictions.
          Downloading copyrighted material without authorization is strictly prohibited. Watermark-free downloads
          are only facilitated where creators permit clean-feed distribution. Private accounts, DRM-protected media,
          and content protected by paid licensing cannot be downloaded.
        </p>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
          <span>Brand: <strong className="text-slate-300">{APP_CONFIG.brandName}</strong></span>
          <span>Version: <strong className="text-cyan-400 font-mono">{APP_CONFIG.version}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>

        <button
          onClick={handleResetDefaults}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          onClick={onClearStorage}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Clear Cache & History</span>
        </button>
      </div>
    </div>
  );
};

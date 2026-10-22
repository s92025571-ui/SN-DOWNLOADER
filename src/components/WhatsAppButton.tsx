import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, X, ExternalLink, Check, Copy, HelpCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  prefillMessage: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  prefillMessage,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clean phone number for wa.me format (digits only, e.g. 923288501635)
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(prefillMessage);
  const whatsappUrl = `https://wa.me/${cleanDigits}?text=${encodedMsg}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex flex-col items-end">
      {/* Interactive Tooltip Card on Hover or Tap */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-3 w-72 rounded-2xl p-4 glass-panel border border-emerald-500/30 shadow-2xl backdrop-blur-xl text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">Owner WhatsApp Support</span>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 space-y-2">
              <p className="text-xs text-slate-300">
                Direct chat with app creator <strong className="text-white">Shani Noumi</strong>:
              </p>

              {/* Number pill with copy button */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/20 text-xs font-mono text-emerald-300">
                <span>{phoneNumber}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy Phone Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                &ldquo;{prefillMessage}&rdquo;
              </p>

              <button
                onClick={openWhatsApp}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start WhatsApp Chat</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Green WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (!showTooltip) {
            setShowTooltip(true);
          } else {
            openWhatsApp();
          }
        }}
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-2xl shadow-emerald-500/40 border-2 border-emerald-300/40 cursor-pointer"
        aria-label="Open WhatsApp Customer Support"
      >
        {/* Glow halo */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-md group-hover:bg-emerald-400/50 transition duration-300" />
        
        {/* SVG WhatsApp icon */}
        <div className="relative z-10 flex items-center justify-center">
          <svg
            className="w-7 h-7 fill-current drop-shadow"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15c-1.52 0-3-.4-4.31-1.16l-.31-.18-3.19.84.85-3.11-.2-.32a8.16 8.16 0 01-1.25-4.31c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.19-8.2 8.14zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31z" />
          </svg>
        </div>

        {/* Online badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
      </motion.button>
    </div>
  );
};

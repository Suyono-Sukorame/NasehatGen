'use client';

import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlyerConfig, FONTS, BACKGROUND_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FlyerPreviewProps {
  config: FlyerConfig;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function FlyerPreview({ config, previewRef }: FlyerPreviewProps) {
  const bgImage = useMemo(() => {
    if (config.backgroundMode === 'custom' && config.customBg) {
      return config.customBg;
    }
    const preset = BACKGROUND_PRESETS.find(p => p.id === config.bgPresetId);
    return preset?.url || BACKGROUND_PRESETS[0].url;
  }, [config.backgroundMode, config.bgPresetId, config.customBg]);

  // Auto-font size logic simplified for now
  const quoteFontSize = useMemo(() => {
    const len = config.quote.length;
    if (len < 50) return 'text-6xl';
    if (len < 100) return 'text-5xl';
    if (len < 200) return 'text-4xl';
    return 'text-3xl';
  }, [config.quote]);

  return (
    <div className="flex justify-center items-center h-full p-4 md:p-12">
      {/* Container that maintains 1080x1350 ratio (4:5) */}
      <div 
        id="flyer-container"
        ref={previewRef}
        className={cn(
          "relative overflow-hidden bg-[#1a1a1a] select-none",
          "w-full max-w-[400px] aspect-[4/5] sm:max-w-none sm:h-[750px] sm:w-[600px]",
          "shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]"
        )}
      >
        {/* Layer 1: Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Flyer Background"
            fill
            className={cn(
              "object-cover transition-all duration-1000",
              config.blurEffect ? "blur-xl scale-110" : "blur-0 scale-100"
            )}
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Layer 2: Texture Layer / Patterns */}
        {config.showTexture && (
          <div 
            className="absolute inset-0 opacity-30 z-10 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}
          />
        )}

        {/* Layer 3-4: Overlays */}
        <div 
          className="absolute inset-0 transition-opacity duration-700 z-20"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${config.overlayOpacity})` 
          }}
        />

        {config.gradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-25 opacity-90" />
        )}

        {/* Layer 5: Frames & Borders */}
        <div className="absolute inset-0 border-[12px] border-black/10 z-30 pointer-events-none" />
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#d4af37]/30 z-30" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#d4af37]/30 z-30" />

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-14 z-40">
          {config.showContentBox && (
            <div className="absolute inset-14 border border-white/10 bg-black/40 backdrop-blur-md rounded-lg" />
          )}

          {/* Text Content */}
          <div className={cn(
            "relative z-50 w-full h-full flex flex-col justify-between",
            config.textAlign === 'center' ? "items-center text-center" : "items-start text-left"
          )}>
            
            {/* Header */}
            <div className="w-full flex flex-col items-center">
              <div className="h-[1px] w-12 bg-[#d4af37] mb-6" />
              <motion.h2 
                key={config.headline}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "uppercase tracking-[0.4em] text-[10px] font-bold mb-4",
                  FONTS[config.typography]
                )}
                style={{ color: config.accentColor }}
              >
                {config.headline || "DAILY NASEHAT"}
              </motion.h2>
              {config.logo && (
                <div className="relative w-12 h-12 mt-2 opacity-80 mix-blend-screen">
                  <Image src={config.logo} alt="Logo" fill className="object-contain" />
                </div>
              )}
            </div>

            {/* Quote Body */}
            <div className="flex-1 flex items-center justify-center w-full">
              <motion.div
                key={config.quote}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "leading-tight italic text-white drop-shadow-lg",
                  quoteFontSize,
                  FONTS[config.typography]
                )}
              >
                {config.quote}
              </motion.div>
            </div>

            {/* Source & Footer */}
            <div className="w-full space-y-12">
              <div className="flex items-center gap-3 justify-center">
                <div className="h-[1px] w-4 bg-neutral-800" />
                <motion.p 
                  key={config.source}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400",
                    FONTS[config.typography]
                  )}
                >
                  {config.source}
                </motion.p>
                <div className="h-[1px] w-4 bg-neutral-800" />
              </div>

              {/* Bottom Info */}
              <div className="flex justify-between items-end w-full">
                <div className="text-left space-y-1">
                  <p className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Official Account</p>
                  <p className="text-[10px] font-bold text-neutral-400 tracking-tight">{config.socialHandle || "@usernasehat"}</p>
                </div>
                {config.footer && (
                  <div className="text-right space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-[#d4af37] font-bold">Reminder</p>
                    <p className="text-[10px] font-bold text-neutral-400 tracking-tight">{config.footer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

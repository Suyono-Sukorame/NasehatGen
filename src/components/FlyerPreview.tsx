'use client';

import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlyerConfig, FONTS, BACKGROUND_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FlyerPreviewProps {
  config: FlyerConfig;
  setConfig: React.Dispatch<React.SetStateAction<FlyerConfig>>;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function FlyerPreview({ config, setConfig, previewRef }: FlyerPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bgImage = useMemo(() => {
    if (config.backgroundMode === 'custom' && config.customBg) {
      return config.customBg;
    }
    const preset = BACKGROUND_PRESETS.find(p => p.id === config.bgPresetId);
    return preset?.url || BACKGROUND_PRESETS[0].url;
  }, [config.backgroundMode, config.bgPresetId, config.customBg]);

  // Combined filters
  const bgFilterStyle = useMemo(() => {
    let filters = '';
    if (config.blurEffect) filters += `blur(${config.blurAmount}px) `;
    if (config.bgFilter === 'grayscale') filters += 'grayscale(100%) ';
    if (config.bgFilter === 'sepia') filters += 'sepia(100%) ';
    if (config.bgFilter === 'darken') filters += 'brightness(50%) ';
    return filters.trim() || 'none';
  }, [config.blurEffect, config.blurAmount, config.bgFilter]);

  // Auto-font size logic
  const autoFontSize = useMemo(() => {
    const len = config.quote.length;
    if (len < 50) return 'text-6xl';
    if (len < 100) return 'text-5xl';
    if (len < 200) return 'text-4xl';
    return 'text-3xl';
  }, [config.quote]);

  const quoteFontSizeClass = config.quoteFontSize > 0 ? '' : autoFontSize;
  const quoteFontSizeStyle = config.quoteFontSize > 0 ? { fontSize: `${config.quoteFontSize}px` } : {};

  const handleDragEnd = (element: 'quote' | 'logo', info: any) => {
    setConfig(prev => ({
      ...prev,
      elementPositions: {
        ...prev.elementPositions,
        [element]: {
          x: prev.elementPositions[element].x + info.offset.x,
          y: prev.elementPositions[element].y + info.offset.y
        }
      }
    }));
  };

  return (
    <div className="flex justify-center items-center h-full p-4 md:p-12">
      <div 
        id="flyer-container"
        ref={(el) => {
          // @ts-ignore
          previewRef.current = el;
          // @ts-ignore
          containerRef.current = el;
        }}
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
            className="object-cover transition-all duration-700"
            style={{ 
              filter: bgFilterStyle,
              transform: config.blurEffect ? 'scale(1.1)' : 'scale(1)'
            }}
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Layer 2: Texture Layer */}
        {config.showTexture && (
          <div 
            className="absolute inset-0 opacity-20 z-10 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}
          />
        )}

        {/* Layer 3: Overlays */}
        <div 
          className="absolute inset-0 transition-opacity duration-700 z-20"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${config.overlayOpacity})` 
          }}
        />

        {config.gradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-25 opacity-90" />
        )}

        {/* Layer 4: Decorative Borders */}
        <div className="absolute inset-0 border-[12px] border-black/10 z-30 pointer-events-none" />
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#d4af37]/30 z-30" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#d4af37]/30 z-30" />

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-14 z-40">
          {config.showContentBox && (
            <div className="absolute inset-14 border border-white/10 bg-black/40 backdrop-blur-md rounded-lg" />
          )}

          {/* Interactive Elements Container */}
          <div className={cn(
            "relative z-50 w-full h-full flex flex-col",
            config.textAlign === 'center' ? "items-center text-center" : "items-start text-left"
          )}>
            
            {/* Draggable Logo */}
            {config.logo && (
              <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                onDragEnd={(_, info) => handleDragEnd('logo', info)}
                initial={config.elementPositions.logo}
                animate={config.elementPositions.logo}
                className="cursor-move z-60 mb-4"
              >
                <div className="relative w-16 h-16 opacity-90 mix-blend-screen drop-shadow-2xl">
                  <Image src={config.logo} alt="Logo" fill className="object-contain" />
                </div>
              </motion.div>
            )}

            {/* Header */}
            <div className="w-full flex flex-col items-center pointer-events-none">
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
            </div>

            {/* Draggable Quote Body */}
            <motion.div 
              drag
              dragConstraints={containerRef}
              dragElastic={0.1}
              onDragEnd={(_, info) => handleDragEnd('quote', info)}
              initial={config.elementPositions.quote}
              animate={config.elementPositions.quote}
              className="flex-1 flex items-center justify-center w-full cursor-move z-55"
            >
              <div
                className={cn(
                  "leading-tight italic text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]",
                  quoteFontSizeClass,
                  FONTS[config.typography]
                )}
                style={quoteFontSizeStyle}
              >
                {config.quote}
              </div>
            </motion.div>

            {/* Source & Footer (Static at bottom for balance) */}
            <div className="w-full space-y-12 pointer-events-none mt-auto">
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

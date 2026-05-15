'use client';

import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Camera, Send, Twitter } from 'lucide-react';
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
          "relative overflow-hidden bg-white select-none",
          "w-full max-w-[400px] aspect-[4/5] sm:max-w-none sm:h-[750px] sm:w-[600px]",
          "shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        )}
      >
        {/* Layer 1: Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Flyer Background"
            fill
            className="object-cover transition-all duration-700 opacity-10"
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
            className="absolute inset-0 opacity-5 z-10 pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'radial-gradient(#C5A059 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}
          />
        )}

        {/* Layer 3: Overlays - Hidden or Adjusted for White Template */}
        {config.backgroundMode === 'custom' && (
          <div 
            className="absolute inset-0 transition-opacity duration-700 z-20"
            style={{ 
              backgroundColor: `rgba(255, 255, 255, ${1 - config.overlayOpacity})` 
            }}
          />
        )}

        {/* Content Box - Removed or Made Subtle */}
        {config.showContentBox && (
          <div className="absolute inset-14 border border-[#C5A059]/10 bg-white/40 backdrop-blur-sm rounded-lg z-30" />
        )}

        {/* Interactive Elements Container */}
        <div className="absolute inset-0 flex flex-col p-14 z-40">
          <div className={cn(
            "relative z-50 w-full h-full flex flex-col",
            config.textAlign === 'center' ? "items-center text-center" : "items-start text-left"
          )}>
            
            {/* Top Social Bar */}
            <div className="absolute top-[-30px] left-0 right-0 flex items-start justify-between w-full font-oswald pointer-events-none z-50 px-2">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold tracking-tight text-[#C5A059]">www.dewanfatwa.com</span>
                <div className="h-6 w-[1.5px] bg-[#C5A059] opacity-40 mx-1" />
                <div className="flex gap-2 text-[#C5A059] items-center">
                   {/* Custom Icon Group matching SS 1 */}
                   <div className="flex gap-1.5 items-center">
                     <Facebook size={14} strokeWidth={3} />
                     <Camera size={14} strokeWidth={3} />
                     <Send size={14} strokeWidth={3} />
                     <Twitter size={14} strokeWidth={3} />
                   </div>
                   <span className="text-[12px] font-bold text-[#C5A059] tracking-tight ml-1">@DewanFatwaPA</span>
                </div>
              </div>
              <div className="relative w-16 h-16 -mt-2">
                 <img src="https://res.cloudinary.com/dwehn7brt/image/upload/v1740000000/dewan-fatwa-logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            </div>
            
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
                <div className="relative w-16 h-16 opacity-90 drop-shadow-xl">
                  <Image src={config.logo} alt="Logo" fill className="object-contain" />
                </div>
              </motion.div>
            )}

            {/* Header / Title */}
            <div className="w-full flex flex-col items-center pointer-events-none mt-20 mb-12">
              <motion.h2 
                key={config.headline}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="uppercase tracking-[0.2em] text-[28px] font-bold font-oswald"
                style={{ color: '#C5A059' }}
              >
                {config.headline || "ADAB BERTEMAN"}
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
                  "leading-snug text-black font-montserrat font-medium",
                  quoteFontSizeClass
                )}
                style={quoteFontSizeStyle}
              >
                {config.quote}
              </div>
            </motion.div>

            {/* Source & Footer */}
            <div className="w-full space-y-8 pointer-events-none mt-auto mb-16">
              <div className="flex items-center justify-center gap-2">
                <motion.p 
                  key={config.source}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[12px] font-bold uppercase tracking-[0.05em] text-black font-oswald"
                >
                  {config.source}
                </motion.p>
              </div>

              <div className="flex justify-between items-end w-full border-t border-black/5 pt-4">
                <div className="text-left space-y-0.5">
                  <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold font-oswald">Official Account</p>
                  <p className="text-[11px] font-bold text-black tracking-tight font-oswald">{config.socialHandle || "@daily_nasehat"}</p>
                </div>
                {config.footer && (
                  <div className="text-right space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold font-oswald">Reminder</p>
                    <p className="text-[11px] font-bold text-black tracking-tight font-oswald">{config.footer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Layer 5: Master Template Bottom Bar (Slanted Design matching SS 1) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-50 pointer-events-none">
           {/* Black Slanted Base - Bottom layer */}
           <div 
             className="absolute bottom-0 left-0 right-0 h-16 bg-black"
             style={{ clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)' }}
           />
           {/* Gold Slanted Bar - Top layer */}
           <div 
             className="absolute bottom-8 left-0 right-0 h-4 bg-[#C5A059]"
             style={{ clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)' }}
           />
        </div>

      </div>
    </div>
  );
}

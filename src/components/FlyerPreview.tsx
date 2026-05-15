'use client';

import React, { useRef, useMemo, useState } from 'react';
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
  const [activeGuides, setActiveGuides] = useState<{ x: boolean; y: boolean }>({ x: false, y: false });

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
    const tolerance = 15;
    let newX = config.elementPositions[element].x + info.offset.x;
    let newY = config.elementPositions[element].y + info.offset.y;

    // Smart Snapping to Center
    if (Math.abs(newX) < tolerance) newX = 0;
    if (Math.abs(newY) < tolerance) newY = 0;

    setConfig(prev => ({
      ...prev,
      elementPositions: {
        ...prev.elementPositions,
        [element]: { x: newX, y: newY }
      }
    }));
    setActiveGuides({ x: false, y: false });
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
        {/* Alignment Guides */}
        <AnimatePresence>
          {activeGuides.x && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#C5A059] z-[100] pointer-events-none" 
            />
          )}
          {activeGuides.y && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#C5A059] z-[100] pointer-events-none" 
            />
          )}
        </AnimatePresence>

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
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ 
              opacity: config.textureOpacity * config.textureIntensity,
              mixBlendMode: config.textureBlendMode,
              transform: `scale(${config.textureScale})`
            }}
          >
            {config.textureType === 'paper' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} />
            )}
            {config.textureType === 'grain' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")` }} />
            )}
            {config.textureType === 'dust' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} />
            )}
            {config.textureType === 'noise' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/white-diamond.png")` }} />
            )}
            {config.textureType === 'fiber' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/textured-paper.png")` }} />
            )}
            {config.textureType === 'matte' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")` }} />
            )}
            {config.textureType === 'canvas' && (
              <div className="absolute inset-0" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/linen-paper.png")` }} />
            )}
          </div>
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
                onDrag={(_, info) => {
                  const x = config.elementPositions.logo.x + info.offset.x;
                  const y = config.elementPositions.logo.y + info.offset.y;
                  setActiveGuides({ x: Math.abs(x) < 15, y: Math.abs(y) < 15 });
                }}
                onDragEnd={(_, info) => handleDragEnd('logo', info)}
                initial={config.elementPositions.logo}
                animate={{
                  x: config.elementPositions.logo.x,
                  y: config.elementPositions.logo.y,
                  scale: config.elementPositions.logo.scale,
                  rotate: config.elementPositions.logo.rotate
                }}
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
              onDrag={(_, info) => {
                const x = config.elementPositions.quote.x + info.offset.x;
                const y = config.elementPositions.quote.y + info.offset.y;
                setActiveGuides({ x: Math.abs(x) < 15, y: Math.abs(y) < 15 });
              }}
              onDragEnd={(_, info) => handleDragEnd('quote', info)}
              initial={config.elementPositions.quote}
              animate={{
                x: config.elementPositions.quote.x,
                y: config.elementPositions.quote.y,
                scale: config.elementPositions.quote.scale,
                rotate: config.elementPositions.quote.rotate
              }}
              className="flex-1 flex items-center justify-center w-full cursor-move z-55"
            >
              <div
                className={cn(
                  "text-black transition-all duration-300",
                  config.typography === 'serif' ? 'font-serif' : 'font-montserrat',
                  quoteFontSizeClass
                )}
                style={{ 
                  ...quoteFontSizeStyle,
                  lineHeight: config.quoteLineHeight,
                  letterSpacing: `${config.quoteLetterSpacing}em`,
                  maxWidth: `${config.quoteWidth}%`,
                  fontWeight: config.quoteFontWeight,
                  opacity: config.quoteOpacity,
                  textShadow: `${config.shadowDistance * Math.cos(config.shadowAngle * Math.PI / 180)}px ${config.shadowDistance * Math.sin(config.shadowAngle * Math.PI / 180)}px ${config.shadowBlur}px rgba(0,0,0,${config.shadowOpacity})`
                }}
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

        {/* Layer 5: Master Template Bottom Bar (Slanted Design Variations) */}
        {config.showFrame && (
          <div className="absolute bottom-0 left-0 right-0 h-24 z-50 pointer-events-none" style={{ opacity: config.frameOpacity }}>
             {config.frameStyle === 'standard' && (
               <>
                 <div className="absolute bottom-0 left-0 right-0 h-16 bg-black" style={{ clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)' }} />
                 <div className="absolute bottom-8 left-0 right-0 h-4" style={{ backgroundColor: config.frameColor, clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)' }} />
               </>
             )}
             
             {config.frameStyle === 'double' && (
               <>
                 <div className="absolute bottom-0 left-0 right-0 h-12 bg-black" style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }} />
                 <div className="absolute bottom-12 left-0 right-0 h-4" style={{ backgroundColor: config.frameColor, clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }} />
                 <div className="absolute bottom-16 left-0 right-0 h-8 bg-black/80" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)' }} />
               </>
             )}

             {config.frameStyle === 'minimal' && (
               <div className="absolute bottom-4 left-12 right-12 h-1.5 rounded-full opacity-60" style={{ background: `linear-gradient(to right, transparent, ${config.frameColor}, transparent)` }} />
             )}

             {config.frameStyle === 'ribbon' && (
               <div className="absolute bottom-0 left-0 right-0 h-20">
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-black" style={{ clipPath: 'polygon(0 0, 50% 30%, 100% 0, 100% 100%, 0 100%)' }} />
                  <div className="absolute bottom-10 left-0 right-0 h-2" style={{ backgroundColor: config.frameColor, clipPath: 'polygon(0 0, 50% 30%, 100% 0, 100% 100%, 0 100%)' }} />
               </div>
             )}

             {config.frameStyle === 'glow' && (
               <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center">
                  <div className="h-[2px] w-3/4 rounded-full blur-[2px]" style={{ backgroundColor: config.frameColor, boxShadow: `0 0 20px 5px ${config.frameColor}` }} />
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}

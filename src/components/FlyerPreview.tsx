'use client';

import React, { useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Camera, Send, Twitter, ChevronRight } from 'lucide-react';
import { FlyerConfig, FONTS, BACKGROUND_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FlyerPreviewProps {
  config: FlyerConfig;
  setConfig: (updates: Partial<FlyerConfig> | ((prev: FlyerConfig) => FlyerConfig), skipHistory?: boolean) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function FlyerPreview({ config, setConfig, previewRef }: FlyerPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeGuides, setActiveGuides] = useState<{ x: boolean; y: boolean }>({ x: false, y: false });

  // Aspect Ratio Logic
  const canvasDimensions = useMemo(() => {
    if (config.aspectRatio === 'custom' && config.customDimensions) {
      return { width: config.customDimensions.width, height: config.customDimensions.height };
    }
    const preset = ASPECT_RATIO_PRESETS.find((p: any) => p.id === config.aspectRatio) || ASPECT_RATIO_PRESETS[1];
    return { width: preset.width, height: preset.height };
  }, [config.aspectRatio, config.customDimensions]);

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

  const WatermarkLayer = () => {
    if (!config.watermark.enabled) return null;
    
    const positions = {
      'top-left': 'top-8 left-8',
      'top-right': 'top-8 right-8',
      'bottom-left': 'bottom-8 left-8',
      'bottom-right': 'bottom-8 right-8',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    };

    return (
      <div 
        className={cn("absolute z-[100] pointer-events-none transition-all duration-500", positions[config.watermark.position])}
        style={{ opacity: config.watermark.opacity, transform: `scale(${config.watermark.scale})` }}
      >
        {config.watermark.logo ? (
          <img src={config.watermark.logo} alt="Watermark" className="w-24 h-auto object-contain grayscale" />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">NASEHATGEN</span>
            <span className="text-[8px] font-bold text-black/20 mt-1 uppercase tracking-widest">Creator Studio Pro</span>
          </div>
        )}
      </div>
    );
  };

  const SafeAreaOverlay = () => {
    if (!config.showSafeArea) return null;
    
    return (
      <div className="absolute inset-0 z-[90] pointer-events-none">
        {/* TikTok / Reels Safe Areas */}
        {config.aspectRatio === '9:16' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-32 bg-red-500/10 border-b border-red-500/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">Story Top Safe Area</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-red-500/10 border-t border-red-500/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">UI Controls Safe Area</span>
            </div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-red-500/5 border-l border-red-500/10" />
          </>
        )}
        {/* Instagram Post Safe Areas */}
        {config.aspectRatio === '4:5' && (
          <div className="absolute inset-4 border border-blue-500/20 rounded-xl bg-blue-500/5 flex items-start justify-center pt-2">
            <span className="text-[8px] font-bold text-blue-500/40 uppercase tracking-widest">Safe Area Layout</span>
          </div>
        )}
      </div>
    );
  };

  const SocialMediaPreview = () => {
    if (config.previewMode === 'none') return null;

    return (
      <div className="absolute inset-0 z-[110] pointer-events-none overflow-hidden">
        {config.previewMode === 'instagram' && (
          <div className="flex flex-col h-full bg-black/20 backdrop-blur-[2px]">
            {/* IG Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-black border-2 border-transparent" />
                </div>
                <span className="text-white text-xs font-bold tracking-tight">your_dakwah_account</span>
              </div>
              <div className="flex gap-4 text-white">
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
            
            {/* IG Footer Interaction */}
            <div className="mt-auto p-4 bg-gradient-to-t from-black/80 to-transparent space-y-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex gap-4">
                   <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center"><div className="w-3 h-2 bg-white rounded-sm" /></div>
                   <div className="w-6 h-6 border-2 border-white rounded-full" />
                   <Send size={22} className="-rotate-12" />
                </div>
                <div className="w-6 h-6 border-2 border-white rounded-sm" />
              </div>
              <div className="space-y-1">
                <p className="text-white text-[11px] font-bold">1,234 likes</p>
                <p className="text-white text-[10px]"><span className="font-bold">your_dakwah_account</span> Mari berbagi kebaikan...</p>
                <p className="text-white/40 text-[9px] uppercase font-bold tracking-wider pt-1">2 HOURS AGO</p>
              </div>
            </div>
          </div>
        )}

        {config.previewMode === 'tiktok' && (
          <div className="flex flex-col h-full">
            {/* TikTok Sidebar */}
            <div className="absolute right-3 bottom-32 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-neutral-800 border-2 border-white overflow-hidden shadow-xl" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] flex items-center justify-center text-white text-[10px] font-bold">+</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center text-white"><span className="text-3xl">❤️</span></div>
                <span className="text-white text-[10px] font-bold shadow-sm">15.2K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center text-white"><span className="text-2xl">💬</span></div>
                <span className="text-white text-[10px] font-bold shadow-sm">458</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center text-white"><span className="text-2xl">🔖</span></div>
                <span className="text-white text-[10px] font-bold shadow-sm">2.4K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center text-white"><span className="text-2xl">🔄</span></div>
                <span className="text-white text-[10px] font-bold shadow-sm">842</span>
              </div>
            </div>
            
            {/* TikTok Description Area */}
            <div className="mt-auto p-4 bg-gradient-to-t from-black/60 to-transparent space-y-2 pb-12">
               <p className="text-white text-xs font-bold">@nasehat.daily</p>
               <p className="text-white text-[11px] leading-relaxed max-w-[80%]">Self reminder untuk kita semua hari ini. Semoga bermanfaat! ✨ #dakwah #islamicquotes #hijrah</p>
               <div className="flex items-center gap-2">
                 <span className="text-white text-[10px]">♫</span>
                 <p className="text-white text-[10px] tracking-tight">Original Sound - Nasehat Daily</p>
               </div>
            </div>
          </div>
        )}

        {config.previewMode === 'whatsapp' && (
          <div className="flex flex-col h-full bg-black/10">
             {/* WhatsApp Top Status Bar */}
             <div className="flex gap-1 px-2 pt-2">
               <div className="flex-1 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                 <div className="w-[70%] h-full bg-white" />
               </div>
               <div className="flex-1 h-[2.5px] bg-white/40 rounded-full" />
             </div>
             
             <div className="flex items-center justify-between p-4 pt-2">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/20" />
                 <div className="flex flex-col">
                   <span className="text-white text-sm font-bold tracking-tight">Status Saya</span>
                   <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">34 menit yang lalu</span>
                 </div>
               </div>
               <div className="flex gap-4 text-white/80">
                 <div className="w-1 h-1 rounded-full bg-white" />
                 <div className="w-1 h-1 rounded-full bg-white" />
                 <div className="w-1 h-1 rounded-full bg-white" />
               </div>
             </div>

             <div className="mt-auto p-8 flex flex-col items-center gap-2 bg-gradient-to-t from-black/40 to-transparent">
               <div className="text-white opacity-60"><ChevronRight size={24} className="-rotate-90" /></div>
               <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">Balas</span>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-full p-4 md:p-12 perspective-1000">
      <motion.div 
        id="flyer-container"
        ref={(el) => {
          // @ts-ignore
          previewRef.current = el;
          // @ts-ignore
          containerRef.current = el;
        }}
        initial={false}
        animate={{
          width: canvasDimensions.width / 2,
          height: canvasDimensions.height / 2,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={cn(
          "relative overflow-hidden bg-white select-none origin-center",
          "shadow-[0_40px_100px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
        )}
        style={{
           maxHeight: '85vh',
           maxWidth: '85vw',
        }}
      >
        <SafeAreaOverlay />
        <WatermarkLayer />
        <SocialMediaPreview />
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

      </motion.div>
    </div>
  );
}

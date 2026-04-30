'use client';

import React, { useState, useRef } from 'react';
import Controls from '@/components/Controls';
import FlyerPreview from '@/components/FlyerPreview';
import { FlyerConfig, BACKGROUND_PRESETS } from '@/lib/constants';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_CONFIG: FlyerConfig = {
  headline: 'ADAB BERTEMAN',
  quote: '"Seseorang itu bergantung pada agama temannya. Maka hendaknya salah seorang dari kalian melihat siapa yang ia jadikan teman."',
  source: 'Hadits Riwayat Tirmidzi & Abu Dawud',
  footer: 'SEMOGA BERMANFAAT',
  socialHandle: '@daily_nasehat',
  logo: null,
  
  typography: 'serif',
  textAlign: 'center',
  
  backgroundMode: 'preset',
  bgPresetId: 'mosque-1',
  customBg: null,
  
  overlayOpacity: 0.6,
  gradientOverlay: true,
  blurEffect: false,
  
  showTexture: true,
  showContentBox: false,
  accentColor: '#D4AF37',
};

export default function Page() {
  const [config, setConfig] = useState<FlyerConfig>(INITIAL_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!flyerRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure any pending renders are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(flyerRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350,
        style: {
          transform: 'scale(1)',
          width: '1080px',
          height: '1350px',
          maxWidth: 'none',
          maxHeight: 'none',
        }
      });
      
      const link = document.createElement('a');
      link.download = `nasehat-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-[#0a0a0a] text-neutral-200">
      {/* Left Sidebar - Fixed width */}
      <div className="w-full md:w-80 flex-shrink-0 z-10 border-r border-neutral-800 relative">
        <Controls 
          config={config} 
          setConfig={setConfig} 
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>

      {/* Main Preview Area - Flexible content */}
      <div className="flex-1 relative overflow-auto bg-[#0f0f0f] flex flex-col items-center justify-center min-h-0">
        <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold">Preview Mode: Instagram Portrait (4:5)</div>
        
        {/* Subtle background ambient light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div 
            key="preview-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 relative"
          >
            <FlyerPreview config={config} previewRef={flyerRef} />
          </motion.div>
        </AnimatePresence>

        {/* Floating Tooltip */}
        <div className="fixed bottom-8 right-8 z-20 pointer-events-none hidden lg:block">
          <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4 animate-bounce">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">!</div>
            <div>
              <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Preview Active</p>
              <p className="text-[10px] text-zinc-500 font-medium">Auto-scaled for display. Exports at 1080x1350.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .pattern-grid {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .pattern-dots {
          background-image: radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </main>
  );
}

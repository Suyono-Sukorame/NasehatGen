'use client';

import React, { useState, useRef, useEffect } from 'react';
import Controls from '@/components/Controls';
import FlyerPreview from '@/components/FlyerPreview';
import { FlyerConfig, BACKGROUND_PRESETS } from '@/lib/constants';
import { toPng, toBlob, toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { useHistory } from '@/hooks/useHistory';
import { jsPDF } from 'jspdf';
import { ASPECT_RATIO_PRESETS } from '@/lib/constants';

const INITIAL_CONFIG: FlyerConfig = {
// ... same initial config as before ...
  headline: 'ADAB BERTEMAN',
  quote: '"Seseorang itu bergantung pada agama temannya. Maka hendaknya salah seorang dari kalian melihat siapa yang ia jadikan teman."',
  source: 'Hadits Riwayat Tirmidzi & Abu Dawud',
  footer: 'SEMOGA BERMANFAAT',
  socialHandle: '@daily_nasehat',
  logo: null,
  
  typography: 'serif',
  textAlign: 'center',
  
  aspectRatio: '4:5',
  showSafeArea: false,
  previewMode: 'none',

  backgroundMode: 'preset',
  bgPresetId: 'mosque-1',
  customBg: null,
  
  overlayOpacity: 0.6,
  gradientOverlay: true,
  blurEffect: false,
  blurAmount: 10,
  bgFilter: 'none',
  
  showTexture: true,
  textureType: 'paper',
  textureOpacity: 0.05,
  textureIntensity: 0.5,
  textureBlendMode: 'multiply',
  textureScale: 1,

  showContentBox: false,
  accentColor: '#C5A059',
  
  quoteFontSize: 0, 
  quoteLineHeight: 1.5,
  quoteLetterSpacing: 0,
  quoteWidth: 85,
  quoteFontWeight: 500,
  quoteOpacity: 1,

  frameStyle: 'standard',
  frameColor: '#C5A059',
  frameOpacity: 1,
  frameSize: 1,
  frameRotation: 0,
  showFrame: true,

  shadowSoftness: 8,
  shadowBlur: 10,
  shadowDistance: 2,
  shadowOpacity: 0.15,
  shadowAngle: 45,
  shadowColor: '#000000',

  watermark: {
    enabled: false,
    logo: null,
    opacity: 0.3,
    position: 'bottom-right',
    scale: 1,
  },

  exportSettings: {
    format: 'png',
    quality: 0.9,
    scale: 2,
    dpi: 72,
  },

  elementPositions: {
    quote: { x: 0, y: 0, scale: 1, rotate: 0 },
    logo: { x: 0, y: 0, scale: 1, rotate: 0 },
  },
};

export default function Page() {
  const { state: config, setState: setConfig, undo, redo, canUndo, canRedo } = useHistory<FlyerConfig>(INITIAL_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'Saving...' | 'Saved' | 'Restored Draft' | null>(null);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  // Auto Save Logic
  useEffect(() => {
    const saved = localStorage.getItem('nasehatgen_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new fields exist in restored draft
        const merged = { ...INITIAL_CONFIG, ...parsed };
        setConfig(merged, true);
        setSaveStatus('Restored Draft');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, []); // Only on mount

  useEffect(() => {
    if (config === INITIAL_CONFIG) return;
    setSaveStatus('Saving...');
    const timeout = setTimeout(() => {
      localStorage.setItem('nasehatgen_draft', JSON.stringify(config));
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(prev => prev === 'Saved' ? null : prev), 2000);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [config]);

  const handleExport = async () => {
    if (!flyerRef.current) return;
    
    setIsExporting(true);
    const { format, quality, scale } = config.exportSettings;
    const preset = ASPECT_RATIO_PRESETS.find(p => p.id === config.aspectRatio) || ASPECT_RATIO_PRESETS[1];
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Visual feedback delay

      const exportOptions = {
        cacheBust: true,
        width: preset.width * (format === 'pdf' ? 1 : scale),
        height: preset.height * (format === 'pdf' ? 1 : scale),
        quality: quality,
        style: {
          transform: `scale(${format === 'pdf' ? 1 : scale})`,
          transformOrigin: 'top left',
          width: `${preset.width}px`,
          height: `${preset.height}px`,
        }
      };

      if (format === 'pdf') {
        const dataUrl = await toPng(flyerRef.current, exportOptions);
        const pdf = new jsPDF({
          orientation: preset.width > preset.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [preset.width, preset.height]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, preset.width, preset.height);
        pdf.save(`nasehat-${Date.now()}.pdf`);
      } else if (format === 'jpg') {
        const dataUrl = await toJpeg(flyerRef.current, exportOptions);
        const link = document.createElement('a');
        link.download = `nasehat-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await toPng(flyerRef.current, exportOptions);
        const link = document.createElement('a');
        link.download = `nasehat-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!flyerRef.current) return;
    
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const blob = await toBlob(flyerRef.current, {
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

      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-[#0a0a0a] text-neutral-200 selection:bg-[#C5A059]/30">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 flex-shrink-0 z-10 border-r border-neutral-800 relative shadow-2xl">
        <Controls 
          config={config} 
          setConfig={setConfig} 
          onExport={handleExport}
          onCopy={handleCopyToClipboard}
          isExporting={isExporting}
          history={{ undo, redo, canUndo, canRedo }}
          saveStatus={saveStatus}
        />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative overflow-auto bg-[#0d0d0d] flex flex-col items-center justify-center min-h-0 pattern-dots">
        {/* Top Status Bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 z-20">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Live Preview</span>
           </div>
           <div className="w-[1px] h-3 bg-white/10" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">1080 x 1350</span>
        </div>

        {/* Ambient Background Lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div 
            key="preview-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="z-10 relative"
          >
            <FlyerPreview config={config} setConfig={setConfig} previewRef={flyerRef} />
          </motion.div>
        </AnimatePresence>

        {/* Success Toasts */}
        <AnimatePresence>
          {copyStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#C5A059] text-white px-6 py-3 rounded-2xl shadow-2xl shadow-[#C5A059]/40 flex items-center gap-3 font-black uppercase tracking-widest text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              Copied to Clipboard
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .pattern-dots {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>
    </main>
  );
}

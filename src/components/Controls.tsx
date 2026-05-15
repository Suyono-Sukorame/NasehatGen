'use client';

import React, { useState } from 'react';
import { 
  Settings2, 
  Type, 
  Image as ImageIcon, 
  Layout, 
  Sparkles, 
  Download,
  Plus,
  Undo2,
  Maximize,
  Share2,
  ChevronRight
} from 'lucide-react';
import { 
  FlyerConfig, 
  PRESETS, 
  ASPECT_RATIO_PRESETS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { generateNasehatAction, rewriteNasehatAction } from '@/lib/actions/ai';
import ImageCropper from './ImageCropper';

// Modular Tab Components
import CanvasTab from './tabs/CanvasTab';
import QuickEditTab from './tabs/QuickEditTab';
import DesignTab from './tabs/DesignTab';
import BackdropTab from './tabs/BackdropTab';
import VisualFXTab from './tabs/VisualFXTab';
import BrandingTab from './tabs/BrandingTab';
import ExportTab from './tabs/ExportTab';

interface ControlsProps {
  config: FlyerConfig;
  setConfig: (updates: Partial<FlyerConfig> | ((prev: FlyerConfig) => FlyerConfig), skipHistory?: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExport: () => void;
  onCopy: () => void;
  isExporting: boolean;
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
  saveStatus: 'Saving...' | 'Saved' | 'Restored Draft' | null;
}

const TABS = [
  { id: 'canvas', label: 'Canvas', icon: Maximize },
  { id: 'content', label: 'Quick Edit', icon: Type },
  { id: 'style', label: 'Design', icon: Settings2 },
  { id: 'background', label: 'Backdrop', icon: ImageIcon },
  { id: 'fx', label: 'Visual FX', icon: Sparkles },
  { id: 'branding', label: 'Branding', icon: Share2 },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'presets', label: 'Presets', icon: Layout },
];

export default function Controls({ 
  config, 
  setConfig, 
  activeTab,
  setActiveTab,
  onExport, 
  onCopy,
  isExporting, 
  history, 
  saveStatus 
}: ControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const updateConfig = (updates: Partial<FlyerConfig> | ((prev: FlyerConfig) => FlyerConfig), skipHistory?: boolean) => {
    setConfig(updates, skipHistory);
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateNasehatAction();
      if (result) {
        updateConfig({
          headline: result.headline,
          quote: result.quote,
          source: result.source
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async (tone: 'Tegas' | 'Lembut' | 'Motivasi') => {
    setIsGenerating(true);
    try {
      const rewritten = await rewriteNasehatAction(config.quote, tone);
      if (rewritten) {
        updateConfig({ quote: rewritten });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const onDropBackground = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropperImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDropWatermark = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateConfig({ watermark: { ...config.watermark, logo: e.target?.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (cropData: any) => {
    updateConfig({ 
      customBg: cropperImage,
      bgCrop: cropData,
      backgroundMode: 'custom'
    });
    setCropperImage(null);
  };

  return (
    <div className="w-[450px] bg-black border-l border-white/5 flex flex-col h-screen relative z-50 shadow-2xl">
      {/* Header Studio */}
      <div className="p-8 pb-4 border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black tracking-[0.3em] text-white uppercase">NasehatGen <span className="text-[#C5A059]">Pro</span></h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Creator Studio v2.0</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex bg-neutral-900 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={history.undo} 
                  disabled={!history.canUndo}
                  className="p-2 text-neutral-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Undo2 size={16} />
                </button>
                <button 
                  onClick={history.redo} 
                  disabled={!history.canRedo}
                  className="p-2 text-neutral-500 hover:text-white disabled:opacity-30 transition-colors rotate-180"
                >
                  <Undo2 size={16} />
                </button>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
              )}
            >
              <tab.icon size={14} strokeWidth={3} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32 scroll-smooth">
        {activeTab === 'canvas' && <CanvasTab config={config} updateConfig={updateConfig} />}
        {activeTab === 'content' && (
          <QuickEditTab 
            config={config} 
            updateConfig={updateConfig} 
            onAiGenerate={handleAiGenerate}
            onRewrite={handleRewrite}
            isGenerating={isGenerating}
          />
        )}
        {activeTab === 'style' && <DesignTab config={config} updateConfig={updateConfig} />}
        {activeTab === 'background' && <BackdropTab config={config} updateConfig={updateConfig} onDropBackground={onDropBackground} />}
        {activeTab === 'fx' && <VisualFXTab config={config} updateConfig={updateConfig} />}
        {activeTab === 'branding' && <BrandingTab config={config} updateConfig={updateConfig} onDropWatermark={onDropWatermark} />}
        {activeTab === 'export' && <ExportTab config={config} updateConfig={updateConfig} />}
        
        {activeTab === 'presets' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateConfig(preset.config)}
                className="group relative h-32 rounded-[24px] overflow-hidden border border-white/5 transition-all hover:border-[#C5A059]/50 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className={cn("absolute inset-0 bg-neutral-900 group-hover:scale-110 transition-transform duration-700", preset.previewColor)} />
                <div className="absolute bottom-6 left-6 z-20 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-1">{preset.category || 'Standard'}</p>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{preset.name}</h4>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-24 left-0 right-0 px-8 pointer-events-none">
        <AnimatePresence>
          {saveStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-neutral-900/80 backdrop-blur-md border border-white/5 py-2 px-4 rounded-full flex items-center gap-3 w-fit shadow-xl"
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                saveStatus === 'Saving...' ? "bg-yellow-500" : "bg-green-500"
              )} />
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{saveStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Export Dock */}
      <div className="p-8 bg-gradient-to-t from-black to-transparent sticky bottom-0 z-30">
        <button 
          onClick={onExport}
          disabled={isExporting}
          className="w-full h-14 bg-gradient-to-r from-[#C5A059] to-[#8B703C] hover:scale-[1.02] active:scale-[0.98] text-white rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl shadow-[#C5A059]/30 disabled:opacity-50 disabled:grayscale group"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-black">Rendering {config.exportSettings.format.toUpperCase()}...</span>
            </>
          ) : (
            <>
              <Download size={20} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Export as {config.exportSettings.format.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {cropperImage && (
          <ImageCropper 
            image={cropperImage} 
            aspectRatio={(ASPECT_RATIO_PRESETS.find(p => p.id === config.aspectRatio) || ASPECT_RATIO_PRESETS[1]).width / (ASPECT_RATIO_PRESETS.find(p => p.id === config.aspectRatio) || ASPECT_RATIO_PRESETS[1]).height}
            onCrop={handleCropComplete}
            onClose={() => setCropperImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

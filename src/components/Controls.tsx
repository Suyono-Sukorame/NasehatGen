'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { 
  Settings2, 
  Type, 
  Image as ImageIcon, 
  Layout, 
  Sparkles, 
  Download,
  AlignCenter,
  AlignLeft,
  ChevronRight,
  Plus,
  Trash2,
  Undo2
} from 'lucide-react';
import { 
  FlyerConfig, 
  TypographyStyle, 
  Alignment, 
  PRESETS, 
  BACKGROUND_PRESETS 
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { generateNasehatAction, rewriteNasehatAction } from '@/lib/actions/ai';

interface ControlsProps {
  config: FlyerConfig;
  setConfig: React.Dispatch<React.SetStateAction<FlyerConfig>>;
  onExport: () => void;
  isExporting: boolean;
}

const TABS = [
  { id: 'content', label: 'Quick Edit', icon: Type },
  { id: 'style', label: 'Design', icon: Settings2 },
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'fx', label: 'Visual FX', icon: Sparkles },
  { id: 'presets', label: 'Presets', icon: Layout },
];

const TYPOGRAPHY_PRESETS = [
  { id: 'elegant', label: 'Elegant', config: { typography: 'serif', quoteFontWeight: 400, quoteLineHeight: 1.8, quoteLetterSpacing: 0.05 } },
  { id: 'minimal', label: 'Minimal', config: { typography: 'sans', quoteFontWeight: 300, quoteLineHeight: 1.4, quoteLetterSpacing: -0.02 } },
  { id: 'bold', label: 'Bold Dakwah', config: { typography: 'display', quoteFontWeight: 800, quoteLineHeight: 1.2, quoteLetterSpacing: -0.01 } },
  { id: 'cinematic', label: 'Cinematic', config: { typography: 'serif', quoteFontWeight: 500, quoteLineHeight: 1.6, quoteLetterSpacing: 0.1 } },
  { id: 'modern', label: 'Modern Islamic', config: { typography: 'sans', quoteFontWeight: 600, quoteLineHeight: 1.5, quoteLetterSpacing: 0 } },
] as const;

const SHADOW_PRESETS = [
  { id: 'soft', label: 'Soft Readable', config: { shadowBlur: 10, shadowDistance: 2, shadowOpacity: 0.15, shadowAngle: 45 } },
  { id: 'glow', label: 'Cinematic Glow', config: { shadowBlur: 25, shadowDistance: 0, shadowOpacity: 0.4, shadowAngle: 0 } },
  { id: 'strong', label: 'Strong Contrast', config: { shadowBlur: 4, shadowDistance: 4, shadowOpacity: 0.6, shadowAngle: 45 } },
  { id: 'depth', label: 'Elegant Depth', config: { shadowBlur: 15, shadowDistance: 8, shadowOpacity: 0.2, shadowAngle: 90 } },
] as const;

export default function Controls({ config, setConfig, onExport, isExporting }: ControlsProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [isGenerating, setIsGenerating] = useState(false);

  const onDropLogo = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateConfig({ logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDropBg = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateConfig({ backgroundMode: 'custom', customBg: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({ 
    onDrop: onDropLogo,
    accept: { 'image/*': [] },
    multiple: false
  });

  const { getRootProps: getBgProps, getInputProps: getBgInputProps } = useDropzone({ 
    onDrop: onDropBg,
    accept: { 'image/*': [] },
    multiple: false
  });

  const updateConfig = (updates: Partial<FlyerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateNasehatAction();
      if (data.headline && data.quote && data.source) {
        updateConfig({
          headline: data.headline,
          quote: data.quote,
          source: data.source
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async (tone: 'Tegas' | 'Lembut' | 'Motivasi') => {
    setIsGenerating(true);
    try {
      const text = await rewriteNasehatAction(config.quote, tone);
      if (text) {
        updateConfig({ quote: text });
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShuffleBackground = () => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_PRESETS.length);
    const bg = BACKGROUND_PRESETS[randomIndex];
    updateConfig({ backgroundMode: 'preset', bgPresetId: bg.id });
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] text-neutral-200">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-[#121212] sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center shrink-0">
            <span className="text-[#121212] font-bold text-xl">N</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Nasehat<span className="text-[#d4af37]">Gen</span>
          </h1>
        </div>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Islamic Advice Generator</p>
      </div>

      {/* Tabs */}
      <div className="flex px-3 py-3 border-b border-neutral-800 gap-1 overflow-x-auto scrollbar-hide bg-[#121212]">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
                isActive 
                  ? "bg-[#d4af37] text-[#121212]" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
              )}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Text Content</h3>
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-[#d4af37] border border-[#d4af37]/30 bg-[#d4af37]/5 px-3 py-1.5 rounded hover:bg-[#d4af37]/10 transition-colors disabled:opacity-50"
              >
                <Sparkles size={11} />
                {isGenerating ? "Wait..." : "AI Generate"}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Main Title</label>
                <input 
                  type="text" 
                  value={config.headline}
                  onChange={(e) => updateConfig({ headline: e.target.value })}
                  placeholder="e.g. ADAB BERTEMAN"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:border-[#d4af37] outline-none text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Quote Text</label>
                <textarea 
                  rows={5}
                  value={config.quote}
                  onChange={(e) => updateConfig({ quote: e.target.value })}
                  placeholder="Paste your nasehat text here..."
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:border-[#d4af37] outline-none text-sm resize-none transition-colors"
                />
                <div className="flex gap-1.5">
                  {(['Tegas', 'Lembut', 'Motivasi'] as const).map(tone => (
                    <button
                      key={tone}
                      onClick={() => handleRewrite(tone)}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded hover:text-neutral-200 hover:border-neutral-500 transition-colors"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Source / Reference</label>
                <input 
                  type="text" 
                  value={config.source}
                  onChange={(e) => updateConfig({ source: e.target.value })}
                  placeholder="e.g. HR. Bukhari & Muslim"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:border-[#d4af37] outline-none text-sm transition-colors"
                />
              </div>
            </div>

            {/* Quick Background Section */}
            <div className="pt-6 space-y-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Quick Background</h3>
                <button 
                  onClick={handleShuffleBackground}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-neutral-400 hover:text-white transition-colors"
                >
                  <Undo2 size={11} className="rotate-180" />
                  Shuffle
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_PRESETS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => updateConfig({ backgroundMode: 'preset', bgPresetId: bg.id })}
                    className={cn(
                      "relative aspect-square rounded overflow-hidden border-2 transition-all group",
                      config.bgPresetId === bg.id && config.backgroundMode === 'preset'
                        ? "border-[#d4af37]" 
                        : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={bg.url} alt={bg.name} fill className="object-cover" unoptimized />
                  </button>
                ))}
                <button
                  {...getBgProps()}
                  className="aspect-square rounded border-2 border-dashed border-neutral-800 flex items-center justify-center bg-neutral-900/50 hover:border-neutral-600 transition-colors"
                >
                  <input {...getBgInputProps()} />
                  <Plus size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="pt-6 space-y-4 border-t border-neutral-800">
              <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Branding Logo</label>
              <div 
                {...getLogoProps()} 
                className="w-full p-4 border border-neutral-800 rounded bg-neutral-900/50 flex items-center justify-center gap-3 cursor-pointer hover:border-neutral-700 transition-colors"
              >
                <input {...getLogoInputProps()} />
                {config.logo ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative w-8 h-8 shrink-0">
                      <Image src={config.logo} alt="Logo Preview" fill className="object-contain" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-neutral-500 truncate flex-1">Logo set</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateConfig({ logo: null }); }}
                      className="p-1 text-neutral-600 hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={14} className="text-neutral-600" />
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Upload Logo</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Advanced Typography Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Professional Typography</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {TYPOGRAPHY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => updateConfig(preset.config)}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-[#C5A059]/50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-500 group-hover:text-white transition-colors">Aa</div>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-neutral-600 group-hover:text-neutral-400">{preset.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6 bg-neutral-900/30 p-5 rounded-2xl border border-white/5">
                <div className="space-y-4">
                  <SliderControl label="Font Size" value={config.quoteFontSize === 0 ? 'Auto' : `${config.quoteFontSize}px`} min={0} max={120} step={2} currentValue={config.quoteFontSize} onChange={(v: number) => updateConfig({ quoteFontSize: v })} />
                  <SliderControl label="Line Height" value={config.quoteLineHeight} min={1} max={2.5} step={0.1} currentValue={config.quoteLineHeight} onChange={(v: number) => updateConfig({ quoteLineHeight: v })} />
                  <SliderControl label="Letter Spacing" value={config.quoteLetterSpacing} min={-0.1} max={0.3} step={0.01} currentValue={config.quoteLetterSpacing} onChange={(v: number) => updateConfig({ quoteLetterSpacing: v })} />
                  <SliderControl label="Text Width" value={`${config.quoteWidth}%`} min={50} max={100} step={1} currentValue={config.quoteWidth} onChange={(v: number) => updateConfig({ quoteWidth: v })} />
                  <SliderControl label="Font Weight" value={config.quoteFontWeight} min={300} max={900} step={100} currentValue={config.quoteFontWeight} onChange={(v: number) => updateConfig({ quoteFontWeight: v })} />
                  <SliderControl label="Opacity" value={`${Math.round(config.quoteOpacity * 100)}%`} min={0} max={1} step={0.05} currentValue={config.quoteOpacity} onChange={(v: number) => updateConfig({ quoteOpacity: v })} />
                </div>
              </div>
            </div>

            {/* Smart Shadow Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Shadow Engine</h3>
              
              <div className="grid grid-cols-4 gap-2">
                {SHADOW_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => updateConfig(preset.config)}
                    className="py-3 rounded-xl bg-neutral-900/50 border border-white/5 text-[8px] font-black uppercase tracking-widest text-neutral-500 hover:text-white hover:border-[#C5A059]/30 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-neutral-900/30 p-5 rounded-2xl border border-white/5">
                <SliderControl label="Blur" value={config.shadowBlur} min={0} max={50} step={1} currentValue={config.shadowBlur} onChange={(v: number) => updateConfig({ shadowBlur: v })} />
                <SliderControl label="Distance" value={config.shadowDistance} min={0} max={20} step={1} currentValue={config.shadowDistance} onChange={(v: number) => updateConfig({ shadowDistance: v })} />
                <SliderControl label="Opacity" value={config.shadowOpacity} min={0} max={1} step={0.05} currentValue={config.shadowOpacity} onChange={(v: number) => updateConfig({ shadowOpacity: v })} />
                <SliderControl label="Angle" value={`${config.shadowAngle}°`} min={0} max={360} step={1} currentValue={config.shadowAngle} onChange={(v: number) => updateConfig({ shadowAngle: v })} />
              </div>
            </div>

            {/* Frame Variations Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Style Frame</h3>
                <button 
                  onClick={() => updateConfig({ showFrame: !config.showFrame })}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    config.showFrame ? "bg-[#C5A059]" : "bg-neutral-800"
                  )}
                >
                  <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", config.showFrame ? "left-6" : "left-1")} />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {([
                  { id: 'standard', label: 'STD' },
                  { id: 'double', label: 'DBL' },
                  { id: 'minimal', label: 'MIN' },
                  { id: 'ribbon', label: 'RBN' },
                  { id: 'glow', label: 'GLW' }
                ] as const).map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateConfig({ frameStyle: style.id })}
                    className={cn(
                      "aspect-square rounded-xl border flex items-center justify-center text-[9px] font-black transition-all",
                      config.frameStyle === style.id 
                        ? "bg-[#C5A059] text-white border-transparent shadow-lg shadow-[#C5A059]/20" 
                        : "bg-neutral-900 border-white/5 text-neutral-600 hover:text-neutral-400 hover:border-white/10"
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 items-center bg-neutral-900/30 p-5 rounded-2xl border border-white/5">
                 <div className="flex-1 space-y-4">
                    <SliderControl label="Frame Size" value={config.frameSize} min={0.5} max={2} step={0.1} currentValue={config.frameSize} onChange={(v: number) => updateConfig({ frameSize: v })} />
                    <SliderControl label="Opacity" value={config.frameOpacity} min={0} max={1} step={0.1} currentValue={config.frameOpacity} onChange={(v: number) => updateConfig({ frameOpacity: v })} />
                 </div>
                 <div className="w-[1px] h-12 bg-white/5" />
                 <button 
                   onClick={() => updateConfig({ frameColor: config.frameColor === '#C5A059' ? '#FFFFFF' : '#C5A059' })}
                   className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                   style={{ backgroundColor: config.frameColor }}
                 />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fx' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Texture System</h3>
              
              <div className="grid grid-cols-4 gap-2">
                {([
                  { id: 'paper', label: 'Paper' },
                  { id: 'grain', label: 'Film Grain' },
                  { id: 'dust', label: 'Subtle Dust' },
                  { id: 'noise', label: 'Soft Noise' },
                  { id: 'fiber', label: 'Vintage' },
                  { id: 'matte', label: 'Matte' },
                  { id: 'canvas', label: 'Canvas' },
                  { id: 'none', label: 'Off' }
                ] as const).map(tex => (
                  <button
                    key={tex.id}
                    onClick={() => updateConfig({ textureType: tex.id, showTexture: tex.id !== 'none' })}
                    className={cn(
                      "px-2 py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all",
                      config.textureType === tex.id 
                        ? "bg-[#C5A059] text-white border-transparent" 
                        : "bg-neutral-900 text-neutral-500 border-white/5 hover:border-white/20"
                    )}
                  >
                    {tex.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6 bg-neutral-900/30 p-6 rounded-2xl border border-white/5">
                <SliderControl label="Texture Opacity" value={config.textureOpacity} min={0} max={0.2} step={0.01} currentValue={config.textureOpacity} onChange={(v: number) => updateConfig({ textureOpacity: v })} />
                <SliderControl label="Intensity" value={config.textureIntensity} min={0} max={2} step={0.1} currentValue={config.textureIntensity} onChange={(v: number) => updateConfig({ textureIntensity: v })} />
                <SliderControl label="Scale" value={config.textureScale} min={0.5} max={2} step={0.1} currentValue={config.textureScale} onChange={(v: number) => updateConfig({ textureScale: v })} />
                
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-1">Blend Mode</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['multiply', 'screen', 'overlay', 'soft-light'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateConfig({ textureBlendMode: mode })}
                        className={cn(
                          "py-2 text-[7px] font-black uppercase border rounded-lg transition-all",
                          config.textureBlendMode === mode ? "bg-white text-black border-transparent" : "border-white/5 text-neutral-500 hover:text-white"
                        )}
                      >
                        {mode.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-6 border-t border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Atmospheric Filters</h3>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'none', label: 'Raw Lens' },
                  { id: 'grayscale', label: 'Noir' },
                  { id: 'sepia', label: 'Classic' },
                  { id: 'darken', label: 'Moody' }
                ] as const).map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => updateConfig({ bgFilter: filter.id })}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                      config.bgFilter === filter.id 
                        ? "bg-neutral-800 text-white border-[#C5A059]/50" 
                        : "bg-neutral-900 text-neutral-500 border-white/5 hover:border-white/20"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Studio Backdrops</h3>
              <div className="grid grid-cols-2 gap-4">
                {BACKGROUND_PRESETS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => updateConfig({ backgroundMode: 'preset', bgPresetId: bg.id })}
                    className={cn(
                      "relative aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all group",
                      config.bgPresetId === bg.id && config.backgroundMode === 'preset'
                        ? "border-[#C5A059] shadow-xl shadow-[#C5A059]/20" 
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                    )}
                  >
                    <Image src={bg.url} alt={bg.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 z-10">
                      <span className="text-[8px] text-white font-black uppercase tracking-widest">{bg.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 space-y-6 border-t border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Custom Backdrop</h3>
              <div 
                {...getBgProps()} 
                className={cn(
                  "w-full aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                  config.backgroundMode === 'custom' ? "border-[#C5A059] bg-[#C5A059]/5" : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                )}
              >
                <input {...getBgInputProps()} />
                {config.customBg ? (
                  <div className="relative w-full h-full group overflow-hidden rounded-xl">
                    <Image src={config.customBg} alt="Custom Background" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
                      <p className="text-[10px] text-white font-black uppercase tracking-[0.3em]">Update Stage</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={24} className="text-neutral-700" />
                    <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Import Custom Stage</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Visual Templates</h3>
            <div className="grid grid-cols-1 gap-4">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => updateConfig(preset.config)}
                  className="flex items-center gap-5 p-5 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-[#C5A059]/50 hover:bg-neutral-800/50 transition-all text-left group shadow-sm hover:shadow-xl"
                >
                  <div className={cn("w-12 h-12 rounded-xl shrink-0 shadow-inner ring-1 ring-white/10 transition-transform group-hover:scale-110", preset.previewColor)} />
                  <div className="flex-1">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-white group-hover:text-[#C5A059] transition-colors">{preset.name}</h4>
                    <p className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mt-1.5 opacity-60">
                      {preset.config.typography} Layout • {preset.config.textAlign}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-700 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
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
              <span className="text-[10px] uppercase tracking-[0.25em] font-black">Rendering Studio Quality...</span>
            </>
          ) : (
            <>
              <Download size={20} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Export Studio Flyer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Helper Slider Component for Clean Code
function SliderControl({ label, value, min, max, step, currentValue, onChange }: { 
  label: string; 
  value: string | number; 
  min: number; 
  max: number; 
  step: number; 
  currentValue: number; 
  onChange: (v: number) => void; 
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center px-1">
        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{label}</label>
        <span className="text-[9px] font-black text-neutral-400 bg-white/5 px-2 py-0.5 rounded-lg">{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step}
        value={currentValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-[#C5A059] hover:accent-[#e0bb6c] transition-all"
      />
    </div>
  );
}

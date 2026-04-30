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
  { id: 'content', label: 'Content', icon: Type },
  { id: 'style', label: 'Design', icon: Settings2 },
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'presets', label: 'Presets', icon: Layout },
];

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

            <div className="space-y-4">
              <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Logo Upload</label>
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

            <div className="pt-6 space-y-4 border-t border-neutral-800">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Extra Details</h3>
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Social Handle</label>
                <input 
                  type="text" 
                  value={config.socialHandle}
                  onChange={(e) => updateConfig({ socialHandle: e.target.value })}
                  placeholder="@dailynasehat"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:border-[#d4af37] outline-none text-sm transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Footer Caption</label>
                <input 
                  type="text" 
                  value={config.footer}
                  onChange={(e) => updateConfig({ footer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:border-[#d4af37] outline-none text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Typography</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['serif', 'sans', 'display'] as TypographyStyle[]).map(style => (
                  <button
                    key={style}
                    onClick={() => updateConfig({ typography: style })}
                    className={cn(
                      "px-3 py-4 rounded border text-center transition-all",
                      config.typography === style 
                        ? "border-[#d4af37] bg-neutral-800 text-[#d4af37]" 
                        : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
                    )}
                  >
                    <span className={cn(
                      "text-xl block mb-1",
                      style === 'serif' ? 'font-serif' : style === 'sans' ? 'font-sans' : 'font-display'
                    )}>Aa</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">{style}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Text Alignment</h3>
              <div className="flex gap-2">
                {(['left', 'center'] as Alignment[]).map(align => (
                  <button
                    key={align}
                    onClick={() => updateConfig({ textAlign: align })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded border transition-all text-[11px] font-bold uppercase tracking-widest",
                      config.textAlign === align 
                        ? "border-[#d4af37] bg-neutral-800 text-[#d4af37]" 
                        : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
                    )}
                  >
                    {align === 'center' ? <AlignCenter size={14} /> : <AlignLeft size={14} />}
                    <span>{align}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Accent Color</h3>
              <div className="flex flex-wrap gap-2">
                {['#D4AF37', '#BFA100', '#FFFFFF', '#94A3B8', '#10B981'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateConfig({ accentColor: color })}
                    style={{ backgroundColor: color }}
                    className={cn(
                      "w-8 h-8 rounded shrink-0 transition-transform hover:scale-110",
                      config.accentColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212]" : ""
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Backdrop Presets</h3>
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUND_PRESETS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => updateConfig({ backgroundMode: 'preset', bgPresetId: bg.id })}
                    className={cn(
                      "relative aspect-[4/5] rounded overflow-hidden border-2 transition-all group",
                      config.bgPresetId === bg.id && config.backgroundMode === 'preset'
                        ? "border-[#d4af37]" 
                        : "border-neutral-800 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={bg.url} alt={bg.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 z-10">
                      <span className="text-[8px] text-white font-bold uppercase">{bg.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Custom Background</h3>
              <div 
                {...getBgProps()} 
                className={cn(
                  "w-full aspect-video border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                  config.backgroundMode === 'custom' ? "border-[#d4af37] bg-[#d4af37]/5" : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                )}
              >
                <input {...getBgInputProps()} />
                {config.customBg ? (
                  <div className="relative w-full h-full group overflow-hidden">
                    <Image src={config.customBg} alt="Custom Background" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <p className="text-[10px] text-white font-bold uppercase tracking-widest">Change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={20} className="text-neutral-700" />
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Upload Custom</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-neutral-800">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Overlays & Effects</h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Opacity</label>
                    <span className="text-[10px] font-mono text-neutral-500">{Math.round(config.overlayOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="0.9" 
                    step="0.05"
                    value={config.overlayOpacity}
                    onChange={(e) => updateConfig({ overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => updateConfig({ gradientOverlay: !config.gradientOverlay })}
                    className={cn(
                      "p-3 rounded border text-[10px] font-bold uppercase tracking-widest transition-all",
                      config.gradientOverlay ? "bg-neutral-800 text-[#d4af37] border-[#d4af37]" : "bg-neutral-900 text-neutral-500 border-neutral-800"
                    )}
                  >
                    Gradient Fade
                  </button>
                  <button 
                    onClick={() => updateConfig({ blurEffect: !config.blurEffect })}
                    className={cn(
                      "p-3 rounded border text-[10px] font-bold uppercase tracking-widest transition-all",
                      config.blurEffect ? "bg-neutral-800 text-[#d4af37] border-[#d4af37]" : "bg-neutral-900 text-neutral-500 border-neutral-800"
                    )}
                  >
                    Lens Blur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Templates</h3>
            <div className="grid grid-cols-1 gap-3">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => updateConfig(preset.config)}
                  className="flex items-center gap-4 p-4 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50 transition-all text-left group"
                >
                  <div className={cn("w-10 h-10 rounded shrink-0 shadow-inner ring-1 ring-white/10", preset.previewColor)} />
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">{preset.name}</h4>
                    <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">
                      {preset.config.typography} • {preset.config.textAlign}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-700 group-hover:text-[#d4af37] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Export */}
      <div className="p-6 bg-[#121212] border-t border-neutral-800 sticky bottom-0 z-30">
        <button 
          onClick={onExport}
          disabled={isExporting}
          className="w-full h-12 bg-[#d4af37] hover:bg-[#c4a030] text-[#121212] rounded font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest">Processing...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span className="text-xs uppercase tracking-[0.2em] font-black">Export Flyer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

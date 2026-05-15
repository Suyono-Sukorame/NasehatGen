'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { FlyerConfig, BACKGROUND_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SliderControl from '../ui/SliderControl';

interface BackdropTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
  onDropBackground: (acceptedFiles: File[]) => void;
}

export default function BackdropTab({ config, updateConfig, onDropBackground }: BackdropTabProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropBackground,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Background Mode Selection */}
      <div className="flex bg-neutral-900 rounded-[20px] p-1.5 border border-white/5">
        <button 
          onClick={() => updateConfig({ backgroundMode: 'preset' })}
          className={cn(
            "flex-1 py-3.5 rounded-[14px] text-[10px] font-black tracking-[0.2em] transition-all",
            config.backgroundMode === 'preset' ? "bg-[#C5A059] text-white shadow-lg" : "text-neutral-500"
          )}
        >
          PRESETS
        </button>
        <button 
          onClick={() => updateConfig({ backgroundMode: 'custom' })}
          className={cn(
            "flex-1 py-3.5 rounded-[14px] text-[10px] font-black tracking-[0.2em] transition-all",
            config.backgroundMode === 'custom' ? "bg-[#C5A059] text-white shadow-lg" : "text-neutral-500"
          )}
        >
          CUSTOM
        </button>
      </div>

      {config.backgroundMode === 'preset' ? (
        <div className="grid grid-cols-3 gap-3">
          {BACKGROUND_PRESETS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => updateConfig({ bgPresetId: bg.id })}
              className={cn(
                "relative aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all group",
                config.bgPresetId === bg.id ? "border-[#C5A059] scale-95 shadow-xl shadow-[#C5A059]/20" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={cn(
              "aspect-[4/5] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all cursor-pointer group overflow-hidden relative",
              isDragActive ? "border-[#C5A059] bg-[#C5A059]/5 scale-95" : "border-white/10 bg-neutral-900/50 hover:border-white/20"
            )}
          >
            <input {...getInputProps()} />
            {config.customBg ? (
              <>
                <img src={config.customBg} alt="Custom Background" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]" />
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                      <Plus className="text-white" size={20} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                  <ImageIcon className="text-neutral-500" size={24} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Drop High-Res Art</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-600">JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
          
          {config.customBg && (
             <button 
               onClick={() => updateConfig({ customBg: null })}
               className="w-full py-3 rounded-xl border border-red-500/10 text-red-500/50 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
             >
               <Trash2 size={12} />
               Remove Custom Art
             </button>
          )}
        </div>
      )}

      <div className="pt-8 border-t border-white/5 space-y-8">
        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Environmental Effects</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          <SliderControl 
            label="Overlay Density" value={`${Math.round(config.overlayOpacity * 100)}%`} min={0} max={1} step={0.05} 
            currentValue={config.overlayOpacity} onChange={(v) => updateConfig({ overlayOpacity: v })} 
          />
          <SliderControl 
            label="Blur Intensity" value={`${config.blurAmount}px`} min={0} max={40} step={1} 
            currentValue={config.blurAmount} onChange={(v) => updateConfig({ blurAmount: v, blurEffect: v > 0 })} 
          />
          
          <div className="space-y-4 col-span-2">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 ml-1">Color Grading</h4>
            <div className="grid grid-cols-4 gap-2">
              {(['none', 'grayscale', 'sepia', 'darken'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => updateConfig({ bgFilter: filter })}
                  className={cn(
                    "py-2 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all",
                    config.bgFilter === filter ? "bg-white text-black border-transparent" : "bg-neutral-900 border-white/5 text-neutral-500"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

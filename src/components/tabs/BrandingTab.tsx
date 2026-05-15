'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Share2, Trash2 } from 'lucide-react';
import { FlyerConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SliderControl from '../ui/SliderControl';

interface BrandingTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
  onDropWatermark: (acceptedFiles: File[]) => void;
}

export default function BrandingTab({ config, updateConfig, onDropWatermark }: BrandingTabProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropWatermark,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", config.watermark.enabled ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-neutral-800 text-neutral-600")}>
               <Share2 size={16} />
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Global Watermark</h3>
         </div>
         <div className={cn("w-10 h-5 rounded-full transition-all relative cursor-pointer", config.watermark.enabled ? "bg-[#C5A059]" : "bg-neutral-800")} onClick={() => updateConfig({ watermark: { ...config.watermark, enabled: !config.watermark.enabled } })}>
            <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", config.watermark.enabled ? "left-6" : "left-1")} />
         </div>
      </div>

      <div className="space-y-8">
         <div 
           {...getRootProps()} 
           className={cn(
             "h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all cursor-pointer group relative overflow-hidden",
             isDragActive ? "border-[#C5A059] bg-[#C5A059]/5" : "border-white/10 bg-neutral-900/50 hover:border-white/20"
           )}
         >
           <input {...getInputProps()} />
           {config.watermark.logo ? (
             <div className="flex items-center gap-4">
                <img src={config.watermark.logo} alt="Logo" className="w-12 h-12 object-contain grayscale opacity-50" />
                <div className="text-left">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Logo Active</p>
                   <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Click to swap</p>
                </div>
             </div>
           ) : (
             <>
               <Plus className="text-neutral-500 mb-2" size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Upload Brand Logo</p>
             </>
           )}
         </div>

         <div className="pt-8 border-t border-white/5 space-y-8">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 ml-1">Logo Placement</h4>
            <div className="grid grid-cols-5 gap-2">
               {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).map(pos => (
                  <button
                     key={pos}
                     onClick={() => updateConfig({ watermark: { ...config.watermark, position: pos } })}
                     className={cn(
                        "aspect-square rounded-xl border flex items-center justify-center transition-all",
                        config.watermark.position === pos ? "bg-white text-black border-transparent" : "bg-neutral-900 border-white/5 text-neutral-500"
                     )}
                  >
                     <div className={cn(
                        "w-2 h-2 rounded-full",
                        config.watermark.position === pos ? "bg-black" : "bg-neutral-700"
                     )} />
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
               <SliderControl 
                  label="Watermark Opacity" value={`${Math.round(config.watermark.opacity * 100)}%`} min={0} max={1} step={0.05} 
                  currentValue={config.watermark.opacity} onChange={(v) => updateConfig({ watermark: { ...config.watermark, opacity: v } })} 
               />
               <SliderControl 
                  label="Watermark Scale" value={`${config.watermark.scale.toFixed(1)}x`} min={0.2} max={3} step={0.1} 
                  currentValue={config.watermark.scale} onChange={(v) => updateConfig({ watermark: { ...config.watermark, scale: v } })} 
               />
            </div>
         </div>
      </div>
    </div>
  );
}

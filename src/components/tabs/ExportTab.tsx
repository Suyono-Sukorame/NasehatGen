'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { FlyerConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SliderControl from '../ui/SliderControl';

interface ExportTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
}

export default function ExportTab({ config, updateConfig }: ExportTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Export Strategy</h3>
          <div className="grid grid-cols-2 gap-3">
             {(['png', 'jpg', 'pdf', 'png-transparent'] as const).map(format => (
               <button
                 key={format}
                 onClick={() => updateConfig({ exportSettings: { ...config.exportSettings, format } })}
                 className={cn(
                   "p-4 rounded-2xl border text-left transition-all",
                   config.exportSettings.format === format ? "bg-white text-black border-transparent shadow-xl" : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-neutral-300"
                 )}
               >
                 <p className="text-[10px] font-black uppercase tracking-widest">{format.replace('-', ' ')}</p>
                 <p className="text-[7px] font-bold uppercase tracking-widest mt-1 opacity-60">
                   {format === 'png' && 'High Definition'}
                   {format === 'jpg' && 'Optimized Web'}
                   {format === 'pdf' && 'Print Ready'}
                   {format === 'png-transparent' && 'Logo/Overlay'}
                 </p>
               </button>
             ))}
          </div>
       </div>

       <div className="pt-8 border-t border-white/5 space-y-8">
          <div className="space-y-6">
             <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Precision Controls</h3>
             <SliderControl 
               label="Resolution Scale" 
               value={`${config.exportSettings.scale}x`} 
               min={1} max={4} step={1} 
               currentValue={config.exportSettings.scale} 
               onChange={(v) => updateConfig({ exportSettings: { ...config.exportSettings, scale: v } })} 
             />
             <SliderControl 
               label="Compression Quality" 
               value={`${Math.round(config.exportSettings.quality * 100)}%`} 
               min={0.1} max={1} step={0.05} 
               currentValue={config.exportSettings.quality} 
               onChange={(v) => updateConfig({ exportSettings: { ...config.exportSettings, quality: v } })} 
             />
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] space-y-3">
             <div className="flex items-center gap-3 text-blue-400">
                <Monitor size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Platform Suggestion</span>
             </div>
             <p className="text-[10px] text-neutral-400 leading-relaxed uppercase font-medium tracking-tight">
                {config.aspectRatio === '9:16' && 'Use 2x PNG for Instagram Stories to maintain crispness across all mobile screens.'}
                {config.aspectRatio === '1:1' && 'Use JPG at 85% for feed posts to balance loading speed and visual quality.'}
                {config.aspectRatio === 'A4' && 'Switch to PDF format for high-resolution vector-like printing at 300 DPI.'}
                {(!['9:16', '1:1', 'A4'].includes(config.aspectRatio)) && 'Use 2x PNG for most social media platforms to ensure HD clarity.'}
             </p>
          </div>
       </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { FlyerConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SliderControl from '../ui/SliderControl';

interface VisualFXTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
}

export default function VisualFXTab({ config, updateConfig }: VisualFXTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", config.showTexture ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-neutral-800 text-neutral-600")}>
               <Sparkles size={16} />
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Texture Overlay</h3>
         </div>
         <div className={cn("w-10 h-5 rounded-full transition-all relative cursor-pointer", config.showTexture ? "bg-[#C5A059]" : "bg-neutral-800")} onClick={() => updateConfig({ showTexture: !config.showTexture })}>
            <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", config.showTexture ? "left-6" : "left-1")} />
         </div>
      </div>

      <div className="space-y-8 opacity-100 transition-opacity disabled:opacity-30">
         <div className="grid grid-cols-2 gap-3">
            {(['paper', 'grain', 'dust', 'noise', 'fiber', 'matte', 'canvas'] as const).map(type => (
               <button
                  key={type}
                  disabled={!config.showTexture}
                  onClick={() => updateConfig({ textureType: type })}
                  className={cn(
                     "p-4 rounded-2xl border text-left transition-all",
                     config.textureType === type ? "bg-white text-black border-transparent shadow-xl" : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-neutral-300"
                  )}
               >
                  <p className="text-[10px] font-black uppercase tracking-widest">{type}</p>
               </button>
            ))}
         </div>

         <div className="pt-8 border-t border-white/5 space-y-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
               <SliderControl 
                  label="Texture Opacity" value={`${Math.round(config.textureOpacity * 100)}%`} min={0} max={0.2} step={0.01} 
                  currentValue={config.textureOpacity} onChange={(v) => updateConfig({ textureOpacity: v })} 
               />
               <SliderControl 
                  label="Texture Scale" value={`${config.textureScale.toFixed(1)}x`} min={0.5} max={3} step={0.1} 
                  currentValue={config.textureScale} onChange={(v) => updateConfig({ textureScale: v })} 
               />
            </div>

            <div className="space-y-4">
               <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 ml-1">Blend Mode</h4>
               <div className="grid grid-cols-3 gap-2">
                  {(['multiply', 'screen', 'overlay', 'soft-light'] as const).map(mode => (
                     <button
                        key={mode}
                        disabled={!config.showTexture}
                        onClick={() => updateConfig({ textureBlendMode: mode })}
                        className={cn(
                           "py-2 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all",
                           config.textureBlendMode === mode ? "bg-white text-black border-transparent" : "bg-neutral-900 border-white/5 text-neutral-500"
                        )}
                     >
                        {mode.replace('-', ' ')}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

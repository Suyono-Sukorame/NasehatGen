'use client';

import React from 'react';
import { Maximize, Plus, ShieldCheck, Smartphone } from 'lucide-react';
import { FlyerConfig, ASPECT_RATIO_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import StudioCard from '../ui/StudioCard';

interface CanvasTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
}

export default function CanvasTab({ config, updateConfig }: CanvasTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Categorized Aspect Ratios */}
      {['Social Feed', 'Vertical', 'Print', 'Banner'].map(cat => (
        <div key={cat} className="space-y-4">
          <h3 className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-black ml-1">{cat}</h3>
          <div className="grid grid-cols-2 gap-3">
            {ASPECT_RATIO_PRESETS.filter(p => p.category === cat).map((preset, idx) => {
              const isActive = config.aspectRatio === preset.id && (preset.id !== 'custom' || (config.customDimensions?.width === preset.width));
              return (
                <button
                  key={`${preset.id}-${idx}`}
                  onClick={() => updateConfig({ 
                    aspectRatio: preset.id,
                    customDimensions: preset.id === 'custom' ? { width: preset.width, height: preset.height } : undefined
                  })}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                    isActive 
                      ? "bg-[#C5A059] border-transparent shadow-lg shadow-[#C5A059]/20" 
                      : "bg-neutral-900 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg mb-3 flex items-center justify-center transition-colors",
                    isActive ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-500 group-hover:text-neutral-300"
                  )}>
                    {preset.category === 'Print' ? <Plus size={16} /> : <Maximize size={16} />}
                  </div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-white" : "text-neutral-300")}>{preset.label}</p>
                  <p className={cn("text-[8px] font-bold uppercase tracking-widest mt-1", isActive ? "text-white/60" : "text-neutral-600")}>{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-8 border-t border-white/5 space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Creator Overlays</h3>
        <div className="space-y-4">
          <button 
            onClick={() => updateConfig({ showSafeArea: !config.showSafeArea })}
            className="w-full flex items-center justify-between p-4 bg-neutral-900/50 border border-white/5 rounded-2xl group transition-all hover:bg-neutral-900"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl transition-colors", config.showSafeArea ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-neutral-800 text-neutral-600")}>
                <ShieldCheck size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Safe Area Guidelines</span>
            </div>
            <div className={cn("w-10 h-5 rounded-full transition-all relative", config.showSafeArea ? "bg-[#C5A059]" : "bg-neutral-800")}>
              <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", config.showSafeArea ? "left-6" : "left-1")} />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {(['instagram', 'tiktok', 'whatsapp'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => updateConfig({ previewMode: config.previewMode === mode ? 'none' : mode })}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                  config.previewMode === mode ? "bg-white text-black border-transparent" : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-neutral-300"
                )}
              >
                <Smartphone size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{mode} Preview</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

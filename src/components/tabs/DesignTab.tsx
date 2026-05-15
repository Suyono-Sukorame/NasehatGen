'use client';

import React from 'react';
import { AlignCenter, AlignLeft, Layers } from 'lucide-react';
import { FlyerConfig, TYPOGRAPHY_PRESETS, SHADOW_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SliderControl from '../ui/SliderControl';
import StudioCard from '../ui/StudioCard';

interface DesignTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
}

export default function DesignTab({ config, updateConfig }: DesignTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Typography Presets */}
      <div className="space-y-4">
        <h3 className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-black ml-1">Typography Suites</h3>
        <div className="grid grid-cols-2 gap-3">
          {TYPOGRAPHY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => updateConfig(preset.config)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                (config.typography === preset.config.typography && config.quoteFontWeight === preset.config.quoteFontWeight) 
                  ? "bg-[#C5A059] border-transparent shadow-lg shadow-[#C5A059]/20" 
                  : "bg-neutral-900 border-white/5 hover:border-white/10"
              )}
            >
              <p className={cn("text-[10px] font-black uppercase tracking-widest", (config.typography === preset.config.typography && config.quoteFontWeight === preset.config.quoteFontWeight) ? "text-white" : "text-neutral-300")}>{preset.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-8">
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Advanced Text Controls</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">Alignment</label>
              <div className="flex bg-neutral-900 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => updateConfig({ textAlign: 'left' })}
                  className={cn("flex-1 py-2 rounded-lg flex items-center justify-center transition-all", config.textAlign === 'left' ? "bg-neutral-800 text-[#C5A059]" : "text-neutral-600")}
                >
                  <AlignLeft size={16} />
                </button>
                <button 
                  onClick={() => updateConfig({ textAlign: 'center' })}
                  className={cn("flex-1 py-2 rounded-lg flex items-center justify-center transition-all", config.textAlign === 'center' ? "bg-neutral-800 text-[#C5A059]" : "text-neutral-600")}
                >
                  <AlignCenter size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">Typeface</label>
              <div className="flex bg-neutral-900 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => updateConfig({ typography: 'serif' })}
                  className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold transition-all", config.typography === 'serif' ? "bg-neutral-800 text-[#C5A059]" : "text-neutral-600")}
                >
                  SERIF
                </button>
                <button 
                  onClick={() => updateConfig({ typography: 'sans' })}
                  className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold transition-all", config.typography === 'sans' ? "bg-neutral-800 text-[#C5A059]" : "text-neutral-600")}
                >
                  SANS
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <SliderControl 
               label="Font Size" value={`${config.quoteFontSize || 'Auto'}`} min={0} max={120} step={1} 
               currentValue={config.quoteFontSize} onChange={(v) => updateConfig({ quoteFontSize: v })} 
             />
             <SliderControl 
               label="Line Height" value={config.quoteLineHeight.toFixed(1)} min={1} max={2.5} step={0.1} 
               currentValue={config.quoteLineHeight} onChange={(v) => updateConfig({ quoteLineHeight: v })} 
             />
             <SliderControl 
               label="Letter Spacing" value={config.quoteLetterSpacing.toFixed(2)} min={-0.1} max={0.5} step={0.01} 
               currentValue={config.quoteLetterSpacing} onChange={(v) => updateConfig({ quoteLetterSpacing: v })} 
             />
             <SliderControl 
               label="Paragraph Width" value={`${config.quoteWidth}%`} min={50} max={100} step={1} 
               currentValue={config.quoteWidth} onChange={(v) => updateConfig({ quoteWidth: v })} 
             />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Shadow & Depth</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
             {SHADOW_PRESETS.map(preset => (
               <button
                 key={preset.id}
                 onClick={() => updateConfig(preset.config)}
                 className={cn(
                   "p-3 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all",
                   config.shadowBlur === preset.config.shadowBlur ? "bg-white text-black border-transparent shadow-md" : "bg-neutral-900 border-white/5 text-neutral-500"
                 )}
               >
                 {preset.label}
               </button>
             ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
             <SliderControl 
               label="Shadow Blur" value={config.shadowBlur} min={0} max={50} step={1} 
               currentValue={config.shadowBlur} onChange={(v) => updateConfig({ shadowBlur: v })} 
             />
             <SliderControl 
               label="Shadow Opacity" value={`${Math.round(config.shadowOpacity * 100)}%`} min={0} max={1} step={0.05} 
               currentValue={config.shadowOpacity} onChange={(v) => updateConfig({ shadowOpacity: v })} 
             />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Frame Variations</h3>
              <div className={cn("w-8 h-4 rounded-full transition-all relative cursor-pointer", config.showFrame ? "bg-[#C5A059]" : "bg-neutral-800")} onClick={() => updateConfig({ showFrame: !config.showFrame })}>
                <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all", config.showFrame ? "left-4.5" : "left-0.5")} />
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-2">
              {(['standard', 'double', 'minimal', 'ribbon', 'glow'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => updateConfig({ frameStyle: style })}
                  className={cn(
                    "py-2.5 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all",
                    config.frameStyle === style ? "bg-[#C5A059] border-transparent text-white" : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-neutral-300"
                  )}
                >
                  {style}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

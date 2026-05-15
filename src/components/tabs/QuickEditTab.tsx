'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { FlyerConfig } from '@/lib/constants';
import StudioCard from '../ui/StudioCard';

interface QuickEditTabProps {
  config: FlyerConfig;
  updateConfig: (updates: Partial<FlyerConfig>) => void;
  onAiGenerate: () => void;
  onRewrite: (tone: 'Tegas' | 'Lembut' | 'Motivasi') => void;
  isGenerating: boolean;
}

export default function QuickEditTab({ 
  config, 
  updateConfig, 
  onAiGenerate, 
  onRewrite, 
  isGenerating 
}: QuickEditTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">Content Editor</h3>
          <button 
            onClick={onAiGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-white bg-gradient-to-r from-[#C5A059] to-[#8B703C] px-4 py-2 rounded-xl shadow-lg shadow-[#C5A059]/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles size={12} fill="currentColor" />
            {isGenerating ? "Crafting..." : "AI Generate"}
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">Main Headline</label>
            <input 
              type="text" 
              value={config.headline}
              onChange={(e) => updateConfig({ headline: e.target.value })}
              className="w-full px-5 py-3.5 bg-neutral-900/50 border border-white/5 rounded-2xl text-white focus:border-[#C5A059]/50 focus:ring-4 focus:ring-[#C5A059]/5 outline-none text-sm transition-all placeholder:text-neutral-700"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">The Advice (Quote)</label>
            <textarea 
              rows={5}
              value={config.quote}
              onChange={(e) => updateConfig({ quote: e.target.value })}
              className="w-full px-5 py-3.5 bg-neutral-900/50 border border-white/5 rounded-2xl text-white focus:border-[#C5A059]/50 focus:ring-4 focus:ring-[#C5A059]/5 outline-none text-sm resize-none transition-all placeholder:text-neutral-700 leading-relaxed"
            />
            <div className="flex gap-2">
              {(['Tegas', 'Lembut', 'Motivasi'] as const).map(tone => (
                <button
                  key={tone}
                  onClick={() => onRewrite(tone)}
                  className="flex-1 text-[9px] font-black uppercase tracking-wider py-2 bg-neutral-900 border border-white/5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">Source / Attribution</label>
              <input 
                type="text" 
                value={config.source}
                onChange={(e) => updateConfig({ source: e.target.value })}
                className="w-full px-5 py-3.5 bg-neutral-900/50 border border-white/5 rounded-2xl text-white focus:border-[#C5A059]/50 focus:ring-4 focus:ring-[#C5A059]/5 outline-none text-sm transition-all placeholder:text-neutral-700"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-1">Social Handle</label>
              <input 
                type="text" 
                value={config.socialHandle}
                onChange={(e) => updateConfig({ socialHandle: e.target.value })}
                className="w-full px-5 py-3.5 bg-neutral-900/50 border border-white/5 rounded-2xl text-white focus:border-[#C5A059]/50 focus:ring-4 focus:ring-[#C5A059]/5 outline-none text-sm transition-all placeholder:text-neutral-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

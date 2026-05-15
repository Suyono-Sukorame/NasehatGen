'use client';

import React from 'react';

interface SliderControlProps {
  label: string;
  value: string | number;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  onChange: (value: number) => void;
}

export default function SliderControl({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  currentValue, 
  onChange 
}: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{label}</label>
        <span className="text-[9px] font-mono text-neutral-300">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={currentValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-[#C5A059] transition-all hover:accent-[#e2b866]"
      />
    </div>
  );
}

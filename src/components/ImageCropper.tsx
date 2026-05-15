'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCropperProps {
  image: string;
  aspectRatio: number;
  onCrop: (cropData: { x: number, y: number, zoom: number, rotation: number }) => void;
  onClose: () => void;
}

export default function ImageCropper({ image, aspectRatio, onCrop, onClose }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleSave = () => {
    onCrop({ ...position, zoom, rotation });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh]"
      >
        {/* Preview Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden cursor-move group">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          {/* The Crop Mask */}
          <div 
            className="relative border-2 border-[#C5A059] shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 pointer-events-none"
            style={{ 
              aspectRatio: aspectRatio,
              width: '80%',
              maxHeight: '80%'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
               {[...Array(9)].map((_, i) => (
                 <div key={i} className="border-[0.5px] border-white/20" />
               ))}
            </div>
          </div>

          {/* Draggable Image */}
          <motion.div
            drag
            dragMomentum={false}
            onDrag={(_, info) => setPosition(p => ({ x: p.x + info.delta.x, y: p.y + info.delta.y }))}
            style={{ x: position.x, y: position.y, scale: zoom, rotate: rotation }}
            className="absolute z-0"
          >
            <img 
              src={image} 
              alt="To Crop" 
              className="max-w-none w-[600px] pointer-events-none select-none"
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 z-20">
             <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 text-white/60 hover:text-white transition-colors"><ZoomOut size={18} /></button>
             <input 
               type="range" min={0.5} max={3} step={0.1} value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))} 
               className="w-32 accent-[#C5A059]"
             />
             <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-2 text-white/60 hover:text-white transition-colors"><ZoomIn size={18} /></button>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-full md:w-80 p-8 flex flex-col justify-between border-l border-white/5 bg-neutral-900/50">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Adjust Backdrop</h2>
              <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Rotation</label>
                 <div className="flex items-center gap-4">
                   <input 
                     type="range" min={-180} max={180} step={1} value={rotation} 
                     onChange={(e) => setRotation(parseFloat(e.target.value))} 
                     className="flex-1 accent-[#C5A059]"
                   />
                   <span className="text-[10px] font-mono text-neutral-400 w-10">{rotation}°</span>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => { setZoom(1); setRotation(0); setPosition({ x: 0, y: 0 }); }}
                   className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-white/10 transition-all"
                 >
                   <RotateCcw size={12} /> Reset
                 </button>
                 <button 
                   onClick={() => setRotation(r => r + 90)}
                   className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-white/10 transition-all"
                 >
                   Rotate 90°
                 </button>
               </div>
            </div>

            <div className="p-5 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-2xl">
              <div className="flex items-center gap-3 text-[#C5A059]">
                 <Move size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Creator Tip</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-2 uppercase font-medium tracking-tight">Drag the image directly to adjust its focal point within the frame.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:bg-neutral-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-4 bg-gradient-to-r from-[#C5A059] to-[#8B703C] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

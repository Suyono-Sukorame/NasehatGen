'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StudioCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function StudioCard({ title, children, className, headerAction }: StudioCardProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-black">{title}</h3>}
          {headerAction}
        </div>
      )}
      <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 shadow-sm">
        {children}
      </div>
    </div>
  );
}

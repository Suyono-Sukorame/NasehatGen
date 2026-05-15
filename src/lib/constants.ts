export type TypographyStyle = 'serif' | 'sans' | 'display';
export type Alignment = 'left' | 'center';
export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | 'A4' | 'custom';
export type ExportFormat = 'png' | 'jpg' | 'pdf' | 'png-transparent';

export interface FlyerConfig {
  headline: string;
  quote: string;
  source: string;
  footer: string;
  socialHandle: string;
  logo: string | null;
  
  typography: TypographyStyle;
  textAlign: Alignment;
  
  // Layout & Canvas
  aspectRatio: AspectRatio;
  customDimensions?: { width: number, height: number };
  showSafeArea: boolean;
  previewMode: 'none' | 'instagram' | 'tiktok' | 'whatsapp';

  backgroundMode: 'preset' | 'custom';
  bgPresetId: string;
  customBg: string | null;
  bgCrop?: { x: number, y: number, zoom: number, rotation: number };
  
  overlayOpacity: number;
  gradientOverlay: boolean;
  blurEffect: boolean;
  blurAmount: number;
  bgFilter: 'none' | 'grayscale' | 'sepia' | 'darken';
  
  // Visual FX (Textures)
  showTexture: boolean;
  textureType: 'none' | 'paper' | 'grain' | 'dust' | 'noise' | 'fiber' | 'matte' | 'canvas';
  textureOpacity: number;
  textureIntensity: number;
  textureBlendMode: 'multiply' | 'screen' | 'overlay' | 'soft-light';
  textureScale: number;

  // Advanced Typography
  quoteFontSize: number;
  quoteLineHeight: number;
  quoteLetterSpacing: number;
  quoteWidth: number; // 0-100%
  quoteFontWeight: number; // 300-800
  quoteOpacity: number;

  // Decorative Frames
  frameStyle: 'standard' | 'double' | 'minimal' | 'ribbon' | 'glow';
  frameColor: string;
  frameOpacity: number;
  frameSize: number;
  frameRotation: number;
  showFrame: boolean;

  // Smart Shadow
  shadowSoftness: number;
  shadowBlur: number;
  shadowDistance: number;
  shadowOpacity: number;
  shadowAngle: number;
  shadowColor: string;

  // Branding & Watermark
  watermark: {
    enabled: boolean;
    logo: string | null;
    opacity: number;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    scale: number;
  };

  // Export Settings
  exportSettings: {
    format: ExportFormat;
    quality: number;
    scale: number; // 1x, 2x, etc
    dpi: number;
  };

  showContentBox: boolean;
  accentColor: string;
  
  elementPositions: {
    quote: { x: number; y: number; scale: number; rotate: number };
    logo: { x: number; y: number; scale: number; rotate: number };
  };
}

export const ASPECT_RATIO_PRESETS: { id: AspectRatio; label: string; width: number; height: number; description: string; category: string }[] = [
  // --- Social Media Feeds ---
  { id: '1:1', label: 'Instagram Square', width: 1080, height: 1080, description: 'Standard Post / Profile Grid', category: 'Social Feed' },
  { id: '4:5', label: 'Instagram Portrait', width: 1080, height: 1350, description: 'High-Impact Feed / Carousel', category: 'Social Feed' },
  { id: '16:9', label: 'Landscape', width: 1920, height: 1080, description: 'YouTube / Facebook / Twitter', category: 'Social Feed' },
  
  // --- Stories & Vertical Video ---
  { id: '9:16', label: 'Story / Reels', width: 1080, height: 1920, description: 'TikTok / IG Story / WA Status', category: 'Vertical' },
  
  // --- Professional Print (300 DPI) ---
  { id: 'A4', label: 'A4 Poster', width: 2480, height: 3508, description: 'International Standard Print', category: 'Print' },
  { id: 'custom', label: 'A5 Flyer', width: 1748, height: 2480, description: 'Compact Promotional Flyer', category: 'Print' },
  { id: 'custom', label: 'US Letter', width: 2550, height: 3300, description: 'Standard Document Size', category: 'Print' },
  
  // --- Digital Branding ---
  { id: 'custom', label: 'YouTube Thumb', width: 1280, height: 720, description: 'Video Preview Thumbnail', category: 'Banner' },
  { id: 'custom', label: 'FB Cover', width: 820, height: 312, description: 'Facebook Page Header', category: 'Banner' },
  { id: 'custom', label: 'Twitter Header', width: 1500, height: 500, description: 'Profile Header Banner', category: 'Banner' },
];

export const TYPOGRAPHY_PRESETS = [
  { id: 'elegant', label: 'Elegant', config: { typography: 'serif', quoteFontWeight: 400, quoteLineHeight: 1.8, quoteLetterSpacing: 0.05 } },
  { id: 'minimal', label: 'Minimal', config: { typography: 'sans', quoteFontWeight: 300, quoteLineHeight: 1.4, quoteLetterSpacing: -0.02 } },
  { id: 'bold', label: 'Bold Dakwah', config: { typography: 'display', quoteFontWeight: 800, quoteLineHeight: 1.2, quoteLetterSpacing: -0.01 } },
  { id: 'cinematic', label: 'Cinematic', config: { typography: 'serif', quoteFontWeight: 500, quoteLineHeight: 1.6, quoteLetterSpacing: 0.1 } },
  { id: 'modern', label: 'Modern Islamic', config: { typography: 'sans', quoteFontWeight: 600, quoteLineHeight: 1.5, quoteLetterSpacing: 0 } },
] as const;

export const SHADOW_PRESETS = [
  { id: 'soft', label: 'Soft Readable', config: { shadowBlur: 10, shadowDistance: 2, shadowOpacity: 0.15, shadowAngle: 45 } },
  { id: 'glow', label: 'Cinematic Glow', config: { shadowBlur: 25, shadowDistance: 0, shadowOpacity: 0.4, shadowAngle: 0 } },
  { id: 'strong', label: 'Strong Contrast', config: { shadowBlur: 4, shadowDistance: 4, shadowOpacity: 0.6, shadowAngle: 45 } },
  { id: 'depth', label: 'Elegant Depth', config: { shadowBlur: 15, shadowDistance: 8, shadowOpacity: 0.2, shadowAngle: 90 } },
] as const;

export interface PresetTemplate {
  id: string;
  name: string;
  config: Partial<FlyerConfig>;
  previewColor: string;
  category?: string;
}

export const FONTS = {
  oswald: 'font-oswald',
  montserrat: 'font-montserrat',
  serif: 'font-serif', // fallback
  sans: 'font-sans',   // fallback
  display: 'font-oswald',
};

export const PRESETS: PresetTemplate[] = [
  {
    id: 'elegant-dakwah',
    name: 'Elegant Dakwah',
    previewColor: 'bg-emerald-900',
    category: 'Elegant',
    config: {
      typography: 'serif',
      textAlign: 'center',
      overlayOpacity: 0.6,
      gradientOverlay: true,
      accentColor: '#C5A059', // Gold
      showContentBox: false,
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    previewColor: 'bg-gray-100',
    category: 'Clean',
    config: {
      typography: 'sans',
      textAlign: 'center',
      overlayOpacity: 0.1,
      gradientOverlay: false,
      accentColor: '#333333',
      showContentBox: true,
    }
  },
  {
    id: 'night-reflection',
    name: 'Night Reflection',
    previewColor: 'bg-slate-950',
    category: 'Dark',
    config: {
      typography: 'serif',
      textAlign: 'left',
      overlayOpacity: 0.7,
      gradientOverlay: true,
      accentColor: '#FFFFFF',
      showContentBox: false,
    }
  },
  {
    id: 'bold-reminder',
    name: 'Bold Reminder',
    previewColor: 'bg-black',
    category: 'Bold',
    config: {
      typography: 'display',
      textAlign: 'center',
      overlayOpacity: 0.8,
      gradientOverlay: false,
      accentColor: '#C5A059',
      showContentBox: false,
    }
  },
  {
    id: 'classic-islamic',
    name: 'Classic Islamic',
    previewColor: 'bg-amber-900',
    category: 'Classic',
    config: {
      typography: 'serif',
      textAlign: 'center',
      overlayOpacity: 0.5,
      gradientOverlay: true,
      accentColor: '#F5DEB3',
      showContentBox: false,
    }
  }
];

export const BACKGROUND_PRESETS = [
  {
    id: 'mosque-1',
    name: 'Mosque Interior',
    url: 'https://images.unsplash.com/photo-1542751110-976464539091?q=80&w=1080&h=1350&auto=format&fit=crop'
  },
  {
    id: 'mosque-2',
    name: 'Mosque Architecture',
    url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=1080&h=1350&auto=format&fit=crop'
  },
  {
    id: 'pattern-1',
    name: 'Islamic Pattern',
    url: 'https://images.unsplash.com/photo-1590076214667-c0f3c9693175?q=80&w=1080&h=1350&auto=format&fit=crop'
  },
  {
    id: 'night-1',
    name: 'Night Sky',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1080&h=1350&auto=format&fit=crop'
  },
  {
    id: 'gradient-dark',
    name: 'Gradient Dark',
    url: 'https://images.unsplash.com/photo-1614850523296-e8c041de83a4?q=80&w=1080&h=1350&auto=format&fit=crop'
  }
];

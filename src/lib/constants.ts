export type TypographyStyle = 'serif' | 'sans' | 'display';
export type Alignment = 'left' | 'center';

export interface FlyerConfig {
  headline: string;
  quote: string;
  source: string;
  footer: string;
  socialHandle: string;
  logo: string | null;
  
  typography: TypographyStyle;
  textAlign: Alignment;
  
  backgroundMode: 'preset' | 'custom';
  bgPresetId: string;
  customBg: string | null;
  
  overlayOpacity: number;
  gradientOverlay: boolean;
  blurEffect: boolean;
  blurAmount: number;
  bgFilter: 'none' | 'grayscale' | 'sepia' | 'darken';
  
  showTexture: boolean;
  showContentBox: boolean;
  accentColor: string;
  quoteFontSize: number;
  elementPositions: {
    quote: { x: number; y: number };
    logo: { x: number; y: number };
  };
}

export interface PresetTemplate {
  id: string;
  name: string;
  config: Partial<FlyerConfig>;
  previewColor: string;
}

export const FONTS = {
  serif: 'font-serif',
  sans: 'font-sans',
  display: 'font-display', // I'll map this to something bold in CSS
};

export const PRESETS: PresetTemplate[] = [
  {
    id: 'elegant-dakwah',
    name: 'Elegant Dakwah',
    previewColor: 'bg-emerald-900',
    config: {
      typography: 'serif',
      textAlign: 'center',
      overlayOpacity: 0.6,
      gradientOverlay: true,
      accentColor: '#D4AF37', // Gold
      showContentBox: false,
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    previewColor: 'bg-gray-100',
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
    config: {
      typography: 'display',
      textAlign: 'center',
      overlayOpacity: 0.8,
      gradientOverlay: false,
      accentColor: '#FFD700',
      showContentBox: false,
    }
  },
  {
    id: 'classic-islamic',
    name: 'Classic Islamic',
    previewColor: 'bg-amber-900',
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

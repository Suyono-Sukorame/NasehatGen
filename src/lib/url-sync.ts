import { FlyerConfig } from './constants';

export function serializeConfig(config: FlyerConfig, activeTab: string): string {
  const params = new URLSearchParams();
  
  // Basic content
  if (config.headline) params.set('h', config.headline);
  if (config.quote) params.set('q', config.quote);
  if (config.source) params.set('s', config.source);
  
  // Layout & Style
  params.set('ratio', config.aspectRatio);
  params.set('typo', config.typography);
  params.set('align', config.textAlign);
  params.set('size', config.quoteFontSize.toString());
  
  // Background
  params.set('bgMode', config.backgroundMode);
  if (config.backgroundMode === 'preset') params.set('bgId', config.bgPresetId);
  
  // Effects
  params.set('overlay', config.overlayOpacity.toString());
  if (config.showTexture) params.set('tex', config.textureType);
  
  // App state
  params.set('tab', activeTab);

  return params.toString();
}

export function deserializeConfig(searchParams: URLSearchParams, initialConfig: FlyerConfig): { config: FlyerConfig, activeTab: string } {
  const config = { ...initialConfig };
  
  // Helper to get string/number from params
  const getStr = (key: string) => searchParams.get(key);
  const getNum = (key: string) => {
    const v = searchParams.get(key);
    return v ? parseFloat(v) : null;
  };

  // Content
  const h = getStr('h'); if (h) config.headline = h;
  const q = getStr('q'); if (q) config.quote = q;
  const s = getStr('s'); if (s) config.source = s;

  // Layout
  const ratio = getStr('ratio'); if (ratio) config.aspectRatio = ratio as any;
  const typo = getStr('typo'); if (typo) config.typography = typo as any;
  const align = getStr('align'); if (align) config.textAlign = align as any;
  const size = getNum('size'); if (size !== null) config.quoteFontSize = size;

  // Background
  const bgMode = getStr('bgMode'); if (bgMode) config.backgroundMode = bgMode as any;
  const bgId = getStr('bgId'); if (bgId) config.bgPresetId = bgId;

  // Effects
  const overlay = getNum('overlay'); if (overlay !== null) config.overlayOpacity = overlay;
  const tex = getStr('tex'); if (tex) {
    config.showTexture = true;
    config.textureType = tex as any;
  }

  const activeTab = getStr('tab') || 'canvas';

  return { config, activeTab };
}

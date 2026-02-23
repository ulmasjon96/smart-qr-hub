import type { QRStyleOptions } from '@/lib/qr-data';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Upload } from 'lucide-react';

interface Props {
  options: QRStyleOptions;
  onChange: (options: QRStyleOptions) => void;
}

const dotStyles = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
const cornerSquareStyles = ['square', 'dot', 'extra-rounded'];
const cornerDotStyles = ['square', 'dot'];

const QRCustomizer = ({ options, onChange }: Props) => {
  const set = <K extends keyof QRStyleOptions>(key: K, val: QRStyleOptions[K]) =>
    onChange({ ...options, [key]: val });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('customLogo', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card p-5 space-y-5">
      <h3 className="text-sm font-medium text-muted-foreground">Customize Design</h3>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">QR Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={options.dotsColor}
              onChange={e => set('dotsColor', e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs text-muted-foreground font-mono">{options.dotsColor}</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={options.backgroundColor}
              onChange={e => set('backgroundColor', e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs text-muted-foreground font-mono">{options.backgroundColor}</span>
          </div>
        </div>
      </div>

      {/* Gradient toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">Use Gradient</label>
        <Switch checked={options.useGradient} onCheckedChange={v => set('useGradient', v)} />
      </div>
      {options.useGradient && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Color 1</label>
            <input
              type="color"
              value={options.gradientColor1}
              onChange={e => set('gradientColor1', e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Color 2</label>
            <input
              type="color"
              value={options.gradientColor2}
              onChange={e => set('gradientColor2', e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Dot style */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Dot Style</label>
        <div className="grid grid-cols-3 gap-1.5">
          {dotStyles.map(s => (
            <button
              key={s}
              onClick={() => set('dotsType', s)}
              className={`dot-style-btn ${options.dotsType === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Corner styles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Corner Square</label>
          <div className="space-y-1">
            {cornerSquareStyles.map(s => (
              <button
                key={s}
                onClick={() => set('cornersSquareType', s)}
                className={`dot-style-btn w-full ${options.cornersSquareType === s ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Corner Dot</label>
          <div className="space-y-1">
            {cornerDotStyles.map(s => (
              <button
                key={s}
                onClick={() => set('cornersDotType', s)}
                className={`dot-style-btn w-full ${options.cornersDotType === s ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <label className="text-xs text-muted-foreground block">Custom Logo</label>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/30 cursor-pointer hover:bg-secondary/70 transition-colors text-sm text-muted-foreground">
          <Upload className="w-4 h-4" />
          Upload Logo
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
        {options.customLogo && (
          <button
            onClick={() => set('customLogo', '')}
            className="text-xs text-destructive hover:underline"
          >
            Remove custom logo
          </button>
        )}

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Logo Size</label>
          <Slider
            value={[options.logoSize * 100]}
            onValueChange={([v]) => set('logoSize', v / 100)}
            min={15}
            max={45}
            step={1}
            className="py-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Round Logo</label>
          <Switch checked={options.roundLogo} onCheckedChange={v => set('roundLogo', v)} />
        </div>
      </div>
    </div>
  );
};

export default QRCustomizer;

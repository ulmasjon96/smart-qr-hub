import { useRef, useEffect, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRStyleOptions, QRType } from '@/lib/qr-data';
import { getDomain, getFaviconUrl } from '@/lib/qr-data';
import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  data: string;
  qrType: QRType;
  formData: Record<string, string>;
  options: QRStyleOptions;
  onSave: () => void;
}

function getLogoUrl(qrType: QRType, formData: Record<string, string>, customLogo: string): string {
  if (customLogo) return customLogo;
  if (qrType === 'url' && formData.url) {
    const domain = getDomain(formData.url);
    if (domain) return getFaviconUrl(domain);
  }
  return '';
}

function buildQROptions(data: string, options: QRStyleOptions, logoUrl: string, size: number) {
  const dotsOptions: any = {
    type: options.dotsType as any,
  };

  if (options.useGradient) {
    dotsOptions.gradient = {
      type: 'linear',
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: options.gradientColor1 },
        { offset: 1, color: options.gradientColor2 },
      ],
    };
  } else {
    dotsOptions.color = options.dotsColor;
  }

  return {
    width: size,
    height: size,
    data,
    dotsOptions,
    backgroundOptions: { color: options.backgroundColor },
    cornersSquareOptions: { type: options.cornersSquareType as any, color: options.dotsColor },
    cornersDotOptions: { type: options.cornersDotType as any, color: options.dotsColor },
    image: logoUrl || undefined,
    imageOptions: {
      crossOrigin: 'anonymous' as const,
      margin: 6,
      imageSize: options.logoSize,
      hideBackgroundDots: true,
    },
  };
}

const QRPreview = ({ data, qrType, formData, options, onSave }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const logoUrl = getLogoUrl(qrType, formData, options.customLogo);

  useEffect(() => {
    const opts = buildQROptions(data, options, logoUrl, 280);
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrRef.current.append(containerRef.current);
      }
    } else {
      qrRef.current.update(opts);
    }
  }, [data, options, logoUrl]);

  const handleDownload = useCallback((ext: 'png' | 'jpeg' | 'svg') => {
    if (!qrRef.current) return;
    // For high-res download, create a new instance at 1024px
    const opts = buildQROptions(data, options, logoUrl, 1024);
    const hiRes = new QRCodeStyling(opts);
    hiRes.download({ name: 'smart-qr-code', extension: ext });
  }, [data, options, logoUrl]);

  return (
    <div className="glass-card glow-border p-6 flex flex-col items-center gap-5">
      <h3 className="text-sm font-medium text-muted-foreground self-start">Preview</h3>

      <div className="bg-secondary/30 rounded-xl p-4 animate-float">
        <div ref={containerRef} className="[&>canvas]:rounded-lg" />
      </div>

      {/* Download buttons */}
      <div className="w-full space-y-3">
        <p className="text-xs text-muted-foreground text-center">Download your QR code</p>
        <div className="grid grid-cols-3 gap-2">
          {(['png', 'jpeg', 'svg'] as const).map(ext => (
            <Button
              key={ext}
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(ext)}
              className="gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {ext.toUpperCase()}
            </Button>
          ))}
        </div>
        <Button
          onClick={onSave}
          variant="outline"
          size="sm"
          className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Save className="w-3.5 h-3.5" />
          Save to History
        </Button>
      </div>
    </div>
  );
};

export default QRPreview;

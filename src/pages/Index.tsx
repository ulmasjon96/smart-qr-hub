import QRGenerator from '@/components/qr/QRGenerator';
import { QrCode, Palette, Download, Zap } from 'lucide-react';

const features = [
  { icon: QrCode, title: '9 QR Types', desc: 'URL, WiFi, vCard, events & more' },
  { icon: Palette, title: 'Full Customization', desc: 'Colors, gradients, dot styles, logos' },
  { icon: Download, title: 'Multiple Formats', desc: 'PNG, JPG, SVG in high resolution' },
  { icon: Zap, title: 'Instant Preview', desc: 'See changes as you type' },
];

const Index = () => (
  <main className="container py-8 space-y-10">
    {/* Hero */}
    <section className="text-center space-y-4 py-6">
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
        <span className="text-gradient">Smart QR</span> Code Generator
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto text-lg">
        Create beautiful, customizable QR codes for any purpose — free, fast, and no sign-up required.
      </p>
      <div className="flex flex-wrap justify-center gap-6 pt-2">
        {features.map(f => (
          <div key={f.title} className="flex items-center gap-2 text-sm text-muted-foreground">
            <f.icon className="w-4 h-4 text-primary" />
            <span>{f.title}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Generator */}
    <QRGenerator />
  </main>
);

export default Index;

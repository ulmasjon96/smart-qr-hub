import { QrCode } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border/20 mt-20">
    <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <QrCode className="w-4 h-4 text-primary" />
        <span className="font-display font-semibold text-foreground">SmartQR</span>
        <span>— Free QR Code Generator</span>
      </div>
      <p>© {new Date().getFullYear()} Smart QR Platform</p>
    </div>
  </footer>
);

export default Footer;

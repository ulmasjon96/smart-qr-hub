import { Globe, Type, Phone, Mail, Wifi, MapPin, Contact, Calendar, FileDown } from 'lucide-react';
import type { QRType } from '@/lib/qr-data';
import { qrTypes } from '@/lib/qr-data';

const iconMap: Record<string, React.ElementType> = {
  Globe, Type, Phone, Mail, Wifi, MapPin, Contact, Calendar, FileDown,
};

interface Props {
  type: QRType;
  onChange: (type: QRType) => void;
}

const QRTypeSelector = ({ type, onChange }: Props) => (
  <div className="glass-card p-4">
    <h3 className="text-sm font-medium text-muted-foreground mb-3">Select QR Type</h3>
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
      {qrTypes.map(qt => {
        const Icon = iconMap[qt.icon];
        return (
          <button
            key={qt.type}
            onClick={() => onChange(qt.type)}
            className={`qr-type-btn ${type === qt.type ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5 qr-type-icon text-muted-foreground" />
            <span className="text-xs font-medium text-foreground/80">{qt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default QRTypeSelector;

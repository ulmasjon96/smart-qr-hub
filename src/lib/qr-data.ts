export type QRType = 'url' | 'text' | 'phone' | 'email' | 'wifi' | 'location' | 'vcard' | 'event' | 'file';

export interface QRStyleOptions {
  dotsColor: string;
  backgroundColor: string;
  dotsType: string;
  cornersSquareType: string;
  cornersDotType: string;
  useGradient: boolean;
  gradientColor1: string;
  gradientColor2: string;
  logoSize: number;
  roundLogo: boolean;
  customLogo: string;
}

export const defaultStyleOptions: QRStyleOptions = {
  dotsColor: '#00c2d1',
  backgroundColor: '#0d1321',
  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',
  useGradient: false,
  gradientColor1: '#00c2d1',
  gradientColor2: '#2dd4a8',
  logoSize: 0.35,
  roundLogo: true,
  customLogo: '',
};

export const qrTypes: { type: QRType; label: string; icon: string }[] = [
  { type: 'url', label: 'URL', icon: 'Globe' },
  { type: 'text', label: 'Text', icon: 'Type' },
  { type: 'phone', label: 'Phone', icon: 'Phone' },
  { type: 'email', label: 'Email', icon: 'Mail' },
  { type: 'wifi', label: 'Wi-Fi', icon: 'Wifi' },
  { type: 'location', label: 'Location', icon: 'MapPin' },
  { type: 'vcard', label: 'Contact', icon: 'Contact' },
  { type: 'event', label: 'Event', icon: 'Calendar' },
  { type: 'file', label: 'File', icon: 'FileDown' },
];

export function encodeQRData(type: QRType, data: Record<string, string>): string {
  switch (type) {
    case 'url':
      return data.url || 'https://example.com';
    case 'text':
      return data.text || 'Hello World';
    case 'phone':
      return `tel:${data.phone || '+1234567890'}`;
    case 'email': {
      const params = [];
      if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
      if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
      return `mailto:${data.email || ''}${params.length ? '?' + params.join('&') : ''}`;
    }
    case 'wifi':
      return `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};;`;
    case 'location':
      return `geo:${data.latitude || '0'},${data.longitude || '0'}`;
    case 'vcard':
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.lastName || ''};${data.firstName || ''}`,
        `FN:${data.firstName || ''} ${data.lastName || ''}`,
        data.company ? `ORG:${data.company}` : '',
        data.phone ? `TEL:${data.phone}` : '',
        data.email ? `EMAIL:${data.email}` : '',
        data.website ? `URL:${data.website}` : '',
        data.address ? `ADR:;;${data.address}` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
    case 'event':
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${data.title || 'Event'}`,
        data.startDate ? `DTSTART:${data.startDate.replace(/[-:]/g, '')}` : '',
        data.endDate ? `DTEND:${data.endDate.replace(/[-:]/g, '')}` : '',
        data.location ? `LOCATION:${data.location}` : '',
        data.description ? `DESCRIPTION:${data.description}` : '',
        'END:VEVENT',
      ].filter(Boolean).join('\n');
    case 'file':
      return data.fileUrl || 'https://example.com/file.pdf';
    default:
      return '';
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch {
    return '';
  }
}

export function getFaviconUrl(domain: string): string {
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export interface QRHistoryItem {
  id: string;
  type: QRType;
  formData: Record<string, string>;
  styleOptions: QRStyleOptions;
  label: string;
  createdAt: number;
}

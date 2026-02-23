import type { QRType } from '@/lib/qr-data';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  type: QRType;
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
    <Input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-input/50 border-border/40 focus:border-primary/50 text-foreground"
    />
  </div>
);

const set = (data: Record<string, string>, onChange: Props['onChange'], key: string) =>
  (v: string) => onChange({ ...data, [key]: v });

const QRDataForms = ({ type, data, onChange }: Props) => {
  const s = (key: string) => set(data, onChange, key);
  const v = (key: string) => data[key] || '';

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        {type.charAt(0).toUpperCase() + type.slice(1)} Details
      </h3>

      {type === 'url' && (
        <Field label="Website URL" value={v('url')} onChange={s('url')} placeholder="https://example.com" type="url" />
      )}

      {type === 'text' && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Text Content</label>
          <Textarea
            value={v('text')}
            onChange={e => s('text')(e.target.value)}
            placeholder="Enter your text here..."
            rows={4}
            className="bg-input/50 border-border/40 focus:border-primary/50 text-foreground"
          />
        </div>
      )}

      {type === 'phone' && (
        <Field label="Phone Number" value={v('phone')} onChange={s('phone')} placeholder="+1 234 567 8900" type="tel" />
      )}

      {type === 'email' && (
        <>
          <Field label="Email Address" value={v('email')} onChange={s('email')} placeholder="hello@example.com" type="email" />
          <Field label="Subject" value={v('subject')} onChange={s('subject')} placeholder="Subject line" />
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Body</label>
            <Textarea
              value={v('body')}
              onChange={e => s('body')(e.target.value)}
              placeholder="Email body..."
              rows={3}
              className="bg-input/50 border-border/40 focus:border-primary/50 text-foreground"
            />
          </div>
        </>
      )}

      {type === 'wifi' && (
        <>
          <Field label="Network Name (SSID)" value={v('ssid')} onChange={s('ssid')} placeholder="My WiFi" />
          <Field label="Password" value={v('password')} onChange={s('password')} placeholder="••••••••" />
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Encryption</label>
            <select
              value={v('encryption') || 'WPA'}
              onChange={e => s('encryption')(e.target.value)}
              className="w-full rounded-lg bg-input/50 border border-border/40 px-3 py-2 text-sm text-foreground focus:border-primary/50 outline-none"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open (No Password)</option>
            </select>
          </div>
        </>
      )}

      {type === 'location' && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" value={v('latitude')} onChange={s('latitude')} placeholder="40.7128" />
          <Field label="Longitude" value={v('longitude')} onChange={s('longitude')} placeholder="-74.0060" />
        </div>
      )}

      {type === 'vcard' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" value={v('firstName')} onChange={s('firstName')} placeholder="John" />
            <Field label="Last Name" value={v('lastName')} onChange={s('lastName')} placeholder="Doe" />
          </div>
          <Field label="Company" value={v('company')} onChange={s('company')} placeholder="Acme Inc." />
          <Field label="Phone" value={v('phone')} onChange={s('phone')} placeholder="+1 234 567 8900" />
          <Field label="Email" value={v('email')} onChange={s('email')} placeholder="john@acme.com" />
          <Field label="Website" value={v('website')} onChange={s('website')} placeholder="https://acme.com" />
          <Field label="Address" value={v('address')} onChange={s('address')} placeholder="123 Main St, City" />
        </>
      )}

      {type === 'event' && (
        <>
          <Field label="Event Title" value={v('title')} onChange={s('title')} placeholder="Meeting" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" value={v('startDate')} onChange={s('startDate')} type="datetime-local" />
            <Field label="End Date" value={v('endDate')} onChange={s('endDate')} type="datetime-local" />
          </div>
          <Field label="Location" value={v('location')} onChange={s('location')} placeholder="Conference Room A" />
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={v('description')}
              onChange={e => s('description')(e.target.value)}
              placeholder="Event details..."
              rows={2}
              className="bg-input/50 border-border/40 focus:border-primary/50 text-foreground"
            />
          </div>
        </>
      )}

      {type === 'file' && (
        <Field label="File URL" value={v('fileUrl')} onChange={s('fileUrl')} placeholder="https://example.com/document.pdf" type="url" />
      )}
    </div>
  );
};

export default QRDataForms;

import { useState, useMemo, useCallback } from 'react';
import type { QRType } from '@/lib/qr-data';
import { defaultStyleOptions, encodeQRData } from '@/lib/qr-data';
import { useQRHistory } from '@/hooks/useQRHistory';
import QRTypeSelector from './QRTypeSelector';
import QRDataForms from './QRDataForms';
import QRCustomizer from './QRCustomizer';
import QRPreview from './QRPreview';
import { toast } from 'sonner';

const QRGenerator = () => {
  const [qrType, setQrType] = useState<QRType>('url');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [styleOptions, setStyleOptions] = useState(defaultStyleOptions);
  const { addToHistory } = useQRHistory();

  const qrData = useMemo(() => encodeQRData(qrType, formData), [qrType, formData]);

  const handleTypeChange = useCallback((type: QRType) => {
    setQrType(type);
    setFormData({});
  }, []);

  const handleSave = useCallback(() => {
    const label = formData.url || formData.text || formData.ssid || formData.email ||
      formData.phone || formData.title || formData.firstName || 'QR Code';
    addToHistory(qrType, formData, styleOptions, label);
    toast.success('Saved to history!');
  }, [qrType, formData, styleOptions, addToHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <QRTypeSelector type={qrType} onChange={handleTypeChange} />
        <QRDataForms type={qrType} data={formData} onChange={setFormData} />
        <QRCustomizer options={styleOptions} onChange={setStyleOptions} />
      </div>
      <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
        <QRPreview
          data={qrData}
          qrType={qrType}
          formData={formData}
          options={styleOptions}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default QRGenerator;

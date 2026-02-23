import { useQRHistory } from '@/hooks/useQRHistory';
import { encodeQRData } from '@/lib/qr-data';
import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HistoryQR = ({ data, options }: { data: string; options: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotsOpts: any = { type: options.dotsType, color: options.dotsColor };
    if (options.useGradient) {
      dotsOpts.gradient = {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: options.gradientColor1 },
          { offset: 1, color: options.gradientColor2 },
        ],
      };
      delete dotsOpts.color;
    }
    const qr = new QRCodeStyling({
      width: 140,
      height: 140,
      data,
      dotsOptions: dotsOpts,
      backgroundOptions: { color: options.backgroundColor },
      cornersSquareOptions: { type: options.cornersSquareType },
      cornersDotOptions: { type: options.cornersDotType },
    });
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [data, options]);

  return <div ref={ref} className="[&>canvas]:rounded-md" />;
};

const History = () => {
  const { history, removeFromHistory, clearHistory } = useQRHistory();

  return (
    <main className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">QR History</h1>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearHistory}>
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No saved QR codes yet.</p>
          <Link to="/">
            <Button variant="secondary">Create your first QR code</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map(item => (
            <div key={item.id} className="glass-card p-4 flex flex-col items-center gap-3">
              <HistoryQR
                data={encodeQRData(item.type, item.formData)}
                options={item.styleOptions}
              />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.type.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromHistory(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default History;

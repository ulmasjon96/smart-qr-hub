import { useState, useCallback } from 'react';
import type { QRHistoryItem, QRType, QRStyleOptions } from '@/lib/qr-data';

const STORAGE_KEY = 'smart-qr-history';
const MAX_ITEMS = 10;

export function useQRHistory() {
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const save = (items: QRHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToHistory = useCallback((
    type: QRType,
    formData: Record<string, string>,
    styleOptions: QRStyleOptions,
    label: string
  ) => {
    const newItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      type,
      formData,
      styleOptions,
      label,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...history].slice(0, MAX_ITEMS);
    save(updated);
  }, [history]);

  const removeFromHistory = useCallback((id: string) => {
    save(history.filter(h => h.id !== id));
  }, [history]);

  const clearHistory = useCallback(() => {
    save([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}

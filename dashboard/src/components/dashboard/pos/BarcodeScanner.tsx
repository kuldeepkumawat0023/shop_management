'use client';

import { useEffect, useRef } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { productService } from '@/lib/services/product.services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function BarcodeScanner() {
  const { products, addToCart } = usePOS();
  const { t } = useTranslation();
  const buffer = useRef<string>('');
  const lastKeyTime = useRef<number>(Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentTime = Date.now();
      
      // Reset buffer if more than 100ms passed between keystrokes (barcode scanners are very fast)
      if (currentTime - lastKeyTime.current > 100) {
        buffer.current = '';
      }
      lastKeyTime.current = currentTime;

      if (e.key === 'Enter') {
        if (buffer.current.length > 2) {
          const barcodeValue = buffer.current;
          
          // First try local product list by SKU
          const localMatch = products.find(p => p.sku === barcodeValue);
          if (localMatch) {
            addToCart(localMatch);
            toast.success(`${t('pos.barcodeScanner.scanned')} ${localMatch.name}`);
          } else {
            // Try backend barcode API
            productService.getProductByBarcode(barcodeValue).then(res => {
              if (res.success && res.data) {
                addToCart(res.data);
                toast.success(`${t('pos.barcodeScanner.scanned')} ${res.data.name}`);
              } else {
                toast.error(`${t('pos.barcodeScanner.unknownBarcode')} ${barcodeValue}`, { id: 'unknown-barcode----barcodevalu' });
              }
            }).catch(() => {
              toast.error(`${t('pos.barcodeScanner.barcodeNotFound')} ${barcodeValue}`, { id: 'barcode-not-found----barcodeva' });
            });
          }
        }
        buffer.current = '';
      } else if (e.key.length === 1) {
        buffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, addToCart]);

  return null;
}

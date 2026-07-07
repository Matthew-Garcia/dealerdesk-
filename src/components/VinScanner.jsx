import { useEffect, useRef, useState } from 'react';

const SCANNER_ID = 'vin-scanner-region';

export default function VinScanner({ onDetected, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let html5Qrcode;
    let cancelled = false;

    import('html5-qrcode').then(({ Html5Qrcode, Html5QrcodeSupportedFormats }) => {
      if (cancelled) return;
      html5Qrcode = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        verbose: false,
      });
      scannerRef.current = html5Qrcode;

      html5Qrcode
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 140 } },
          (decodedText) => {
            const clean = decodedText.trim().toUpperCase();
            onDetected(clean);
          },
          () => {} // ignore per-frame scan failures
        )
        .catch((err) => {
          setError('Could not access camera. Check browser permissions, and note this requires HTTPS (works once deployed, not on some local setups).');
        });
    });

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current.clear();
        });
      }
    };
  }, [onDetected]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Scan VIN Barcode</div>
        <div id={SCANNER_ID} style={{ width: '100%', borderRadius: 4, overflow: 'hidden' }} />
        {error && <div className="scanner-error">{error}</div>}
        <div className="login-note" style={{ marginTop: 12 }}>
          Point the camera at a VIN barcode (door jamb sticker) or type the VIN manually instead.
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

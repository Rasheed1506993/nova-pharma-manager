
import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface BarcodeGeneratorProps {
  value: string;
  className?: string;
  displayValue?: boolean;
  height?: number;
  width?: number;
  fontSize?: number;
  flat?: boolean;
  textMargin?: number;
}

const BarcodeGenerator = ({
  value,
  className = '',
  displayValue = true,
  height = 80,
  width = 2,
  fontSize = 12,
  flat = false,
  textMargin = 2
}: BarcodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          displayValue,
          height,
          width,
          fontSize,
          flat,
          textMargin,
          format: 'CODE128',
          lineColor: '#000000',
          background: '#ffffff',
          margin: 10
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, displayValue, height, width, fontSize, flat, textMargin]);

  const handlePrint = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    
    const printWindow = window.open('', '', 'height=500,width=500');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>باركود المنتج: ${value}</title>
          <style>
            body {
              text-align: center;
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .barcode-container {
              margin: 20px auto;
              page-break-inside: avoid;
            }
            .product-info {
              margin-bottom: 5px;
              font-size: 14px;
            }
            @media print {
              .no-print {
                display: none;
              }
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <div class="product-info">${value}</div>
            <img src="${dataUrl}" alt="باركود المنتج" style="max-width: 100%;">
          </div>
          <div class="no-print">
            <button onClick="window.print()" style="padding: 8px 16px; margin-top: 20px; cursor: pointer;">
              طباعة الباركود
            </button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} className="max-w-full"></canvas>
      {value && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs flex items-center gap-1"
          onClick={handlePrint}
        >
          <Printer className="h-3 w-3" />
          <span>طباعة الباركود</span>
        </Button>
      )}
    </div>
  );
};

export default BarcodeGenerator;

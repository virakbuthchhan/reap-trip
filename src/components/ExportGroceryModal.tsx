'use client';

import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { X, Printer, Copy, Check, Download, Tent, FileText, Image as ImageIcon, ShoppingCart, Maximize2, Minimize2 } from 'lucide-react';

interface ExportGroceryModalProps {
  groceryList: { name: string; amount: number; unit: string; category: string; estCost: number }[];
  totalCostUSD: number;
  groupSize: number;
  selectedRecipeNames: string[];
  onClose: () => void;
}

export const ExportGroceryModal: React.FC<ExportGroceryModalProps> = ({
  groceryList,
  totalCostUSD,
  groupSize,
  selectedRecipeNames,
  onClose
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const totalCostKHR = totalCostUSD * 4000;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `🛒 *Reap Trip Camp Market Grocery List*\n`;
    text += `👥 Group Size: ${groupSize} campers\n`;
    text += `🥘 Meals Planned: ${selectedRecipeNames.join(', ')}\n`;
    text += `------------------------------------\n`;
    groceryList.forEach((item) => {
      text += `- [ ] ${item.name}: ${item.amount} ${item.unit} (~$${item.estCost.toFixed(2)})\n`;
    });
    text += `------------------------------------\n`;
    text += `💰 Estimated Total: $${totalCostUSD.toFixed(2)} USD (~${totalCostKHR.toLocaleString()} ៛)\n`;
    text += `\nExported from Reap Trip (ដំណើរកម្សាន្ត) 🚀`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTextFile = () => {
    let text = `====================================\n`;
    text += `⛺ REAP TRIP (ដំណើរកម្សាន្ត) - MARKET RECEIPT\n`;
    text += `====================================\n`;
    text += `👥 Group Size: ${groupSize} campers\n`;
    text += `📅 Date: ${new Date().toISOString().split('T')[0]}\n`;
    text += `🥘 Meals Planned: ${selectedRecipeNames.join(', ')}\n`;
    text += `------------------------------------\n\n`;
    text += `GROCERY ITEMS CHECKLIST:\n`;

    groceryList.forEach((item, index) => {
      text += `${index + 1}. [ ] ${item.name.padEnd(28)} ${item.amount} ${item.unit.padEnd(8)} $${item.estCost.toFixed(2)}\n`;
    });

    text += `\n------------------------------------\n`;
    text += `ESTIMATED TOTAL COST:\n`;
    text += `USD: $${totalCostUSD.toFixed(2)} USD\n`;
    text += `KHR: ~${totalCostKHR.toLocaleString()} KHR (៛)\n`;
    text += `====================================\n`;
    text += `Happy Camping! Pack out all trash. 🌲\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reap-trip-grocery-list-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // High-Resolution Canvas Image Receipt Generator
  const handleDownloadImage = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 640;
      const rowHeight = 36;
      const baseHeight = 360;
      const height = baseHeight + groceryList.length * rowHeight;

      canvas.width = width * 2; // 2x scale for crisp retina screens
      canvas.height = height * 2;
      ctx.scale(2, 2);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Header Banner
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 0, width, 85);

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('⛺ Reap Trip (ដំណើរកម្សាន្ត)', 24, 38);

      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText('CAMP MARKET GROCERY RECEIPT', 24, 62);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(width - 150, 24, 126, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('CHECKLIST', width - 124, 44);

      // Metadata Section
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(`👥 Campers: ${groupSize} people`, 24, 115);
      ctx.fillText(`📅 Date: ${new Date().toISOString().split('T')[0]}`, width - 180, 115);

      // Meals List Box
      ctx.fillStyle = '#f3f4f6';
      ctx.beginPath();
      ctx.roundRect(24, 130, width - 48, 42, 8);
      ctx.fill();

      ctx.fillStyle = '#4b5563';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Planned Meals: ${selectedRecipeNames.join(' • ')}`, 36, 155);

      // Table Divider Line
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(24, 190);
      ctx.lineTo(width - 24, 190);
      ctx.stroke();

      // Table Columns Header
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('ITEM NAME', 24, 210);
      ctx.fillText('QUANTITY', width - 210, 210);
      ctx.fillText('EST. COST', width - 100, 210);

      let currentY = 240;

      // Grocery Items Rows
      groceryList.forEach((item, idx) => {
        // Alternating row bg
        if (idx % 2 === 0) {
          ctx.fillStyle = '#fafafa';
          ctx.fillRect(24, currentY - 20, width - 48, 30);
        }

        // Checkbox box
        ctx.strokeStyle = '#9ca3af';
        ctx.strokeRect(24, currentY - 14, 14, 14);

        // Item Name
        ctx.fillStyle = '#111827';
        ctx.font = '500 13px system-ui, -apple-system, sans-serif';
        const nameText = item.name.length > 32 ? item.name.substring(0, 32) + '...' : item.name;
        ctx.fillText(nameText, 46, currentY);

        // Quantity
        ctx.fillStyle = '#4b5563';
        ctx.font = '13px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${item.amount} ${item.unit}`, width - 210, currentY);

        // Cost
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(`$${item.estCost.toFixed(2)}`, width - 100, currentY);

        currentY += rowHeight;
      });

      // Bottom Divider
      currentY += 10;
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, currentY);
      ctx.lineTo(width - 24, currentY);
      ctx.stroke();

      // Total Section
      currentY += 35;
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('ESTIMATED TOTAL COST:', 24, currentY);

      ctx.fillStyle = '#047857';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(`$${totalCostUSD.toFixed(2)} USD`, width - 190, currentY);

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`(~${totalCostKHR.toLocaleString()} ៛)`, width - 190, currentY + 18);

      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText('Generated by Reap Trip App • Happy Camping & Pack Out Trash 🌲', 24, height - 20);

      // Convert Canvas to downloadable PNG image
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `reap-trip-grocery-receipt-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content export-modal-box ${isMaximized ? 'is-maximized' : ''}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Sticky Fixed Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'នាំចេញ / ទាញយកបញ្ជីផ្សារ' : 'Export & Save Grocery Receipt'}</span>
            </h3>
            <p className="text-muted small-text">
              {language === 'km' ? 'រក្សាទុកជារូបភាព (PNG), ឯកសារអត្ថបទ ឬបោះពុម្ព' : 'Download receipt image, checklist file, or copy text'}
            </p>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className="modal-icon-btn"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Minimize' : 'Expand Fullscreen'}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button type="button" className="modal-icon-btn close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="modal-body-scrollable">
          {/* Printable Formatted Receipt Card */}
          <div className="grocery-printable-card" ref={printableRef}>
            <div className="receipt-brand-header">
            <div className="receipt-brand">
              <Tent size={20} color="var(--primary)" />
              <strong>Reap Trip (ដំណើរកម្សាន្ត)</strong>
            </div>
            <span className="receipt-badge">MARKET CHECKLIST</span>
          </div>

          <div className="receipt-meta-info">
            <div>
              <span>👥 {language === 'km' ? 'ចំនួនសមាជិក:' : 'Campers:'}</span>
              <strong>{groupSize} {language === 'km' ? 'នាក់' : 'people'}</strong>
            </div>
            <div>
              <span>📅 {language === 'km' ? 'កាលបរិច្ឆេទ:' : 'Date:'}</span>
              <strong>{new Date().toISOString().split('T')[0]}</strong>
            </div>
          </div>

          <div className="receipt-meals-list">
            <span>🥘 {language === 'km' ? 'មុខម្ហូបបានជ្រើសរើស:' : 'Planned Meals:'}</span>
            <p>{selectedRecipeNames.join(' • ')}</p>
          </div>

          <div className="receipt-divider" />

          {/* Grocery Table */}
          <div className="receipt-items-table">
            <div className="table-header-row">
              <span>ITEM</span>
              <span>QTY</span>
              <span>EST. COST</span>
            </div>

            {groceryList.map((item, idx) => (
              <div key={idx} className="table-item-row">
                <div className="item-checkbox-name">
                  <span className="print-checkbox">[ ]</span>
                  <strong>{item.name}</strong>
                </div>
                <span className="item-qty">{item.amount} {item.unit}</span>
                <span className="item-price">${item.estCost.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          <div className="receipt-total-row flex-between">
            <strong>ESTIMATED TOTAL:</strong>
            <div className="total-prices">
              <strong className="usd-total">${totalCostUSD.toFixed(2)} USD</strong>
              <span className="khr-total">~{totalCostKHR.toLocaleString()} ៛</span>
            </div>
          </div>

          <div className="receipt-footer-note" style={{ marginTop: '1rem' }}>
            <p>Happy Camping! Pack all trash out & preserve Cambodian nature. 🌲</p>
          </div>
        </div>

        {/* Sticky Fixed Bottom Actions Bar */}
        <div className="modal-actions-sticky">
          <button className="btn btn-primary btn-sm" onClick={handleDownloadImage} disabled={downloading}>
            <Download size={16} />
            <span>{downloading ? 'Generating...' : (language === 'km' ? 'ទាញយករូបភាព' : 'Save Image')}</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleDownloadTextFile}>
            <FileText size={16} />
            <span>{language === 'km' ? 'ទាញយក .TXT' : '.TXT File'}</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleCopyText}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : (language === 'km' ? 'ចម្លង' : 'Copy')}</span>
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>

      <style>{`
        .export-modal-box {
          max-width: 640px;
          padding: 1.5rem !important;
        }

        .export-action-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .grocery-printable-card {
          background: #ffffff;
          color: #111827;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          font-family: var(--font-main);
        }

        .receipt-brand-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.85rem;
          margin-bottom: 0.85rem;
        }

        .receipt-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #047857;
          font-size: 1.1rem;
        }

        .receipt-badge {
          background: #047857;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: bold;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .receipt-meta-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #4b5563;
          margin-bottom: 0.65rem;
        }

        .receipt-meals-list {
          font-size: 0.82rem;
          color: #4b5563;
          background: #f3f4f6;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
        }

        .receipt-meals-list p {
          color: #111827;
          font-weight: 600;
          margin-top: 0.15rem;
        }

        .receipt-divider {
          border-top: 1px dashed #9ca3af;
          margin: 1rem 0;
        }

        .receipt-items-table {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: bold;
          color: #6b7280;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
        }

        .item-checkbox-name {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex: 1;
        }

        .print-checkbox {
          font-family: monospace;
          color: #9ca3af;
        }

        .item-qty {
          width: 80px;
          text-align: right;
          color: #4b5563;
        }

        .item-price {
          width: 70px;
          text-align: right;
          font-weight: bold;
          color: #047857;
        }

        .receipt-total-row {
          font-size: 1rem;
        }

        .total-prices {
          text-align: right;
        }

        .usd-total {
          display: block;
          color: #047857;
          font-size: 1.15rem;
        }

        .khr-total {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .receipt-footer-note {
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 1rem;
          border-top: 1px solid #f3f4f6;
          padding-top: 0.5rem;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .grocery-printable-card, .grocery-printable-card * {
            visibility: visible;
          }
          .grocery-printable-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

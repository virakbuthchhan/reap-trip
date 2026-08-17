'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { TripMember, ExpenseItem, SettlementDebt } from '../types';
import { X, Printer, Copy, Check, Download, Tent, FileText, Scale, Maximize2, Minimize2 } from 'lucide-react';
import { USD_TO_KHR } from '@/constants/currency';

interface ExportExpenseModalProps {
  members: TripMember[];
  expenses: ExpenseItem[];
  debts: SettlementDebt[];
  totalExpenseUSD: number;
  onClose: () => void;
}

export const ExportExpenseModal: React.FC<ExportExpenseModalProps> = ({
  members,
  expenses,
  debts,
  totalExpenseUSD,
  onClose
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const totalExpenseKHR = totalExpenseUSD * USD_TO_KHR;
  const perPersonShareUSD = members.length > 0 ? totalExpenseUSD / members.length : 0;

  const handlePrint = () => {
    window.print();
  };

  const getMemberName = (id: string) => {
    const m = members.find((mem) => mem.id === id);
    return m ? m.name : 'Unknown';
  };

  const handleCopyText = () => {
    let text = `⛺ *Reap Trip Expense Settlement Summary*\n`;
    text += `👥 Members: ${members.map((m) => m.name).join(', ')}\n`;
    text += `💰 Total Trip Expense: $${totalExpenseUSD.toFixed(2)} USD (~${totalExpenseKHR.toLocaleString()} ៛)\n`;
    text += `📊 Equal Share Per Person: $${perPersonShareUSD.toFixed(2)} USD\n`;
    text += `------------------------------------\n`;
    text += `🧾 EXPENSE ITEMS:\n`;

    expenses.forEach((e) => {
      const payer = getMemberName(e.paidByMemberId);
      const amtStr = e.currency === 'USD' ? `$${e.amount.toFixed(2)}` : `${e.amount.toLocaleString()} ៛`;
      text += `- ${e.title}: ${amtStr} (Paid by ${payer})\n`;
    });

    text += `------------------------------------\n`;
    text += `⚖️ NET SETTLEMENT (WHO OWES WHOM):\n`;

    if (debts.length === 0) {
      text += `✅ All balances settled evenly!\n`;
    } else {
      debts.forEach((d) => {
        const fromName = getMemberName(d.fromMemberId);
        const toName = getMemberName(d.toMemberId);
        text += `👉 ${fromName} pays ${toName}: $${d.amountUSD.toFixed(2)} USD (~${d.amountKHR.toLocaleString()} ៛)\n`;
      });
    }

    text += `\nExported from Reap Trip (ដំណើរកម្សាន្ត) 🚀`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTextFile = () => {
    let text = `====================================\n`;
    text += `⛺ REAP TRIP (ដំណើរកម្សាន្ត) - EXPENSE SETTLEMENT REPORT\n`;
    text += `====================================\n`;
    text += `👥 Group Members (${members.length}): ${members.map((m) => m.name).join(', ')}\n`;
    text += `📅 Date: ${new Date().toISOString().split('T')[0]}\n`;
    text += `💰 Total Trip Expense: $${totalExpenseUSD.toFixed(2)} USD (~${totalExpenseKHR.toLocaleString()} KHR)\n`;
    text += `📊 Per-Person Share: $${perPersonShareUSD.toFixed(2)} USD\n`;
    text += `------------------------------------\n\n`;
    text += `ITEMIZED EXPENSES:\n`;

    expenses.forEach((e, idx) => {
      const payer = getMemberName(e.paidByMemberId);
      const amtStr = e.currency === 'USD' ? `$${e.amount.toFixed(2)}` : `${e.amount.toLocaleString()} ៛`;
      text += `${idx + 1}. ${e.title.padEnd(30)} ${amtStr.padEnd(12)} (Paid by ${payer})\n`;
    });

    text += `\n------------------------------------\n`;
    text += `NET SETTLEMENT (WHO OWES WHOM):\n`;

    if (debts.length === 0) {
      text += `✅ All expenses are balanced evenly!\n`;
    } else {
      debts.forEach((d, idx) => {
        const fromName = getMemberName(d.fromMemberId);
        const toName = getMemberName(d.toMemberId);
        text += `${idx + 1}. ${fromName} ---> pays ---> ${toName} : $${d.amountUSD.toFixed(2)} USD (~${d.amountKHR.toLocaleString()} ៛)\n`;
      });
    }

    text += `====================================\n`;
    text += `Thank you for traveling with Reap Trip! 🌲\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reap-trip-expense-summary-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // High-Resolution Canvas Image Receipt Generator for Expenses
  const handleDownloadImage = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 640;
      const expRowHeight = 32;
      const debtRowHeight = 36;
      const height = 400 + expenses.length * expRowHeight + debts.length * debtRowHeight;

      canvas.width = width * 2; // 2x retina
      canvas.height = height * 2;
      ctx.scale(2, 2);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, 85);

      // Header Text
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('⛺ Reap Trip (ដំណើរកម្សាន្ត)', 24, 38);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('TRIP EXPENSE SETTLEMENT REPORT', 24, 62);

      // Badge
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(width - 160, 24, 136, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('SETTLEMENT', width - 138, 44);

      // Meta Stats Bar
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(24, 100, width - 48, 65);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 100, width - 48, 65);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`TOTAL TRIP EXPENSE:`, 36, 125);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(`$${totalExpenseUSD.toFixed(2)} USD`, 36, 150);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`PER-PERSON SHARE:`, width - 220, 125);
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(`$${perPersonShareUSD.toFixed(2)} USD`, width - 220, 150);

      let currentY = 190;

      // Expenses Table Header
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('🧾 ITEMIZED EXPENSES:', 24, currentY);

      currentY += 20;

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('DESCRIPTION', 24, currentY);
      ctx.fillText('PAID BY', width - 240, currentY);
      ctx.fillText('AMOUNT', width - 110, currentY);

      currentY += 10;
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(24, currentY);
      ctx.lineTo(width - 24, currentY);
      ctx.stroke();

      currentY += 22;

      // Expense Items
      expenses.forEach((e, idx) => {
        if (idx % 2 === 0) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(24, currentY - 16, width - 48, 28);
        }

        const payer = getMemberName(e.paidByMemberId);
        const titleText = e.title.length > 28 ? e.title.substring(0, 28) + '...' : e.title;
        const amtStr = e.currency === 'USD' ? `$${e.amount.toFixed(2)}` : `${e.amount.toLocaleString()} ៛`;

        ctx.fillStyle = '#334155';
        ctx.font = '500 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(titleText, 24, currentY);

        ctx.fillStyle = '#64748b';
        ctx.fillText(payer, width - 240, currentY);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(amtStr, width - 110, currentY);

        currentY += expRowHeight;
      });

      // Settlement Section Divider
      currentY += 15;
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.fillText('⚖️ NET SETTLEMENT BALANCE (WHO OWES WHOM):', 24, currentY);

      currentY += 15;

      if (debts.length === 0) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('✅ All balances are completely settled!', 24, currentY + 10);
        currentY += 30;
      } else {
        debts.forEach((d) => {
          const fromName = getMemberName(d.fromMemberId);
          const toName = getMemberName(d.toMemberId);

          ctx.fillStyle = '#fff7ed';
          ctx.fillRect(24, currentY, width - 48, 30);
          ctx.strokeStyle = '#fed7aa';
          ctx.strokeRect(24, currentY, width - 48, 30);

          ctx.fillStyle = '#c2410c';
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
          ctx.fillText(`👉 ${fromName}`, 34, currentY + 19);

          ctx.fillStyle = '#475569';
          ctx.font = '12px system-ui, -apple-system, sans-serif';
          ctx.fillText(`pays`, 34 + ctx.measureText(`👉 ${fromName}`).width + 8, currentY + 19);

          ctx.fillStyle = '#047857';
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
          const toX = 34 + ctx.measureText(`👉 ${fromName} pays `).width;
          ctx.fillText(toName, toX, currentY + 19);

          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
          ctx.fillText(`$${d.amountUSD.toFixed(2)} USD`, width - 130, currentY + 19);

          currentY += debtRowHeight;
        });
      }

      // Footer
      currentY += 25;
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(24, currentY);
      ctx.lineTo(width - 24, currentY);
      ctx.stroke();

      currentY += 20;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText('Generated by Reap Trip App • Fair Expense Sharing 🚀', 24, currentY);

      // Download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `reap-trip-expense-settlement-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Expense image generation error:', err);
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
              <Scale size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'នាំចេញ / ទាញយកកំណត់ត្រាចំណាយ' : 'Export & Save Expense Report'}</span>
            </h3>
            <p className="text-muted small-text">
              {language === 'km' ? 'រក្សាទុកជារូបភាព (PNG), ឯកសារអត្ថបទ ឬបោះពុម្ព' : 'Download receipt image, summary file, or copy text'}
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
          {/* Printable Formatted Expense Receipt Card */}
          <div className="expense-printable-card">
            <div className="receipt-brand-header">
            <div className="receipt-brand">
              <Tent size={20} color="var(--primary)" />
              <strong>Reap Trip (ដំណើរកម្សាន្ត)</strong>
            </div>
            <span className="receipt-badge" style={{ background: '#0284c7' }}>EXPENSE SETTLEMENT</span>
          </div>

          <div className="receipt-meta-info flex-between">
            <div>
              <span>👥 {language === 'km' ? 'សមាជិកដំណើរ:' : 'Members:'}</span>
              <strong>{members.length} {language === 'km' ? 'នាក់' : 'people'}</strong>
            </div>
            <div>
              <span>📅 {language === 'km' ? 'កាលបរិច្ឆេទ:' : 'Date:'}</span>
              <strong>{new Date().toISOString().split('T')[0]}</strong>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="receipt-stats-grid">
            <div className="stat-box">
              <span>TOTAL EXPENSE</span>
              <strong style={{ color: '#047857' }}>${totalExpenseUSD.toFixed(2)} USD</strong>
              <span className="sub-text">~{totalExpenseKHR.toLocaleString()} ៛</span>
            </div>
            <div className="stat-box">
              <span>EQUAL PER PERSON</span>
              <strong style={{ color: '#0284c7' }}>${perPersonShareUSD.toFixed(2)} USD</strong>
              <span className="sub-text">~{(perPersonShareUSD * USD_TO_KHR).toLocaleString()} ៛</span>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Itemized Expenses */}
          <div className="receipt-items-table">
            <div className="table-header-row">
              <span>DESCRIPTION</span>
              <span>PAID BY</span>
              <span>AMOUNT</span>
            </div>

            {expenses.map((e, idx) => (
              <div key={idx} className="table-item-row">
                <span className="exp-title-text">{e.title}</span>
                <span className="exp-payer-text">{getMemberName(e.paidByMemberId)}</span>
                <strong className="exp-amt-text">
                  {e.currency === 'USD' ? `$${e.amount.toFixed(2)}` : `${e.amount.toLocaleString()} ៛`}
                </strong>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          {/* Net Settlement Balance */}
          <div className="receipt-settlement-section">
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b' }}>
              ⚖️ NET SETTLEMENT BALANCE (WHO OWES WHOM):
            </strong>

            {debts.length === 0 ? (
              <div className="settlement-even-badge">✅ All balances are completely even!</div>
            ) : (
              <div className="settlement-debts-list">
                {debts.map((d, i) => (
                  <div key={i} className="debt-item-row">
                    <div className="debt-names">
                      <strong style={{ color: '#c2410c' }}>{getMemberName(d.fromMemberId)}</strong>
                      <span>pays</span>
                      <strong style={{ color: '#047857' }}>{getMemberName(d.toMemberId)}</strong>
                    </div>
                    <strong className="debt-amt">${d.amountUSD.toFixed(2)} USD</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="receipt-footer-note" style={{ marginTop: '1rem' }}>
              <p>Exported from Reap Trip App • Fair & Transparent Expense Sharing 🚀</p>
            </div>
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
        </div>
      </div>
    </div>

    </div>
  );
};

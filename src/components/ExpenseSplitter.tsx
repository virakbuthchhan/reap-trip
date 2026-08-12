'use client';

import React, { useState } from 'react';
import { TripMember, ExpenseItem, SettlementDebt } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Calculator, Plus, UserPlus, Trash2, ArrowRight, Share2, Copy, Check, DollarSign, Scale, Users, Receipt, Sparkles, Download } from 'lucide-react';
import { ExportExpenseModal } from './ExportExpenseModal';
import { InputField } from './ui/InputField';
import { SelectField, SelectOption } from './ui/SelectField';

export const ExpenseSplitter: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  // Members state
  const [members, setMembers] = useState<TripMember[]>([
    { id: 'm1', name: 'Vireak (Me)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
    { id: 'm2', name: 'Bopha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { id: 'm3', name: 'Dara', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' },
    { id: 'm4', name: 'Sophea', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' }
  ]);

  const [newMemberName, setNewMemberName] = useState('');

  // Expenses state
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 'e1',
      title: 'Local Guide Fee (Uncle Sokha)',
      amount: 60,
      currency: 'USD',
      paidByMemberId: 'm1',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'guide_fee',
      date: '2026-02-10'
    },
    {
      id: 'e2',
      title: 'Motorbike Fuel (Total)',
      amount: 40000,
      currency: 'KHR',
      paidByMemberId: 'm3',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'fuel',
      date: '2026-02-10'
    },
    {
      id: 'e3',
      title: 'Camp Grocery & Grilled Meat at Local Market',
      amount: 45,
      currency: 'USD',
      paidByMemberId: 'm2',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'food',
      date: '2026-02-11'
    }
  ]);

  // Form modal state for adding expense
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCurrency, setExpCurrency] = useState<'USD' | 'KHR'>('USD');
  const [expPaidBy, setExpPaidBy] = useState('m1');
  const [expSplitAmong, setExpSplitAmong] = useState<string[]>(['m1', 'm2', 'm3', 'm4']);
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('food');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const currencyOptions: SelectOption[] = [
    { value: 'USD', label: 'USD ($)', icon: '💵' },
    { value: 'KHR', label: 'KHR (៛ Riel)', icon: '៛' }
  ];

  const memberOptions: SelectOption[] = members.map((m) => ({
    value: m.id,
    label: m.name,
    icon: '👤'
  }));

  const categoryOptions: SelectOption[] = [
    { value: 'fuel', label: 'Fuel / Gas', icon: '⛽' },
    { value: 'food', label: 'Food & Market Grocery', icon: '🍲' },
    { value: 'guide_fee', label: 'Local Guide & Ranger Fee', icon: '👤' },
    { value: 'camp_fee', label: 'Campsite Fee', icon: '⛺' },
    { value: 'transport_rental', label: 'Transport Rental', icon: '🛵' },
    { value: 'other', label: 'Other Expense', icon: '📦' }
  ];

  // Add new member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newM: TripMember = {
      id: `m_${Date.now()}`,
      name: newMemberName.trim(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=100&q=80`
    };
    setMembers([...members, newM]);
    setExpSplitAmong([...expSplitAmong, newM.id]);
    setNewMemberName('');
  };

  const handleDeleteMember = (id: string) => {
    if (members.length <= 2) {
      showToast(language === 'km' ? 'ត្រូវមានយ៉ាងហោចណាស់ ២នាក់' : 'At least 2 members required', 'warning');
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
    setExpenses(expenses.filter((e) => e.paidByMemberId !== id));
  };

  // Add expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expAmount);
    if (!expTitle || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExp: ExpenseItem = {
      id: `e_${Date.now()}`,
      title: expTitle,
      amount: parsedAmount,
      currency: expCurrency,
      paidByMemberId: expPaidBy,
      splitAmongMemberIds: expSplitAmong.length > 0 ? expSplitAmong : members.map(m => m.id),
      category: expCategory,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([...expenses, newExp]);
    setShowAddModal(false);
    setExpTitle('');
    setExpAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const KHR_PER_USD = 4000;

  const calculateSettlements = (): SettlementDebt[] => {
    const netBalances: { [memberId: string]: number } = {};
    members.forEach((m) => { netBalances[m.id] = 0; });

    expenses.forEach((exp) => {
      const amountUSD = exp.currency === 'USD' ? exp.amount : exp.amount / KHR_PER_USD;
      if (netBalances[exp.paidByMemberId] !== undefined) {
        netBalances[exp.paidByMemberId] += amountUSD;
      }
      const splitters = exp.splitAmongMemberIds.length > 0 ? exp.splitAmongMemberIds : members.map(m => m.id);
      const sharePerPerson = amountUSD / splitters.length;
      splitters.forEach((mId) => {
        if (netBalances[mId] !== undefined) {
          netBalances[mId] -= sharePerPerson;
        }
      });
    });

    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(netBalances).forEach(([id, bal]) => {
      if (bal < -0.01) debtors.push({ id, amount: Math.abs(bal) });
      else if (bal > 0.01) creditors.push({ id, amount: bal });
    });

    const settlements: SettlementDebt[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const transferAmountUSD = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        fromMemberId: debtor.id,
        toMemberId: creditor.id,
        amountUSD: Math.round(transferAmountUSD * 100) / 100,
        amountKHR: Math.round(transferAmountUSD * KHR_PER_USD)
      });

      debtor.amount -= transferAmountUSD;
      creditor.amount -= transferAmountUSD;

      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();
  const totalExpenseUSD = expenses.reduce((sum, exp) => sum + (exp.currency === 'USD' ? exp.amount : exp.amount / KHR_PER_USD), 0);

  const handleCopySummary = () => {
    let summaryText = `🏕️ *Reap Trip Expense Summary*\n---------------------------\n`;
    summaryText += `👥 Group Members: ${members.map((m) => m.name).join(', ')}\n\n`;
    summaryText += `📊 *Expenses Logged:*\n`;
    expenses.forEach((e) => {
      const payer = members.find((m) => m.id === e.paidByMemberId)?.name || 'Someone';
      const formattedAmt = e.currency === 'USD' ? `$${e.amount}` : `${e.amount.toLocaleString()}៛`;
      summaryText += `- ${e.title}: ${formattedAmt} (Paid by ${payer})\n`;
    });
    summaryText += `\n⚖️ *Settlement Summary (Who pays whom):*\n`;
    if (settlements.length === 0) {
      summaryText += `Everyone is settled up! Zero debt. 🎉\n`;
    } else {
      settlements.forEach((s) => {
        const debtorName = members.find((m) => m.id === s.fromMemberId)?.name;
        const creditorName = members.find((m) => m.id === s.toMemberId)?.name;
        summaryText += `👉 ${debtorName} ➔ pay ${creditorName}: $${s.amountUSD} (${s.amountKHR.toLocaleString()}៛)\n`;
      });
    }
    summaryText += `\nCalculated with Reap Trip (ដំណើរកម្សាន្ត) 🚀`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="expense-splitter-page container">
      {/* Header */}
      <div className="section-header flex-between">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={22} color="var(--primary)" />
            <span>{t.expensesHeader}</span>
          </h2>
          <p>{t.expensesSub}</p>
        </div>
        <div className="header-actions-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowExportModal(true)}>
            <Download size={18} />
            <span>{language === 'km' ? 'នាំចេញ / ទាញយក' : 'Export & Save Report'}</span>
          </button>

          <button className="btn btn-secondary" onClick={handleCopySummary}>
            {copiedSummary ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copiedSummary ? (language === 'km' ? 'បានចម្លង!' : 'Copied!') : (language === 'km' ? 'ចម្លងអត្ថបទ' : 'Copy Summary')}</span>
          </button>
        </div>
      </div>

      <div className="expense-layout-grid">
        {/* Left Column: Group Members & Expense List */}
        <div className="expense-left-col">
          {/* Members Card */}
          <div className="glass-card">
            <div className="card-title-row">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} color="var(--primary)" />
                <span>{language === 'km' ? 'សមាជិកក្រុម' : 'Trip Members'} ({members.length})</span>
              </h3>
            </div>

            <div className="members-chips-list">
              {members.map((m) => (
                <div key={m.id} className="member-chip">
                  <img src={m.avatar} alt={m.name} className="member-avatar" />
                  <span>{m.name}</span>
                  <button className="delete-member-btn" onClick={() => handleDeleteMember(m.id)}>✕</button>
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddMember} className="add-member-form">
              <input
                type="text"
                className="custom-modern-input"
                placeholder={language === 'km' ? 'បន្ថែមឈ្មោះសមាជិកថ្មី...' : 'Add new member name...'}
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <UserPlus size={16} /> {t.addMember}
              </button>
            </form>
          </div>

          {/* Expenses Logged List */}
          <div className="glass-card" style={{ marginTop: '1.5rem' }}>
            <div className="card-title-row flex-between">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Receipt size={18} color="var(--primary)" />
                <span>{language === 'km' ? 'បញ្ជីចំណាយដែលបានកត់ត្រា' : 'Logged Expenses'}</span>
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                <Plus size={16} /> {t.addExpense}
              </button>
            </div>

            {expenses.length > 0 ? (
              <div className="expenses-list">
                {expenses.map((exp) => {
                  const payer = members.find((m) => m.id === exp.paidByMemberId);
                  const formattedAmt = exp.currency === 'USD' ? `$${exp.amount}` : `${exp.amount.toLocaleString()} ៛`;

                  return (
                    <div key={exp.id} className="expense-row">
                      <div className="exp-icon">
                        <Receipt size={20} color="var(--primary)" />
                      </div>
                      <div className="exp-info">
                        <strong>{exp.title}</strong>
                        <p className="exp-meta">
                          {t.paidBy} <strong style={{ color: 'var(--primary)' }}>{payer?.name}</strong> • {exp.date}
                        </p>
                      </div>
                      <div className="exp-amount">
                        <span>{formattedAmt}</span>
                        <button className="delete-exp-btn" onClick={() => handleDeleteExpense(exp.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
                {t.noExpenses}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Automated Settlement Calculation */}
        <div className="expense-right-col">
          <div className="glass-card settlement-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calculator size={18} color="var(--primary)" />
              <span>{t.settlementSummary}</span>
            </h3>
            <p className="settlement-sub">
              {language === 'km'
                ? 'គណនាស្វ័យប្រវត្តិដើម្បីទូទាត់ប្រាក់ដោយមិនបាច់ជំពាក់ច្រើនដំណាក់កាល'
                : 'Optimized minimum payments to settle all debts.'}
            </p>

            <div className="settlement-results">
              {settlements.length > 0 ? (
                settlements.map((s, idx) => {
                  const debtor = members.find((m) => m.id === s.fromMemberId);
                  const creditor = members.find((m) => m.id === s.toMemberId);

                  return (
                    <div key={idx} className="settlement-item">
                      <div className="person-box">
                        <img src={debtor?.avatar} alt={debtor?.name} />
                        <strong>{debtor?.name}</strong>
                      </div>

                      <div className="transfer-arrow flex-column">
                        <span className="debt-usd">${s.amountUSD}</span>
                        <span className="debt-khr">({s.amountKHR.toLocaleString()} ៛)</span>
                        <ArrowRight size={20} color="var(--primary)" />
                      </div>

                      <div className="person-box">
                        <img src={creditor?.avatar} alt={creditor?.name} />
                        <strong>{creditor?.name}</strong>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="zero-debt-box">
                  <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <h4>{language === 'km' ? 'គ្មានការជំពាក់លុយគ្នាទេ!' : 'Everyone is settled up!'}</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to Add Expense */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.5rem' }}>
            <h3>➕ {t.addExpense}</h3>

            <form onSubmit={handleAddExpense} className="modern-form">
              <InputField
                label={t.expenseTitle}
                required
                placeholder="e.g. Guide Fee, Motorbike Fuel, Market Food"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
              />

              <div className="form-grid-2">
                <InputField
                  label={t.amount}
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  icon={<DollarSign size={17} />}
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                />
                <SelectField
                  label="Currency"
                  value={expCurrency}
                  onChange={(val) => setExpCurrency(val as 'USD' | 'KHR')}
                  options={currencyOptions}
                />
              </div>

              <SelectField
                label={t.paidBy}
                value={expPaidBy}
                onChange={(val) => setExpPaidBy(val)}
                options={memberOptions}
              />

              <SelectField
                label="Category"
                value={expCategory}
                onChange={(val) => setExpCategory(val as any)}
                options={categoryOptions}
              />

              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  {t.close}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t.addExpense}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Expense Modal */}
      {showExportModal && (
        <ExportExpenseModal
          members={members}
          expenses={expenses}
          debts={settlements}
          totalExpenseUSD={totalExpenseUSD}
          onClose={() => setShowExportModal(false)}
        />
      )}

      <style>{`
        .expense-splitter-page {
          padding: 2.5rem 1.25rem;
        }
        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .expense-layout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        @media (max-width: 992px) {
          .expense-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        .glass-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-md);
        }
        .members-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .member-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 0.25rem 0.75rem 0.25rem 0.25rem;
          font-size: 0.85rem;
        }
        .member-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .delete-member-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          font-size: 0.8rem;
          margin-left: 0.2rem;
        }
        .delete-member-btn:hover {
          color: var(--accent-red);
        }
        .add-member-form {
          display: flex;
          gap: 0.5rem;
        }
        .add-member-form input {
          flex: 1;
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius-md);
          padding: 0.55rem 0.85rem;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.9rem;
          outline: none;
          transition: var(--transition);
          box-shadow: var(--input-shadow);
        }
        .add-member-form input::placeholder {
          color: var(--text-dim);
          opacity: 0.85;
        }
        .add-member-form input:hover {
          border-color: var(--input-border-hover);
          background: var(--input-bg-hover);
        }
        .add-member-form input:focus {
          border-color: var(--primary);
          background: var(--input-bg-focus);
          box-shadow: var(--input-focus-shadow);
        }
        .expenses-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .expense-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
        }
        .exp-icon {
          display: flex;
          align-items: center;
        }
        .exp-info {
          flex: 1;
        }
        .exp-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .exp-amount {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          color: var(--primary);
        }
        .delete-exp-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
        }
        .delete-exp-btn:hover {
          color: var(--accent-red);
        }
        .settlement-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .settlement-results {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .settlement-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .person-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
        }
        .person-box img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .transfer-arrow {
          align-items: center;
          text-align: center;
        }
        .debt-usd {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
        }
        .debt-khr {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .zero-debt-box {
          text-align: center;
          padding: 3rem 1rem;
        }
      `}</style>
    </div>
  );
};

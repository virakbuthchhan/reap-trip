'use client';

import React, { useState, useEffect } from 'react';
import { TripMember, ExpenseItem, TripExpenseGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  Calculator,
  Plus,
  UserPlus,
  Trash2,
  Pencil,
  ArrowRight,
  Share2,
  Check,
  Receipt,
  Sparkles,
  Download,
  Calendar,
  MapPin,
  ChevronLeft,
  PieChart,
  X,
  Smile,
} from 'lucide-react';
import { ExportExpenseModal } from './ExportExpenseModal';
import { InputField } from './ui/InputField';
import { SelectField, SelectOption } from './ui/SelectField';
import {
  useTripGroupsQuery,
  useCreateTripGroupMutation,
  useExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useSettlementsQuery,
} from '@/hooks/useApi';
import { USD_TO_KHR } from '@/constants/currency';

// Preset emojis for random fallback or quick picker
const PRESET_MEMBER_EMOJIS = ['🏕️', '🧗', '🎒', '⛺', '🧭', '🌲', '🧢', '🚴', '🌄', '🥾', '🔥', '🛶', '📸', '🌾'];

// Currency formatting helpers
export const formatUSD = (val: number) => `$${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatKHR = (val: number) => `៛${Math.round(val || 0).toLocaleString('en-US')}`;

// Helper component to render member avatar (URL or Emoji Badge)
export const MemberAvatar: React.FC<{ avatar?: string; name: string; size?: number }> = ({ avatar, name, size = 24 }) => {
  const isUrl = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:'));

  if (isUrl) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5px solid var(--card-bg)',
          flexShrink: 0,
        }}
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=64`;
        }}
      />
    );
  }

  const emoji = avatar || PRESET_MEMBER_EMOJIS[Math.abs(name.charCodeAt(0) || 0) % PRESET_MEMBER_EMOJIS.length];

  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.55}px`,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {emoji}
    </span>
  );
};

export const ExpenseSplitter: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  // Active view: null = Trip History List, string = Active Trip ID
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  // Fetch all trip expense groups from API
  const { data: tripGroups = [], isLoading: isLoadingTrips } = useTripGroupsQuery();
  const createTripGroupMutation = useCreateTripGroupMutation();

  // Fetch active trip expenses & settlements
  const { data: apiExpenses = [], isLoading: isLoadingExpenses } = useExpensesQuery(activeTripId || undefined);
  const { data: settlementData } = useSettlementsQuery(activeTripId || undefined);

  const addExpenseMutation = useAddExpenseMutation();
  const updateExpenseMutation = useUpdateExpenseMutation();
  const deleteExpenseMutation = useDeleteExpenseMutation();

  // Modal states
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Create Trip Form state
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripDate, setNewTripDate] = useState('');
  const [newTripMembers, setNewTripMembers] = useState<TripMember[]>([
    { id: 'm1', name: 'Vireak (Me)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
    { id: 'm2', name: 'Bopha', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  ]);

  // Add Member Input states
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  // Add/Edit Expense Form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCurrency, setExpCurrency] = useState<'USD' | 'KHR'>('USD');
  const [expPaidBy, setExpPaidBy] = useState('m1');
  const [expSplitAmong, setExpSplitAmong] = useState<string[]>(['m1', 'm2']);
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('food');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Check URL search parameters on mount (e.g., /expenses?tripId=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramTripId = params.get('tripId');
      if (paramTripId) {
        setActiveTripId(paramTripId);
      }
    }
  }, []);

  const activeTrip = tripGroups.find((t) => t.id === activeTripId);
  const activeMembers: TripMember[] = activeTrip?.members || newTripMembers;

  const currencyOptions: SelectOption[] = [
    { value: 'USD', label: 'USD ($)', icon: '💵' },
    { value: 'KHR', label: 'KHR (៛ Riel)', icon: '៛' },
  ];

  const memberOptions: SelectOption[] = activeMembers.map((m) => ({
    value: m.id,
    label: m.name,
    icon: '👤',
  }));

  const categoryOptions: SelectOption[] = [
    { value: 'fuel', label: language === 'km' ? 'ប្រេងសាំង/ធ្វើដំណើរ' : 'Fuel & Transport', icon: '⛽' },
    { value: 'food', label: language === 'km' ? 'អាហារ & គ្រឿងទេស' : 'Food & Market Grocery', icon: '🍲' },
    { value: 'guide_fee', label: language === 'km' ? 'ថ្លៃអ្នកនាំផ្លូវ & សហគមន៍' : 'Local Guide & Ranger Fee', icon: '👤' },
    { value: 'camp_fee', label: language === 'km' ? 'ថ្លៃតំបន់បោះជំរុំ' : 'Campsite Fee', icon: '⛺' },
    { value: 'transport_rental', label: language === 'km' ? 'ជួលគោយន្ត/ទូក/ម៉ូតូ' : 'Transport Rental', icon: '🛵' },
    { value: 'other', label: language === 'km' ? 'ការចំណាយផ្សេងៗ' : 'Other Expense', icon: '📦' },
  ];

  // Handle Add Member to New Trip
  const handleAddMemberToNewTrip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMemberName.trim()) return;

    let avatarVal = newMemberAvatar.trim();
    if (!avatarVal) {
      avatarVal = PRESET_MEMBER_EMOJIS[Math.floor(Math.random() * PRESET_MEMBER_EMOJIS.length)];
    }

    const newM: TripMember = {
      id: `m_${Date.now()}`,
      name: newMemberName.trim(),
      avatar: avatarVal,
    };

    setNewTripMembers([...newTripMembers, newM]);
    setNewMemberName('');
    setNewMemberAvatar('');
    setShowAvatarOptions(false);
  };

  const handleRemoveMemberFromNewTrip = (memberId: string) => {
    setNewTripMembers(newTripMembers.filter((m) => m.id !== memberId));
  };

  // Open Edit Expense Modal
  const handleEditExpenseClick = (exp: ExpenseItem) => {
    setEditingExpenseId(exp.id);
    setExpTitle(exp.title);
    setExpAmount(String(exp.amount));
    setExpCurrency(exp.currency);
    setExpPaidBy(exp.paidByMemberId);
    setExpSplitAmong(exp.splitAmongMemberIds || []);
    setExpCategory(exp.category);
    setShowAddExpenseModal(true);
  };

  // Open Add Expense Modal
  const handleOpenAddExpenseModal = () => {
    setEditingExpenseId(null);
    setExpTitle('');
    setExpAmount('');
    setExpCurrency('USD');
    setExpPaidBy(activeMembers[0]?.id || 'm1');
    setExpSplitAmong(activeMembers.map((m) => m.id));
    setExpCategory('food');
    setShowAddExpenseModal(true);
  };

  // Handle Create Trip
  const handleCreateTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) {
      showToast(language === 'km' ? 'សូមបញ្ចូលឈ្មោះដំណើរកម្សាន្ត!' : 'Please enter a trip title!', 'error');
      return;
    }

    try {
      const created = await createTripGroupMutation.mutateAsync({
        title: newTripTitle.trim(),
        destination: newTripDestination.trim(),
        startDate: newTripDate || new Date().toISOString().split('T')[0],
        members: newTripMembers,
      });

      showToast(language === 'km' ? 'បង្កើតដំណើរកម្សាន្តជោគជ័យ!' : 'Trip created successfully!', 'success');
      setShowCreateTripModal(false);
      setActiveTripId(created.id);
      setNewTripTitle('');
      setNewTripDestination('');
    } catch (err: any) {
      showToast(err.message || 'Failed to create trip', 'error');
    }
  };

  // Handle Add or Edit Expense Submit
  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount || Number(expAmount) <= 0) {
      showToast(language === 'km' ? 'សូមបញ្ចូលឈ្មោះ និងចំនួនប្រាក់ត្រឹមត្រូវ!' : 'Please enter a valid title and amount!', 'error');
      return;
    }
    if (expSplitAmong.length === 0) {
      showToast(language === 'km' ? 'សូមជ្រើសរើសយ៉ាងហោចណាស់ម្នាក់ដើម្បីចែករំលែក!' : 'Select at least one member to split!', 'error');
      return;
    }

    try {
      if (editingExpenseId) {
        await updateExpenseMutation.mutateAsync({
          id: editingExpenseId,
          tripGroupId: activeTripId || undefined,
          title: expTitle,
          amount: Number(expAmount),
          currency: expCurrency,
          paidByMemberId: expPaidBy,
          splitAmongMemberIds: expSplitAmong,
          category: expCategory,
          date: new Date().toISOString().split('T')[0],
        });
        showToast(language === 'km' ? 'បានកែប្រែការចំណាយជោគជ័យ!' : 'Expense updated successfully!', 'success');
      } else {
        await addExpenseMutation.mutateAsync({
          tripGroupId: activeTripId || undefined,
          title: expTitle,
          amount: Number(expAmount),
          currency: expCurrency,
          paidByMemberId: expPaidBy,
          splitAmongMemberIds: expSplitAmong,
          category: expCategory,
          date: new Date().toISOString().split('T')[0],
        });
        showToast(language === 'km' ? 'បានបន្ថែមការចំណាយជោគជ័យ!' : 'Expense item added!', 'success');
      }

      setShowAddExpenseModal(false);
      setEditingExpenseId(null);
      setExpTitle('');
      setExpAmount('');
    } catch (err: any) {
      showToast(err.message || 'Failed to save expense', 'error');
    }
  };

  // Share Trip Link
  const handleCopyShareLink = (tripId?: string) => {
    const targetId = tripId || activeTripId;
    const url = `${window.location.origin}/expenses?tripId=${targetId}`;
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    showToast(
      language === 'km' ? 'បានចម្លងតំណដំណើរកម្សាន្ត! អ្នកអាចផ្ញើទៅកាន់មិត្តភក្តិ' : 'Trip link copied! Share it with your group members.',
      'success'
    );
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const settlements = settlementData?.settlements || [];
  const rawTotalUSD = settlementData?.totalExpensesUSD || 0;
  const formattedTotalUSD = formatUSD(rawTotalUSD);
  const formattedTotalKHR = formatKHR(rawTotalUSD * USD_TO_KHR);

  return (
    <div className="expenses-page container">
      {/* Page Header */}
      <div className="expense-page-header" style={{ marginBottom: '2rem' }}>
        <div className="header-text-group">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 800 }}>
            <Calculator size={28} color="var(--primary)" />
            <span>{language === 'km' ? 'ប្រព័ន្ធគណនា និងរក្សាប្រវត្តិការចំណាយដំណើរកម្សាន្ត' : 'Group Trip Expense History & Splitter'}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {language === 'km'
              ? 'បង្កើតដំណើរកម្សាន្ត រក្សាប្រវត្តិ និងចែករំលែកតំណទៅកាន់មិត្តភក្តិដើម្បីបញ្ចូលការចំណាយរួមគ្នា'
              : 'Create trip groups, track expense histories, and share trip links so participants can record expenses.'}
          </p>
        </div>

        {!activeTripId && (
          <button className="btn btn-primary" onClick={() => setShowCreateTripModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            <span>{language === 'km' ? 'បង្កើតដំណើរកម្សាន្តថ្មី (e.g. ទ្រីបទៅOral Mountain)' : 'Create New Trip (e.g. Phnom Aural Trip)'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: TRIP HISTORY SCREEN */}
      {!activeTripId ? (
        <div className="trip-history-section">
          {isLoadingTrips ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              {language === 'km' ? 'កំពុងទាញយកប្រវត្តិដំណើរកម្សាន្ត...' : 'Loading trip history...'}
            </div>
          ) : tripGroups.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '20px',
                border: '1px dashed var(--border-color)',
              }}
            >
              <Receipt size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
              <h3>{language === 'km' ? 'មិនទាន់មានប្រវត្តិដំណើរកម្សាន្ត' : 'No Trip Expenses Recorded Yet'}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {language === 'km'
                  ? 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតដំណើរកម្សាន្តដំបូងរបស់អ្នក (ឧ. ទ្រីបទៅ Oral Mountain)'
                  : 'Click below to create your first group trip expense history (e.g., Oral Mountain Summit Trip).'}
              </p>
              <button className="btn btn-primary" onClick={() => setShowCreateTripModal(true)}>
                <Plus size={18} />
                <span>{language === 'km' ? 'បង្កើតដំណើរកម្សាន្តដំបូង' : 'Create First Trip'}</span>
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  📂 {language === 'km' ? 'ប្រវត្តិដំណើរកម្សាន្តទាំងអស់ (' + tripGroups.length + ')' : 'All Recorded Trips (' + tripGroups.length + ')'}
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {tripGroups.map((trip) => (
                  <div
                    key={trip.id}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                          <Calendar size={12} style={{ marginRight: '4px' }} />
                          {trip.startDate || '2026-02-14'}
                        </span>
                        <button
                          className="icon-btn"
                          onClick={() => handleCopyShareLink(trip.id)}
                          title="Copy Share Link"
                          style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        >
                          <Share2 size={14} />
                        </button>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        {trip.title}
                      </h3>

                      {trip.destination && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                          <MapPin size={14} />
                          <span>{trip.destination}</span>
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', margin: '0 4px 0 0' }}>
                          {(trip.members || []).slice(0, 4).map((m, idx) => (
                            <div key={m.id || idx} style={{ marginLeft: idx > 0 ? '-8px' : 0 }}>
                              <MemberAvatar avatar={m.avatar} name={m.name} size={28} />
                            </div>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {(trip.members || []).length} {language === 'km' ? 'សមាជិកចូលរួម' : 'Participants'}
                        </span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          {language === 'km' ? 'សរុបចំណាយ:' : 'Total Expense:'}
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                          {formatUSD(trip.totalSpentUSD || 0)}
                        </strong>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => setActiveTripId(trip.id)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <span>{language === 'km' ? 'មើលចំណាយ' : 'View Expenses'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: DETAILED TRIP EXPENSE TRACKER */
        <div>
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTripId(null)}
                style={{ padding: '0.5rem 0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ChevronLeft size={18} />
                <span>{language === 'km' ? 'ត្រឡប់ទៅបញ្ជីដំណើរកម្សាន្ត' : 'All Trips'}</span>
              </button>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  {activeTrip?.title || 'Trip Expenses'}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {activeTrip?.destination ? `📍 ${activeTrip.destination} • ` : ''}
                  {(activeMembers || []).length} {language === 'km' ? 'សមាជិកចូលរួម' : 'Participants'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleCopyShareLink()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
              >
                {copiedShareLink ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                <span>{language === 'km' ? 'ចែករំលែកតំណទៅកាន់មិត្តភក្តិ' : 'Share Trip Link'}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={handleOpenAddExpenseModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={18} />
                <span>{language === 'km' ? 'បន្ថែមការចំណាយ' : 'Add Expense Item'}</span>
              </button>
            </div>
          </div>

          {/* Members Bar */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              👥 {language === 'km' ? 'សមាជិកក្នុងដំណើរកម្សាន្តនេះ:' : 'Trip Participants:'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeMembers.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <MemberAvatar avatar={m.avatar} name={m.name} size={20} />
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout: Expenses Table & Settlement Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
            {/* Left: Expenses Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  🧾 {language === 'km' ? 'បញ្ជីចំណាយទាំងអស់ (' + apiExpenses.length + ')' : 'Recorded Expense Items (' + apiExpenses.length + ')'}
                </h4>
              </div>

              {isLoadingExpenses ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {language === 'km' ? 'កំពុងទាញយកការចំណាយ...' : 'Loading expenses...'}
                </div>
              ) : apiExpenses.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px dashed var(--border-color)',
                  }}
                >
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {language === 'km' ? 'មិនទាន់មានការចំណាយបានបញ្ចូលក្នុងដំណើរកម្សាន្តនេះទេ' : 'No expenses recorded for this trip yet.'}
                  </p>
                  <button className="btn btn-primary" onClick={handleOpenAddExpenseModal}>
                    <Plus size={16} />
                    <span>{language === 'km' ? 'បញ្ចូលការចំណាយដំបូង' : 'Record First Expense'}</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {apiExpenses.map((exp) => {
                    const payer = activeMembers.find((m) => m.id === exp.paidByMemberId) || { name: exp.paidByMemberId, avatar: '' };
                    const splitCount = (exp.splitAmongMemberIds || []).length || 1;

                    // Clean Currency Formatting logic
                    const isUSD = exp.currency === 'USD';
                    const mainAmountFormatted = isUSD ? formatUSD(exp.amount) : formatKHR(exp.amount);
                    const convertedSubtextFormatted = isUSD
                      ? `~${formatKHR(exp.amount * USD_TO_KHR)}`
                      : `~${formatUSD(exp.amount / USD_TO_KHR)}`;

                    return (
                      <div
                        key={exp.id}
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <MemberAvatar avatar={payer.avatar} name={payer.name} size={38} />
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-main)' }}>{exp.title}</h4>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {language === 'km' ? 'ទូទាត់ដោយ:' : 'Paid by:'} <strong>{payer.name}</strong> •{' '}
                              {language === 'km' ? 'ចែករំលែករវាង:' : 'Split among:'} {splitCount} {language === 'km' ? 'នាក់' : 'people'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: '1.15rem', color: 'var(--primary)', display: 'block' }}>
                              {mainAmountFormatted}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {convertedSubtextFormatted}
                            </span>
                          </div>

                          {/* Edit & Delete Action Buttons */}
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleEditExpenseClick(exp)}
                              style={{
                                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                                border: 'none',
                                color: '#0284c7',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title={language === 'km' ? 'កែប្រែចំណាយ' : 'Edit Expense'}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              onClick={() => deleteExpenseMutation.mutate(exp.id)}
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title={language === 'km' ? 'លុបចំណាយ' : 'Delete Expense'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Settlement & Debt Summary */}
            <div>
              <div
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  position: 'sticky',
                  top: '90px',
                }}
              >
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieChart size={18} color="var(--primary)" />
                  <span>{language === 'km' ? 'សេចក្តីសង្ខេបទូទាត់សងប្រាក់' : 'Debt Settlement Summary'}</span>
                </h4>

                {/* Total Expense Display with Clean Formatting */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '16px',
                    padding: '1.25rem 1rem',
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    {language === 'km' ? 'សរុបចំណាយក្នុងដំណើរកម្សាន្តនេះ:' : 'Total Trip Expense:'}
                  </span>
                  <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', display: 'block', lineHeight: 1.2 }}>
                    {formattedTotalUSD}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem', display: 'block' }}>
                    ({formattedTotalKHR})
                  </span>
                </div>

                {/* Settlements list */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {language === 'km' ? 'អ្នកត្រូវទូទាត់សងប្រាក់គ្នា:' : 'Who owes whom:'}
                  </h5>

                  {(() => {
                    const validSettlements = settlements.filter((s: any) => {
                      const fromM = activeMembers.find((m) => m.id === s.fromMemberId);
                      const toM = activeMembers.find((m) => m.id === s.toMemberId);
                      return !!fromM && !!toM && s.fromMemberId !== s.toMemberId;
                    });

                    if (validSettlements.length === 0) {
                      return (
                        <p style={{ fontSize: '0.85rem', color: '#10b981', textAlign: 'center', margin: '1rem 0' }}>
                          {language === 'km' ? '✨ គ្មានបំណុលត្រូវទូទាត់សងគ្នាទេ!' : '✨ All expenses are balanced!'}
                        </p>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {validSettlements.map((s: any, idx: number) => {
                          const fromMember = activeMembers.find((m) => m.id === s.fromMemberId)!;
                          const toMember = activeMembers.find((m) => m.id === s.toMemberId)!;

                          return (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: 'var(--bg-main, #f8fafc)',
                                borderRadius: '12px',
                                padding: '0.75rem 0.875rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MemberAvatar avatar={fromMember.avatar} name={fromMember.name} size={22} />
                                <strong>{fromMember.name}</strong>
                                <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>➔</span>
                                <MemberAvatar avatar={toMember.avatar} name={toMember.name} size={22} />
                                <strong>{toMember.name}</strong>
                              </div>
                              <strong style={{ color: 'var(--primary)', flexShrink: 0, marginLeft: '0.5rem' }}>
                                {formatUSD(s.amountUSD)} ({formatKHR(s.amountKHR)})
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <button className="btn btn-secondary btn-full" onClick={() => setShowExportModal(true)}>
                  <Download size={15} />
                  <span>{language === 'km' ? 'ទាញយករបាយការណ៍សង្ខេប' : 'Export Trip Summary'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TRIP MODAL */}
      {showCreateTripModal && (
        <div className="modal-overlay" onClick={() => setShowCreateTripModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header-sticky">
              <div className="modal-header-title-wrap">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'បង្កើតដំណើរកម្សាន្តថ្មី' : 'Create New Trip Expense Group'}</span>
                </h3>
              </div>
              <button className="modal-icon-btn close-btn" onClick={() => setShowCreateTripModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTripSubmit} className="modern-form">
              <div className="modal-body-scrollable">
                <InputField
                  label={language === 'km' ? 'ឈ្មោះដំណើរកម្សាន្ត (Trip Title)' : 'Trip Title (e.g. Phnom Aural Summit)'}
                  placeholder={language === 'km' ? 'ឧ. ទ្រីបទៅ Oral Mountain' : 'e.g. Oral Mountain Hike 2026'}
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  required
                />

                <InputField
                  label={language === 'km' ? 'ទីតាំងរមណីយដ្ឋាន' : 'Destination / Location'}
                  placeholder={language === 'km' ? 'ឧ. ភ្នំឱរ៉ាល់ (Phnom Aural)' : 'e.g. Phnom Aural, Kampong Speu'}
                  value={newTripDestination}
                  onChange={(e) => setNewTripDestination(e.target.value)}
                />

                <InputField
                  label={language === 'km' ? 'ថ្ងៃខែកម្សាន្ត' : 'Trip Date'}
                  type="date"
                  value={newTripDate}
                  onChange={(e) => setNewTripDate(e.target.value)}
                />

                {/* Enhanced Member Input with Custom Avatar / Emoji Picker */}
                <div className="form-field-group">
                  <label className="form-field-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{language === 'km' ? 'បញ្ជីសមាជិកចូលរួមដំណើរកម្សាន្ត:' : 'Trip Participants:'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {language === 'km' ? 'បើមិនជ្រើសរើសរូប នឹងកំណត់ Emoji ដោយស្វ័យប្រវត្តិ' : 'Auto emoji set if no avatar url'}
                    </span>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                        <MemberAvatar avatar={newMemberAvatar || '🏕️'} name={newMemberName || 'New'} size={38} />
                        <button
                          type="button"
                          onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                          title="Pick Avatar / Emoji"
                          style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Smile size={11} />
                        </button>
                      </div>

                      <input
                        type="text"
                        className="custom-modern-input"
                        placeholder={language === 'km' ? 'បញ្ចូលឈ្មោះសមាជិក...' : 'Add participant name...'}
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMemberToNewTrip();
                          }
                        }}
                        style={{ flex: 1 }}
                      />

                      <button type="button" className="btn btn-secondary" onClick={() => handleAddMemberToNewTrip()} style={{ padding: '0 0.875rem' }}>
                        <UserPlus size={16} />
                      </button>
                    </div>

                    {showAvatarOptions && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                        }}
                      >
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            {language === 'km' ? 'រូបតំណាង Image URL (តាមចំណង់ចំណូលចិត្ត):' : 'Custom Avatar Image URL (optional):'}
                          </span>
                          <input
                            type="url"
                            className="custom-modern-input"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newMemberAvatar}
                            onChange={(e) => setNewMemberAvatar(e.target.value)}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                          />
                        </div>

                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                          {language === 'km' ? 'ឬជ្រើសរើស Emoji តំណាង:' : 'Or pick an emoji icon:'}
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {PRESET_MEMBER_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setNewMemberAvatar(emoji);
                                setShowAvatarOptions(false);
                              }}
                              style={{
                                border: newMemberAvatar === emoji ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                backgroundColor: newMemberAvatar === emoji ? 'rgba(16, 185, 129, 0.15)' : 'var(--card-bg)',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {newTripMembers.map((m) => (
                      <span
                        key={m.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: 'var(--primary)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                        }}
                      >
                        <MemberAvatar avatar={m.avatar} name={m.name} size={20} />
                        <span>{m.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberFromNewTrip(m.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Remove member"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions-sticky">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateTripModal(false)}>
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>{language === 'km' ? 'បង្កើតដំណើរកម្សាន្ត' : 'Create Trip'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT EXPENSE ITEM MODAL */}
      {showAddExpenseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header-sticky">
              <div className="modal-header-title-wrap">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {editingExpenseId ? <Pencil size={20} color="var(--primary)" /> : <Plus size={20} color="var(--primary)" />}
                  <span>
                    {editingExpenseId
                      ? language === 'km'
                        ? 'កែប្រែការចំណាយ'
                        : 'Edit Expense Item'
                      : language === 'km'
                      ? 'បញ្ចូលការចំណាយថ្មី'
                      : 'Record New Expense Item'}
                  </span>
                </h3>
              </div>
              <button className="modal-icon-btn close-btn" onClick={() => setShowAddExpenseModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="modern-form">
              <div className="modal-body-scrollable">
                <InputField
                  label={language === 'km' ? 'បរិយាយការចំណាយ' : 'Expense Title'}
                  placeholder={language === 'km' ? 'ឧ. ថ្លៃសាំង, ថ្លៃអ្នកនាំផ្លូវ, ថ្លៃម្ហូប' : 'e.g. Guide Fee, Fuel, Grocery'}
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  required
                />

                <div className="form-grid-2">
                  <InputField
                    label={language === 'km' ? 'ចំនួនទឹកប្រាក់' : 'Amount'}
                    type="number"
                    placeholder="0.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    required
                  />

                  <SelectField
                    label={language === 'km' ? 'រូបីយប័ណ្ណ' : 'Currency'}
                    value={expCurrency}
                    onChange={(val) => setExpCurrency(val as 'USD' | 'KHR')}
                    options={currencyOptions}
                  />
                </div>

                <div className="form-grid-2">
                  <SelectField
                    label={language === 'km' ? 'អ្នកចំណាយមុន (Paid By)' : 'Paid By'}
                    value={expPaidBy}
                    onChange={(val) => setExpPaidBy(val)}
                    options={memberOptions}
                  />

                  <SelectField
                    label={language === 'km' ? 'ប្រភេទចំណាយ' : 'Category'}
                    value={expCategory}
                    onChange={(val) => setExpCategory(val as any)}
                    options={categoryOptions}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">
                    {language === 'km' ? 'ចែករំលែករវាងសមាជិក (Split Among):' : 'Split Among Participants:'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {activeMembers.map((m) => {
                      const isChecked = expSplitAmong.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-main)',
                            border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExpSplitAmong([...expSplitAmong, m.id]);
                              } else {
                                setExpSplitAmong(expSplitAmong.filter((id) => id !== m.id));
                              }
                            }}
                          />
                          <MemberAvatar avatar={m.avatar} name={m.name} size={20} />
                          <span>{m.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-actions-sticky">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpenseModal(false)}>
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExpenseId ? <Pencil size={16} /> : <Plus size={16} />}
                  <span>{editingExpenseId ? (language === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes') : (language === 'km' ? 'រក្សាទុកការចំណាយ' : 'Save Expense')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT SUMMARY MODAL */}
      {showExportModal && (
        <ExportExpenseModal
          expenses={apiExpenses}
          members={activeMembers}
          debts={settlements}
          totalExpenseUSD={rawTotalUSD}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { PackingItem, TransportType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckSquare, Bike, Car, Truck, Footprints, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

interface PackingChecklistProps {
  initialItems: PackingItem[];
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({ initialItems }) => {
  const { language, t } = useLanguage();

  const [items, setItems] = useState<PackingItem[]>(initialItems);
  const [selectedTransportFilter, setSelectedTransportFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('shelter');

  const togglePacked = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `p_${Date.now()}`,
      titleEn: newItemName.trim(),
      titleKm: newItemName.trim(),
      category: newItemCategory,
      essentialForCamping: true,
      packed: false,
      recommendedFor: ['motorbike', 'sedan_car', 'suv_4x4', 'foot']
    };

    setItems([...items, newItem]);
    setNewItemName('');
  };

  const filteredItems = items.filter((item) => {
    const matchesTransport =
      selectedTransportFilter === 'all' ||
      item.recommendedFor.includes(selectedTransportFilter as TransportType);

    const matchesCategory =
      selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

    return matchesTransport && matchesCategory;
  });

  const packedCount = filteredItems.filter((i) => i.packed).length;
  const progressPercentage = filteredItems.length > 0 ? Math.round((packedCount / filteredItems.length) * 100) : 0;

  return (
    <div className="checklist-page container">
      {/* Header */}
      <div className="section-header flex-between">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={22} color="var(--primary)" />
            <span>{t.checklistHeader}</span>
          </h2>
          <p>{t.checklistSub}</p>
        </div>

        {/* Progress Card */}
        <div className="progress-summary-card">
          <div className="progress-text">
            <span>{language === 'km' ? 'បានរៀបចំ:' : 'Packed Progress:'}</span>
            <strong>{packedCount} / {filteredItems.length} ({progressPercentage}%)</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="checklist-filter-bar">
        <div className="filter-group">
          <span>{language === 'km' ? 'មធ្យោបាយ:' : 'Transport:'}</span>
          <button
            className={`filter-chip ${selectedTransportFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTransportFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-chip ${selectedTransportFilter === 'motorbike' ? 'active' : ''}`}
            onClick={() => setSelectedTransportFilter('motorbike')}
          >
            <Bike size={13} style={{ marginRight: '4px' }} /> Motorbike
          </button>
          <button
            className={`filter-chip ${selectedTransportFilter === 'suv_4x4' ? 'active' : ''}`}
            onClick={() => setSelectedTransportFilter('suv_4x4')}
          >
            <Truck size={13} style={{ marginRight: '4px' }} /> 4x4 SUV
          </button>
          <button
            className={`filter-chip ${selectedTransportFilter === 'foot' ? 'active' : ''}`}
            onClick={() => setSelectedTransportFilter('foot')}
          >
            <Footprints size={13} style={{ marginRight: '4px' }} /> Trekking Foot
          </button>
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="checklist-items-card glass-card">
        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            placeholder={language === 'km' ? 'បន្ថែមសម្ភារៈដើរព្រៃថ្មី...' : 'Add new gear item...'}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={16} /> {language === 'km' ? 'បន្ថែម' : 'Add Item'}
          </button>
        </form>

        <div className="items-list-rows">
          {filteredItems.map((item) => {
            const name = language === 'km' ? item.titleKm : item.titleEn;
            return (
              <div key={item.id} className={`checklist-item-row ${item.packed ? 'packed' : ''}`} onClick={() => togglePacked(item.id)}>
                <div className="item-checkbox">
                  <input type="checkbox" checked={item.packed} readOnly />
                </div>
                <div className="item-details">
                  <strong style={{ textDecoration: item.packed ? 'line-through' : 'none' }}>{name}</strong>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem', marginLeft: '6px' }}>{item.category}</span>
                  {item.essentialForCamping && (
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem', marginLeft: '4px' }}>Essential</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .checklist-page {
          padding: 2.5rem 1.25rem;
        }
        .progress-summary-card {
          background: var(--bg-card);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          padding: 0.75rem 1.25rem;
          min-width: 240px;
        }
        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }
        .progress-text strong {
          color: var(--primary);
        }
        .progress-bar-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .checklist-filter-bar {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          cursor: pointer;
        }
        .filter-chip.active {
          background: var(--primary);
          color: #ffffff;
        }
        .checklist-items-card {
          padding: 1.5rem;
        }
        .add-item-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .add-item-form input {
          flex: 1;
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius-md);
          padding: 0.6rem 0.85rem;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.9rem;
          outline: none;
          transition: var(--transition);
          box-shadow: var(--input-shadow);
        }
        .add-item-form input::placeholder {
          color: var(--text-dim);
          opacity: 0.85;
        }
        .add-item-form input:hover {
          border-color: var(--input-border-hover);
          background: var(--input-bg-hover);
        }
        .add-item-form input:focus {
          border-color: var(--primary);
          background: var(--input-bg-focus);
          box-shadow: var(--input-focus-shadow);
        }
        .items-list-rows {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .checklist-item-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          cursor: pointer;
        }
        .checklist-item-row.packed {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

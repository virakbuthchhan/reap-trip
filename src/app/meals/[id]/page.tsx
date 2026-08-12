'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { initialRecipes } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Clock, Users, Utensils, Flame, ChefHat, CheckCircle2, ShoppingBag, Sparkles, User } from 'lucide-react';
import { Recipe } from '@/types';

export default function RecipeDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const recipeId = params.id as string;

  const [recipes] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_recipes');
      return saved ? JSON.parse(saved) : initialRecipes;
    }
    return initialRecipes;
  });

  const [groupSize, setGroupSize] = useState<number>(4);

  const recipe = recipes.find((r) => r.id === recipeId) || recipes[0];

  if (!recipe) {
    return (
      <div className="container text-center" style={{ padding: '5rem 1rem' }}>
        <h2>Recipe Not Found</h2>
        <Link href="/meals" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ← Back to Meals Planner
        </Link>
      </div>
    );
  }

  const title = language === 'km' ? recipe.titleKm : recipe.titleEn;
  const desc = language === 'km' ? recipe.descriptionKm : recipe.descriptionEn;
  const instructions = (language === 'km' ? recipe.instructionsKm : recipe.instructionsEn) || [
    'Prepare ingredients and clean camp pot.',
    'Cook over campfire or portable gas stove.',
    'Serve hot and enjoy!'
  ];

  return (
    <div className="recipe-detail-page container" style={{ padding: '2rem 1.25rem' }}>
      {/* Back Navigation Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/meals" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>{language === 'km' ? 'ត្រឡប់ទៅបញ្ជីមុខម្ហូប' : 'Back to Camp Meals'}</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="glass-card recipe-hero-card">
        <div className="recipe-hero-grid">
          <div className="recipe-hero-image">
            <img src={recipe.image} alt={title} />
            <span className="badge badge-emerald category-tag">{recipe.category.toUpperCase()}</span>
          </div>

          <div className="recipe-hero-info">
            <h2>{title}</h2>
            <p className="recipe-desc-text">{desc}</p>

            <div className="recipe-meta-row">
              <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {recipe.prepTimeMinutes} {language === 'km' ? 'នាទី' : 'mins prep'}
              </span>
              {recipe.authorName && (
                <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} /> {recipe.authorName}
                </span>
              )}
            </div>

            {/* Scaled Headcount Controls */}
            <div className="scaled-headcount-box">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="var(--primary)" />
                <strong>{language === 'km' ? 'តម្រូវតាមចំនួនសមាជិក:' : 'Scale for Group Size:'}</strong>
              </span>
              <div className="counter-controls">
                <button className="counter-btn" onClick={() => setGroupSize(Math.max(1, groupSize - 1))}>-</button>
                <strong className="counter-val">{groupSize} {language === 'km' ? 'នាក់' : 'people'}</strong>
                <button className="counter-btn" onClick={() => setGroupSize(groupSize + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Column Layout: Scaled Ingredients & Step-by-Step Cooking Guide */}
      <div className="recipe-body-grid">
        {/* Ingredients Column */}
        <div className="glass-card section-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <span>{language === 'km' ? 'គ្រឿងផ្សំសម្រាប់' : 'Ingredients for'} {groupSize} {language === 'km' ? 'នាក់' : 'campers'}</span>
          </h3>

          <ul className="ingredients-detail-list">
            {recipe.ingredients.map((ing, i) => {
              const scaledAmt = Math.round((ing.amountPerPerson * groupSize) * 10) / 10;
              const name = language === 'km' ? ing.nameKm : ing.nameEn;
              const unit = language === 'km' ? ing.unitKm : ing.unitEn;

              return (
                <li key={i} className="ingredient-row">
                  <div className="ing-name">
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span>{name}</span>
                  </div>
                  <strong className="ing-amount">{scaledAmt} {unit}</strong>
                </li>
              );
            })}
          </ul>

          {recipe.equipmentNeededEn && (
            <div className="equipment-needed-box" style={{ marginTop: '1.5rem' }}>
              <strong>🍳 {language === 'km' ? 'សម្ភារៈដាំស្លចាំបាច់:' : 'Required Camp Gear:'}</strong>
              <div className="equipment-tags">
                {recipe.equipmentNeededEn.map((eq, idx) => (
                  <span key={idx} className="badge badge-cyan">{eq}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions Column */}
        <div className="glass-card section-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ChefHat size={20} color="var(--primary)" />
            <span>{language === 'km' ? 'របៀបធ្វើ និងវិធីដាំស្ល' : 'Step-by-Step Cooking Instructions'}</span>
          </h3>

          <div className="instructions-timeline">
            {instructions.map((step, index) => (
              <div key={index} className="instruction-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .recipe-hero-card {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .recipe-hero-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .recipe-hero-grid {
            grid-template-columns: 1fr;
          }
        }

        .recipe-hero-image {
          position: relative;
          height: 220px;
          border-radius: 16px;
          overflow: hidden;
        }

        .recipe-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
        }

        .recipe-hero-info h2 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
        }

        .recipe-desc-text {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .recipe-meta-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .scaled-headcount-box {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid var(--border-glow);
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-full);
        }

        .counter-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .counter-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-light);
          color: var(--text-main);
          font-weight: bold;
          cursor: pointer;
          transition: var(--transition);
        }

        .counter-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        [data-theme="light"] .counter-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }

        [data-theme="light"] .counter-btn:hover {
          background: var(--primary-light);
          color: #047857;
          border-color: var(--primary);
        }

        .recipe-body-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .recipe-body-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-card {
          padding: 1.5rem;
        }

        .ingredients-detail-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .ingredient-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
        }

        .ing-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ing-amount {
          color: var(--primary);
        }

        .equipment-needed-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.85rem;
          border-radius: var(--radius-md);
        }

        .equipment-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .instructions-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .instruction-step {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 1rem;
          border-radius: var(--radius-md);
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-content p {
          color: var(--text-main);
          line-height: 1.6;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}

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

    </div>
  );
}

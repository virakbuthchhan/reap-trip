'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Recipe, RecipeIngredient } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AddRecipeModal } from './AddRecipeModal';
import { ExportGroceryModal } from './ExportGroceryModal';
import { Utensils, Users, ShoppingBag, Flame, Check, Sparkles, ChefHat, Grid, List, Plus, Printer, ArrowRight, BookOpen } from 'lucide-react';

interface MealPlannerProps {
  recipes: Recipe[];
  onAddRecipe?: (newRecipe: Recipe) => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({ recipes, onAddRecipe }) => {
  const { language, t } = useLanguage();

  const [allRecipes, setAllRecipes] = useState<Recipe[]>(recipes);
  const [groupSize, setGroupSize] = useState<number>(4);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([
    allRecipes[0]?.id || 'r1',
    allRecipes[1]?.id || 'r2'
  ]);
  const [activeTab, setActiveTab] = useState<'recipes' | 'grocery'>('recipes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const toggleRecipeSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (selectedRecipeIds.includes(id)) {
      if (selectedRecipeIds.length === 1) return; // keep at least 1
      setSelectedRecipeIds(selectedRecipeIds.filter((rId) => rId !== id));
    } else {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

  const handleAddNewRecipe = (newRecipe: Recipe) => {
    setAllRecipes([newRecipe, ...allRecipes]);
    setSelectedRecipeIds([newRecipe.id, ...selectedRecipeIds]);
    if (onAddRecipe) onAddRecipe(newRecipe);
  };

  const selectedRecipes = allRecipes.filter((r) => selectedRecipeIds.includes(r.id));

  // Scaled grocery list calculation
  const getAggregatedGroceryList = () => {
    const aggregated: { [name: string]: { amount: number; unit: string; category: string; estCost: number } } = {};

    selectedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const name = language === 'km' ? ing.nameKm : ing.nameEn;
        const unit = language === 'km' ? ing.unitKm : ing.unitEn;
        const scaledAmount = ing.amountPerPerson * groupSize;
        const estCost = scaledAmount * 0.5; // estimated per unit

        if (aggregated[name]) {
          aggregated[name].amount += scaledAmount;
          aggregated[name].estCost += estCost;
        } else {
          aggregated[name] = {
            amount: scaledAmount,
            unit: unit,
            category: ing.category,
            estCost: estCost
          };
        }
      });
    });

    return Object.entries(aggregated).map(([name, data]) => ({
      name,
      amount: Math.round(data.amount * 10) / 10,
      unit: data.unit,
      category: data.category,
      estCost: Math.round(data.estCost * 100) / 100
    }));
  };

  const groceryList = getAggregatedGroceryList();
  const totalGroceryCost = groceryList.reduce((acc, item) => acc + item.estCost, 0);

  const toggleCheck = (name: string) => {
    setCheckedItems({ ...checkedItems, [name]: !checkedItems[name] });
  };

  return (
    <div className="meal-planner-page container">
      {/* Header */}
      <div className="section-header flex-between">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={22} color="var(--primary)" />
            <span>{t.mealsHeader}</span>
          </h2>
          <p>{t.mealsSub}</p>
        </div>

        <div className="header-right-actions">
          {/* Add Recipe Button */}
          <button className="btn btn-primary btn-sm" onClick={() => setAddRecipeModalOpen(true)}>
            <Plus size={16} />
            <span>{language === 'km' ? 'ចែករំលែករូបមន្ត' : 'Share Recipe'}</span>
          </button>

          {/* Headcount Adjuster */}
          <div className="headcount-adjuster-card">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Users size={16} color="var(--primary)" /> {language === 'km' ? 'ចំនួនសមាជិក:' : 'Group Size:'}
            </span>
            <div className="counter-controls">
              <button className="counter-btn" onClick={() => setGroupSize(Math.max(1, groupSize - 1))}>-</button>
              <strong className="counter-value">{groupSize} {language === 'km' ? 'នាក់' : 'people'}</strong>
              <button className="counter-btn" onClick={() => setGroupSize(groupSize + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Tabs & View Switcher Bar */}
      <div className="meal-tab-bar flex-between">
        <div className="tab-left-group">
          <button
            className={`meal-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <ChefHat size={17} />
            <span>{language === 'km' ? 'មុខម្ហូបបោះជំរុំ' : 'Camp Recipes'} ({selectedRecipes.length})</span>
          </button>

          <button
            className={`meal-tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
            onClick={() => setActiveTab('grocery')}
          >
            <ShoppingBag size={17} />
            <span>{language === 'km' ? 'បញ្ជីផ្សារ' : 'Market Grocery List'} ({groceryList.length})</span>
          </button>
        </div>

        {/* View Mode Switcher on the FAR RIGHT */}
        {activeTab === 'recipes' && (
          <div className="view-mode-toggle desktop-view-mode-right" style={{ marginLeft: 'auto' }}>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
              <span>{language === 'km' ? 'ប្រឡោះ' : 'Grid'}</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
              <span>{language === 'km' ? 'បញ្ជី' : 'List'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Recipes Explorer */}
      {activeTab === 'recipes' && (
        <div className={viewMode === 'grid' ? 'recipes-grid' : 'recipes-list-view'}>
          {allRecipes.map((recipe) => {
            const isSelected = selectedRecipeIds.includes(recipe.id);
            const title = language === 'km' ? recipe.titleKm : recipe.titleEn;
            const desc = language === 'km' ? recipe.descriptionKm : recipe.descriptionEn;

            return (
              <Link key={recipe.id} href={`/meals/${recipe.id}`} className="recipe-card-link">
                <div
                  className={`recipe-card rounded-recipe-card glass-card ${viewMode === 'list' ? 'list-mode-card' : ''} ${isSelected ? 'selected' : ''}`}
                >
                  <div className="recipe-image-wrap">
                    <img src={recipe.image} alt={title} />
                    <button
                      className={`recipe-select-checkbox ${isSelected ? 'active' : ''}`}
                      onClick={(e) => toggleRecipeSelection(e, recipe.id)}
                      title={isSelected ? 'Selected' : 'Click to select'}
                    >
                      {isSelected ? <Check size={16} /> : '+'}
                    </button>
                  </div>

                  <div className="recipe-content">
                    <h3>{title}</h3>
                    <p className="recipe-desc">{desc}</p>

                    <div className="recipe-meta-badges">
                      <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} /> {recipe.prepTimeMinutes} {language === 'km' ? 'នាទី' : 'mins'}
                      </span>
                      <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> Scaled for {groupSize} {language === 'km' ? 'នាក់' : 'people'}
                      </span>
                    </div>

                    {/* Scaled Ingredients Preview */}
                    <div className="ingredients-preview-list">
                      <strong>Ingredients for {groupSize} campers:</strong>
                      <ul>
                        {recipe.ingredients.map((ing, i) => {
                          const scaledAmt = Math.round((ing.amountPerPerson * groupSize) * 10) / 10;
                          const ingName = language === 'km' ? ing.nameKm : ing.nameEn;
                          const ingUnit = language === 'km' ? ing.unitKm : ing.unitEn;
                          return (
                            <li key={i}>
                              <span>{ingName}</span>
                              <strong>{scaledAmt} {ingUnit}</strong>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="view-steps-btn-row">
                      <span className="btn btn-outline btn-sm recipe-detail-btn">
                        <BookOpen size={14} />
                        <span>{language === 'km' ? 'មើលវិធីធ្វើ' : 'View Cooking Steps'} →</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Aggregated Grocery Shopping List */}
      {activeTab === 'grocery' && (
        <div className="grocery-section glass-card rounded-recipe-card">
          <div className="grocery-header flex-between">
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="var(--primary)" />
                <span>{language === 'km' ? 'បញ្ជីទិញទំនិញនៅផ្សារ' : 'Market Grocery List'} ({groupSize} {language === 'km' ? 'នាក់' : 'people'})</span>
              </h3>
              <p className="text-muted small-text">Auto-scaled for Phsar Orussey / Kampong Speu market shopping</p>
            </div>

            <div className="grocery-actions-right">
              <button className="btn btn-primary btn-sm" onClick={() => setExportModalOpen(true)}>
                <Printer size={16} />
                <span>{language === 'km' ? 'នាំចេញ / បោះពុម្ព' : 'Export / Print List'}</span>
              </button>

              <div className="grocery-total-badge">
                <span>{language === 'km' ? 'ចំណាយសរុបប៉ាន់ស្មាន' : 'Estimated Total Cost'}:</span>
                <strong>${totalGroceryCost.toFixed(2)} USD (~{(totalGroceryCost * 4000).toLocaleString()} ៛)</strong>
              </div>
            </div>
          </div>

          <div className="grocery-items-table">
            {groceryList.map((item, idx) => {
              const isChecked = checkedItems[item.name] || false;
              return (
                <div key={idx} className={`grocery-row ${isChecked ? 'checked' : ''}`} onClick={() => toggleCheck(item.name)}>
                  <div className="checkbox-col">
                    <input type="checkbox" checked={isChecked} readOnly />
                  </div>
                  <div className="item-name-col">
                    <strong style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>{item.name}</strong>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', marginLeft: '6px' }}>{item.category}</span>
                  </div>
                  <div className="item-amount-col">
                    <strong>{item.amount} {item.unit}</strong>
                  </div>
                  <div className="item-cost-col">
                    <span>${item.estCost.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {addRecipeModalOpen && (
        <AddRecipeModal
          onClose={() => setAddRecipeModalOpen(false)}
          onSubmitRecipe={handleAddNewRecipe}
        />
      )}

      {/* Export / Print Grocery Modal */}
      {exportModalOpen && (
        <ExportGroceryModal
          groceryList={groceryList}
          totalCostUSD={totalGroceryCost}
          groupSize={groupSize}
          selectedRecipeNames={selectedRecipes.map((r) => language === 'km' ? r.titleKm : r.titleEn)}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      <style>{`
        .meal-planner-page {
          padding: 2.5rem 1.25rem;
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .headcount-adjuster-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          font-weight: 600;
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
          width: 28px;
          height: 28px;
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

        .meal-tab-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }

        .tab-left-group {
          display: flex;
          gap: 0.75rem;
        }

        .meal-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-md);
          font-family: var(--font-main);
          font-weight: 600;
          cursor: pointer;
        }

        .meal-tab-btn.active {
          background: var(--primary);
          color: #ffffff;
        }

        /* View Mode Switcher on the Far Right */
        .desktop-view-mode-right {
          margin-left: auto;
        }

        .view-mode-toggle {
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 3px;
        }

        [data-theme="light"] .view-mode-toggle {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        [data-theme="light"] .view-btn {
          color: #475569;
        }

        [data-theme="light"] .view-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .view-btn.active {
          background: var(--primary);
          color: #ffffff;
        }

        [data-theme="light"] .view-btn.active {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);
        }

        .recipe-card-link {
          text-decoration: none;
          color: inherit;
        }

        .rounded-recipe-card {
          border-radius: 20px !important;
          border: 1px solid var(--border-light);
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .recipe-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .recipe-card:hover {
          transform: translateY(-3px);
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .recipe-card.selected {
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
        }

        .recipes-list-view {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .list-mode-card {
          display: flex;
          flex-direction: row;
          align-items: stretch;
        }

        .list-mode-card .recipe-image-wrap {
          width: 280px;
          height: auto;
          min-height: 220px;
          flex-shrink: 0;
        }

        .list-mode-card .recipe-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .list-mode-card {
            flex-direction: column;
          }
          .list-mode-card .recipe-image-wrap {
            width: 100%;
            height: 200px;
          }
        }

        .recipe-image-wrap {
          position: relative;
          height: 190px;
        }

        .recipe-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recipe-select-checkbox {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .recipe-select-checkbox:hover {
          transform: scale(1.1);
          border-color: var(--primary);
        }

        .recipe-select-checkbox.active {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        }

        .recipe-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .recipe-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin: 0.5rem 0 0.85rem 0;
          line-height: 1.6;
        }

        .recipe-meta-badges {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .ingredients-preview-list {
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          margin-top: auto;
          margin-bottom: 0.85rem;
          font-size: 0.82rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        [data-theme="light"] .ingredients-preview-list {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        [data-theme="light"] .ingredients-preview-list strong {
          color: #0f172a;
        }

        [data-theme="light"] .ingredients-preview-list li span {
          color: #475569;
        }

        [data-theme="light"] .ingredients-preview-list li strong {
          color: #047857;
        }

        .ingredients-preview-list ul {
          list-style: none;
          margin-top: 0.4rem;
        }

        .ingredients-preview-list li {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem 0;
        }

        .view-steps-btn-row {
          margin-top: 0.5rem;
        }

        .recipe-detail-btn {
          width: 100%;
          justify-content: center;
        }

        .grocery-section {
          padding: 1.5rem;
        }

        .grocery-actions-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .grocery-total-badge {
          text-align: right;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--border-glow);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }

        .grocery-total-badge strong {
          display: block;
          color: var(--primary);
          font-size: 1.1rem;
        }

        .grocery-items-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .grocery-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .grocery-row.checked {
          opacity: 0.5;
        }

        .item-name-col {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

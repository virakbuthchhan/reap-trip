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

    </div>
  );
};

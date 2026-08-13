'use client';

import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField, SelectOption } from './ui/SelectField';
import { MediaUpload } from './ui/MediaUpload';
import { X, Send, ChefHat, Utensils, Clock, Image as ImageIcon, Plus, Trash2, Maximize2, Minimize2 } from 'lucide-react';

interface AddRecipeModalProps {
  onClose: () => void;
  onSubmitRecipe: (newRecipe: Recipe) => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  onClose,
  onSubmitRecipe
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);
  const [isMaximized, setIsMaximized] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Recipe['category']>('dinner');
  const [prepTime, setPrepTime] = useState('20');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stepsText, setStepsText] = useState('');

  // Initial ingredients
  const [ingredients, setIngredients] = useState<{ name: string; amountPerPerson: string; unit: string }[]>([
    { name: 'Pork / Beef', amountPerPerson: '200', unit: 'g' },
    { name: 'Spices / Kroeung', amountPerPerson: '30', unit: 'g' }
  ]);

  const categoryOptions: SelectOption[] = [
    { value: 'breakfast', label: language === 'km' ? 'អាហារពេលព្រឹក' : 'Breakfast', icon: '🍳' },
    { value: 'lunch', label: language === 'km' ? 'អាហារពេលថ្ងៃ' : 'Lunch', icon: '🍲' },
    { value: 'dinner', label: language === 'km' ? 'អាហារពេលល្ងាច' : 'Dinner', icon: '🥘' },
    { value: 'snack', label: language === 'km' ? 'អាហារសម្រន់' : 'Snack', icon: '🍿' }
  ];

  const handleAddIngredientRow = () => {
    setIngredients([...ingredients, { name: '', amountPerPerson: '100', unit: 'g' }]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedIngredients: RecipeIngredient[] = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        nameEn: i.name.trim(),
        nameKm: i.name.trim(),
        amountPerPerson: parseFloat(i.amountPerPerson) || 100,
        unitEn: i.unit || 'g',
        unitKm: i.unit || 'ក្រាម',
        category: 'protein'
      }));

    const parsedSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newRecipe: Recipe = {
      id: `recipe_${Date.now()}`,
      titleEn: title,
      titleKm: title,
      category: category,
      prepTimeMinutes: parseInt(prepTime) || 20,
      descriptionEn: description,
      descriptionKm: description,
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
      authorName: authorName.trim() || 'Camp Chef',
      equipmentNeededEn: ['Camp Cooking Pot', 'Gas Stove'],
      instructionsEn: parsedSteps.length > 0 ? parsedSteps : ['Cook ingredients in camp pot and serve warm.'],
      instructionsKm: parsedSteps.length > 0 ? parsedSteps : ['ចម្អិនគ្រឿងផ្សំក្នុងឆ្នាំងបោះជំរុំ រួចដួសទទួលទាន។'],
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [
        { nameEn: 'Camp Food Ingredients', nameKm: 'គ្រឿងផ្សំចម្អិន', amountPerPerson: 150, unitEn: 'g', unitKm: 'ក្រាម', category: 'protein' }
      ]
    };

    onSubmitRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isMaximized ? 'is-maximized' : ''}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Sticky Fixed Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChefHat size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'ចែករំលែករូបមន្តម្ហូបបោះជំរុំ' : 'Share Your Camp Recipe'}</span>
            </h3>
            <p className="text-muted">
              {language === 'km' ? 'ចែករំលែកមុខម្ហូបឆ្ងាញ់ៗ និងងាយស្រួលធ្វើសម្រាប់អ្នកបោះជំរុំជំនាន់ក្រោយ!' : 'Post your favorite camp recipe and scaled ingredients!'}
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

        <form onSubmit={handleSubmit} className="modern-form" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Scrollable Body Content */}
          <div className="modal-body-scrollable">
            <InputField
              label={language === 'km' ? 'ឈ្មោះមុខម្ហូប' : 'Recipe Title'}
              placeholder="e.g. Camp Grilled Beef with Lemongrass Kroeung"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="form-grid-2">
              <SelectField
                label={language === 'km' ? 'ប្រភេទអាហារ' : 'Category'}
                value={category}
                onChange={(val) => setCategory(val as any)}
                options={categoryOptions}
              />

              <InputField
                label={language === 'km' ? 'រយះពេលធ្វើ (នាទី)' : 'Prep Time (Mins)'}
                type="number"
                icon={<Clock size={16} />}
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>

            <InputField
              label={language === 'km' ? 'ឈ្មោះអ្នកចែករំលែក' : 'Your Name / Camp Chef'}
              placeholder="e.g. Chef Sokha / Phnom Penh Camper"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />

            <TextAreaField
              label={language === 'km' ? 'ការរៀបរាប់ពីមុខម្ហូប' : 'Recipe Overview'}
              rows={2}
              required
              placeholder="Short description of this camp meal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Dynamic Ingredients Section */}
            <div className="form-field-group full-width">
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <label className="form-field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Utensils size={15} color="var(--primary)" />
                  <span>{language === 'km' ? 'គ្រឿងផ្សំ (គិតម្នាក់)' : 'Ingredients (Per Person)'}</span>
                </label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddIngredientRow}>
                  <Plus size={14} /> {language === 'km' ? 'បន្ថែមគ្រឿងផ្សំ' : 'Add Ingredient'}
                </button>
              </div>

              <div className="ingredients-form-rows">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="ing-input-row">
                    <input
                      type="text"
                      className="custom-modern-input"
                      placeholder="Ingredient name (e.g. Pork)"
                      value={ing.name}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].name = e.target.value;
                        setIngredients(updated);
                      }}
                    />
                    <input
                      type="number"
                      className="custom-modern-input"
                      style={{ width: '95px' }}
                      placeholder="Amount"
                      value={ing.amountPerPerson}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].amountPerPerson = e.target.value;
                        setIngredients(updated);
                      }}
                    />
                    <input
                      type="text"
                      className="custom-modern-input"
                      style={{ width: '85px' }}
                      placeholder="Unit (g, ml)"
                      value={ing.unit}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].unit = e.target.value;
                        setIngredients(updated);
                      }}
                    />
                    {ingredients.length > 1 && (
                      <button type="button" className="remove-row-btn" onClick={() => handleRemoveIngredientRow(idx)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <TextAreaField
              label={language === 'km' ? 'វិធីធ្វើ (សរសេរមួយបន្ទាត់មួយជំហាន)' : 'Cooking Steps (1 step per line)'}
              rows={3}
              placeholder={`1. Chop meat and vegetables\n2. Boil water in camp pot\n3. Season broth and serve hot`}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
            />

            <MediaUpload
              label={language === 'km' ? 'រូបភាព/វីដេអូ គម្របមុខម្ហូប' : 'Recipe Cover Photo / Video'}
              value={imageUrl}
              onChange={(val) => setImageUrl(typeof val === 'string' ? val : val[0] || '')}
              multiple={false}
              helperText={language === 'km' ? 'ជ្រើសរើសរូបភាព ឬវីដេអូបង្ហាញពីមុខម្ហូប' : 'Upload image or video preview of the recipe'}
            />
          </div>

          {/* Sticky Fixed Bottom Actions Bar */}
          <div className="modal-actions-sticky">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t.close}</button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> {language === 'km' ? 'បោះពុម្ពផ្សាយមុខម្ហូប' : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

'use client';

import React from 'react';
import { MealPlanner } from '@/components/MealPlanner';
import { initialRecipes } from '@/data/mockData';

export default function MealsPage() {
  return <MealPlanner recipes={initialRecipes} />;
}

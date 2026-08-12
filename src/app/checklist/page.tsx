'use client';

import React from 'react';
import { PackingChecklist } from '@/components/PackingChecklist';
import { initialPackingItems } from '@/data/mockData';

export default function ChecklistPage() {
  return <PackingChecklist initialItems={initialPackingItems} />;
}

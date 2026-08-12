'use client';

import React, { useState } from 'react';
import { GuideDirectory } from '@/components/GuideDirectory';
import { initialGuides, initialDestinations } from '@/data/mockData';
import { LocalGuide, Destination } from '@/types';

export default function GuidesPage() {
  const [guides] = useState<LocalGuide[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_guides');
      return saved ? JSON.parse(saved) : initialGuides;
    }
    return initialGuides;
  });

  const [destinations] = useState<Destination[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_destinations');
      return saved ? JSON.parse(saved) : initialDestinations;
    }
    return initialDestinations;
  });

  return <GuideDirectory guides={guides} destinations={destinations} />;
}

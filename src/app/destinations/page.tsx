'use client';

import React, { useState } from 'react';
import { DestinationExplorer } from '@/components/DestinationExplorer';
import { initialDestinations } from '@/data/mockData';
import { Destination } from '@/types';

export default function DestinationsPage() {
  const [destinations] = useState<Destination[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_destinations');
      return saved ? JSON.parse(saved) : initialDestinations;
    }
    return initialDestinations;
  });

  return <DestinationExplorer destinations={destinations} />;
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Destination, LocalGuide, ExpenseItem, Recipe, TripReport, PackingItem } from '@/types';

// 1. Destinations Hook
export function useDestinationsQuery(filters?: {
  category?: string;
  difficulty?: string;
  province?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') queryParams.set('category', filters.category);
  if (filters?.difficulty && filters.difficulty !== 'all') queryParams.set('difficulty', filters.difficulty);
  if (filters?.province && filters.province !== 'all') queryParams.set('province', filters.province);
  if (filters?.search) queryParams.set('search', filters.search);

  return useQuery<Destination[]>({
    queryKey: ['destinations', filters],
    queryFn: async () => {
      const res = await fetch(`/api/destinations?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return res.json();
    },
  });
}

export function useSaveDestinationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (destId: string) => {
      const res = await fetch(`/api/destinations/${destId}/save`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to save destination');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });
}

// 2. Guides Hook
export function useGuidesQuery(destinationId?: string) {
  return useQuery<LocalGuide[]>({
    queryKey: ['guides', destinationId],
    queryFn: async () => {
      const url = destinationId ? `/api/guides?destinationId=${destinationId}` : '/api/guides';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch guides');
      return res.json();
    },
  });
}

// 3. Expenses Hooks
export function useExpensesQuery() {
  return useQuery<ExpenseItem[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return res.json();
    },
  });
}

export function useAddExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: Partial<ExpenseItem>) => {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
}

export function useSettlementsQuery() {
  return useQuery({
    queryKey: ['settlements'],
    queryFn: async () => {
      const res = await fetch('/api/expenses/settle', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to calculate settlements');
      return res.json();
    },
  });
}

// 4. Meals / Recipes Hooks
export function useMealsQuery() {
  return useQuery<Recipe[]>({
    queryKey: ['meals'],
    queryFn: async () => {
      const res = await fetch('/api/meals');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      return res.json();
    },
  });
}

export function useAddMealMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: Partial<Recipe>) => {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add recipe');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

// 5. Trip Experiences Hooks
export function useTripReportsQuery(destinationId?: string) {
  return useQuery<TripReport[]>({
    queryKey: ['trip-reports', destinationId],
    queryFn: async () => {
      const url = destinationId ? `/api/experiences?destinationId=${destinationId}` : '/api/experiences';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch trip reports');
      return res.json();
    },
  });
}

export function useAddTripReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report: Partial<TripReport>) => {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error('Failed to post trip report');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-reports'] });
    },
  });
}

// 6. Packing Checklist Hooks
export function useChecklistQuery() {
  return useQuery<PackingItem[]>({
    queryKey: ['checklist'],
    queryFn: async () => {
      const res = await fetch('/api/checklist');
      if (!res.ok) throw new Error('Failed to fetch checklist');
      return res.json();
    },
  });
}

export function useToggleChecklistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, packed }: { id: string; packed: boolean }) => {
      const res = await fetch('/api/checklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, packed }),
      });
      if (!res.ok) throw new Error('Failed to update packing item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
  });
}

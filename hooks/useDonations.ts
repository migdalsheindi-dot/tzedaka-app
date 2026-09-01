import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@tzedaka/donations';

export type Donation = {
  id: string;
  amount: number;
  date: string; // ISO string
};

type DonationsState = {
  donations: Donation[];
  total: number;
  loading: boolean;
};

let listeners: Array<(state: DonationsState) => void> = [];
let cachedState: DonationsState = { donations: [], total: 0, loading: true };
let loadPromise: Promise<void> | null = null;

function computeTotal(donations: Donation[]): number {
  return donations.reduce((sum, d) => sum + d.amount, 0);
}

function notify() {
  listeners.forEach((listener) => listener(cachedState));
}

async function loadFromStorage(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const donations: Donation[] = raw ? JSON.parse(raw) : [];
      cachedState = { donations, total: computeTotal(donations), loading: false };
    } catch {
      cachedState = { donations: [], total: 0, loading: false };
    }
    notify();
  })();
  return loadPromise;
}

async function persist(donations: Donation[]) {
  cachedState = { donations, total: computeTotal(donations), loading: false };
  notify();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
}

export function useDonations() {
  const [state, setState] = useState<DonationsState>(cachedState);

  useEffect(() => {
    listeners.push(setState);
    if (cachedState.loading) {
      loadFromStorage();
    } else {
      setState(cachedState);
    }
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  const addDonation = useCallback(async (amount: number) => {
    const donation: Donation = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      amount,
      date: new Date().toISOString(),
    };
    const next = [donation, ...cachedState.donations];
    await persist(next);
    return donation;
  }, []);

  return {
    donations: state.donations,
    total: state.total,
    loading: state.loading,
    addDonation,
  };
}

import { FollowerStatus } from '@/types/follower';

const STORAGE_KEY = 'follower-analysis-selections';

export const saveSelections = (selections: Record<string, 'remove' | 'keep' | 'neutral'>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  } catch (error) {
    console.error('Error saving selections:', error);
  }
};

export const loadSelections = (): Record<string, 'remove' | 'keep' | 'neutral'> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading selections:', error);
    return {};
  }
};

export const clearSelections = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing selections:', error);
  }
};

import { useContext } from 'react';
import { AppContext } from './AppContext';

export function useApp() {
  const ctx = useContext(AppContext);
  // AppContext is always provided at the root, so this is a programming error if null
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

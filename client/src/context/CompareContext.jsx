import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('madanPaintsCompare');
      if (raw) setCompareList(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist to localStorage
  const persist = (list) => {
    setCompareList(list);
    localStorage.setItem('madanPaintsCompare', JSON.stringify(list));
  };

  const addToCompare = (product) => {
    if (compareList.length >= 3) return false;
    if (compareList.some(p => p.id === product.id)) return false;
    persist([...compareList, product]);
    return true;
  };

  const removeFromCompare = (productId) => {
    persist(compareList.filter(p => p.id !== productId));
  };

  const toggleCompare = (product) => {
    if (compareList.some(p => p.id === product.id)) {
      removeFromCompare(product.id);
      return false;
    }
    return addToCompare(product);
  };

  const clearCompare = () => persist([]);

  const inCompare = (productId) => compareList.some(p => p.id === productId);

  return (
    <CompareContext.Provider value={{
      compareList,
      compareCount: compareList.length,
      compareMax: 3,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      inCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}

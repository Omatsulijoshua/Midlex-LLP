"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PropertyListing } from '@/lib/types';

type CartContextValue = { items: PropertyListing[]; add: (property: PropertyListing) => void; remove: (id: string) => void; clear: () => void; contains: (id: string) => boolean };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PropertyListing[]>([]);
  useEffect(() => { try { const saved = localStorage.getItem('midlex_realty_cart'); if (saved) setItems(JSON.parse(saved)); } catch {} }, []);
  useEffect(() => { localStorage.setItem('midlex_realty_cart', JSON.stringify(items)); }, [items]);
  const value = useMemo<CartContextValue>(() => ({ items, add: (property) => setItems((current) => current.some((item) => item.id === property.id) ? current : [...current, property]), remove: (id) => setItems((current) => current.filter((item) => item.id !== id)), clear: () => setItems([]), contains: (id) => items.some((item) => item.id === id) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used within CartProvider'); return value; }

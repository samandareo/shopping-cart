"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextProps {
  cartOpen: boolean;
  products: any[];
  quantity: number;
  toggleCart: () => void;
  fetchProducts: () => void;
  loading: boolean;
}

// Create the Cart Context
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/products');
      const data = await response.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle cart visibility
  const toggleCart = () => setCartOpen(!cartOpen);

  return (
    <CartContext.Provider value={{ products, quantity, cartOpen, toggleCart, fetchProducts, loading }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; // Exporting default for CartContext itself

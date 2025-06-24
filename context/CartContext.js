import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_amount: 0 });
  const [loading, setLoading] = useState(false);

  // Simple localStorage helpers
  const saveToLocalStorage = (cartData) => {
    localStorage.setItem('localCart', JSON.stringify(cartData));
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('localCart');
      return stored ? JSON.parse(stored) : { items: [], total_amount: 0 };
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return { items: [], total_amount: 0 };
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    console.log('CartProvider: Initializing cart');
    const localCart = loadFromLocalStorage();
    if (localCart.items && localCart.items.length > 0) {
      setCart(localCart);
      console.log('CartProvider: Loaded cart from localStorage:', localCart);
    }
  }, []);

  // Auto-save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items && cart.items.length > 0) {
      saveToLocalStorage(cart);
      console.log('CartProvider: Auto-saved cart to localStorage:', cart);
    }
  }, [cart]);

  const addToCart = async (mealId, portions = 1, portionsPerPlate = 1, plates = 1, specialInstructions = '', mealDetails = null) => {
    console.log('Adding to cart:', { mealId, portions, portionsPerPlate, plates, mealDetails });
    
    setLoading(true);
    
    try {
      // Always use localStorage for now - simple and reliable
      const newItem = {
        id: Date.now(),
        meal_id: mealId,
        portions: portions,
        portionsPerPlate: portionsPerPlate,
        plates: plates,
        special_instructions: specialInstructions,
        name: mealDetails?.name || `Meal ${mealId}`,
        price: mealDetails?.price || 0,
        image: mealDetails?.image || mealDetails?.image_url || '/images/menu/foodHovered.png'
      };

      const updatedCart = {
        ...cart,
        items: [...cart.items, newItem],
        total_amount: cart.total_amount + (portions * (mealDetails?.price || 0))
      };

      setCart(updatedCart);
      saveToLocalStorage(updatedCart);
      
      console.log('Successfully added to cart:', updatedCart);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, updates) => {
    setLoading(true);
    
    try {
      const updatedItems = cart.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      const updatedCart = {
        ...cart,
        items: updatedItems
      };
      
      setCart(updatedCart);
      saveToLocalStorage(updatedCart);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update cart item' };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    
    try {
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      
      const updatedCart = {
        ...cart,
        items: updatedItems
      };
      
      setCart(updatedCart);
      saveToLocalStorage(updatedCart);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from cart' };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], total_amount: 0 });
    localStorage.removeItem('localCart');
  };

  const getCartItemCount = () => {
    // Count the number of unique food items in the cart, not total portions
    return cart.items.length;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 
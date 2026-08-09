import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cravingsCart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        return [];
      }
    }
    return [];
  });
  const [restaurantId, setRestaurantId] = useState(() => {
    const saved = localStorage.getItem('cravingsCartRestaurantId');
    return saved || null;
  });

  useEffect(() => {
    localStorage.setItem('cravingsCart', JSON.stringify(cartItems));
    if (restaurantId) {
      localStorage.setItem('cravingsCartRestaurantId', restaurantId);
    } else {
      localStorage.removeItem('cravingsCartRestaurantId');
    }
  }, [cartItems, restaurantId]);

  const addToCart = (item, rId, rName) => {
    if (restaurantId && restaurantId !== rId) {
      // Different restaurant
      if (window.confirm(`Your cart contains items from another restaurant. Clear cart and add ${item.itemName}?`)) {
        setCartItems([{ ...item, quantity: 1 }]);
        setRestaurantId(rId);
        localStorage.setItem('cravingsCartRestaurantName', rName);
        toast.success(`${item.itemName} added to new cart!`);
      }
      return;
    }

    setRestaurantId(rId);
    if (!localStorage.getItem('cravingsCartRestaurantName')) {
        localStorage.setItem('cravingsCartRestaurantName', rName);
    }

    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.itemName} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    if (updatedCart.length === 0) {
      setRestaurantId(null);
      localStorage.removeItem('cravingsCartRestaurantName');
    }
  };

  const updateQuantity = (itemId, action) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId) {
        let newQuantity = item.quantity;
        if (action === 'increase') newQuantity += 1;
        if (action === 'decrease') newQuantity -= 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    if (updatedCart.length === 0) {
      setRestaurantId(null);
      localStorage.removeItem('cravingsCartRestaurantName');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    localStorage.removeItem('cravingsCartRestaurantName');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  const value = {
    cartItems,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

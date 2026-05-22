import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

export const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  // Initialize DOM side effects
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync logged-in user from MongoDB on app load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored?.email) return;

    api
      .getMe(stored.email)
      .then((userFromDb) => {
        setUser(userFromDb);
        localStorage.setItem('user', JSON.stringify(userFromDb));
      })
      .catch(() => {
        localStorage.removeItem('user');
        setUser(null);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  const addToCart = (product, size, color, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, size, color, quantity }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId, size, color) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    toast.info(`Item removed from cart.`);
  };

  const updateCartQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item =>
      item.id === productId && item.size === size && item.color === color
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isExisting = prev.find(item => item.id === product.id);
      if (isExisting) {
        toast.info(`${product.name} removed from wishlist.`);
        return prev.filter(item => item.id !== product.id);
      } else {
        toast.success(`${product.name} added to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name || 'User'}!`);
  };

  const updateUser = (updatedData) => {
    const newData = { ...user, ...updatedData };
    setUser(newData);
    localStorage.setItem('user', JSON.stringify(newData));
    if (user?.email) {
      api.updateProfile({ email: user.email, ...updatedData }).catch(console.error);
    }
    toast.success('Profile updated successfully!');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    toast.info('Logged out successfully.');
  };

  const adminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
    toast.success('Logged in as Admin');
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      user, login, logout, updateUser,
      isAdmin, adminLogin
    }}>
      {children}
    </AppContext.Provider>
  );
};

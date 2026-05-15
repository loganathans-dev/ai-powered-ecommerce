import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, User, Sun, Moon, Search, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const Navbar = () => {
  const { theme, toggleTheme, cartCount, user, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProducts().then(setAllProducts).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: "Men's", path: "/mens" },
    { name: "Women's", path: "/womens" },
    { name: "Kids", path: "/kids" },
    { name: "Brands", path: "/brands" }
  ];

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              ShoeShop
            </span>
          </Link>

          <div className="flex items-center gap-8 lg:gap-12">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (isSearchOpen) setSearchQuery('');
                  }}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
                >
                  {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                </button>

                {/* Search Popup */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-0 mr-3 w-72 sm:w-70 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 flex flex-col"
                    >
                      {/* Search Input */}
                      <div className="p-1 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center dark:bg-slate-800 rounded-lg px-2 py-2">
                          <Search size={20} className="text-slate-400 mr-2" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Search Results */}
                      {searchQuery && (
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                          {filteredProducts.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {filteredProducts.map(product => (
                                <Link
                                  key={product.id}
                                  to={`/product/${product.id}`}
                                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{product.name}</h4>
                                    <p className="text-xs text-slate-500 truncate">{product.brand}</p>
                                  </div>
                                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                    ₹{(product.price * (1 - (product.offer || 0) / 100)).toLocaleString('en-IN')}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-sm text-center py-4">No products found</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 hidden sm:block">
                <User size={20} />
              </Link>



              <Link to="/cart" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user && (
                <button onClick={handleLogout} className="text-slate-600 dark:text-slate-300 hover:text-red-500 p-2 hidden sm:block" title="Logout">
                  <LogOut size={20} />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-600 dark:text-slate-300 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-800 dark:text-slate-200"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-200 dark:border-slate-800" />
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 dark:text-slate-200">Profile</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 dark:text-slate-200">My Orders</Link>
              {user && (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="text-lg font-medium text-red-500 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

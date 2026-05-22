import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    api.getProducts().then(setAllProducts).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" }
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
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              ShoeShop
            </span>
          </Link>

          <div className="flex items-center gap-8 lg:gap-12">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-medium transition-colors ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center" ref={searchRef}>
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

              <Link to="/cart" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 hidden sm:block" title="Profile">
                    <User size={20} />
                  </Link>
                  <button onClick={handleLogout} className="text-slate-600 dark:text-slate-300 hover:text-red-500 p-2 hidden sm:block" title="Logout">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-4 ml-2">
                  <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium">Login</Link>
                  <Link to="/signup" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium">Sign up</Link>
                </div>
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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname.startsWith('/products') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Products</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname.startsWith('/cart') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Cart</Link>
              
              <hr className="border-slate-200 dark:border-slate-800" />
              
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname.startsWith('/profile') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-red-500 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname.startsWith('/login') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Login</Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${location.pathname.startsWith('/signup') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>Signup</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

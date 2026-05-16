import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductList = ({ category, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.getProducts(category ? { category } : {})
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const availableBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))];
  }, [products]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, sortOrder, priceRange, selectedBrands]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Filter size={18} /> Filters
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-64 flex-shrink-0 ${!isFilterOpen ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
              <SlidersHorizontal size={20} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Brands</h4>
              <div className="space-y-3">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                    />
                    <span className="text-slate-600 dark:text-slate-400">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Price Range</h4>
              <input 
                type="range" 
                min="0" 
                max="30000" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
              />
              <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span>₹0</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedBrands([]); setPriceRange([0, 30000]); }}
              className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="flex-grow">
          {loading ? (
            <p className="text-center text-slate-500 py-20">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search criteria.</p>
              <button 
                onClick={() => { setSelectedBrands([]); setPriceRange([0, 500]); }}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductList;

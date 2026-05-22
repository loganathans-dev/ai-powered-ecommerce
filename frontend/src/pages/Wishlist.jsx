import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Heart, ShoppingBag, Trash2, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || '#000000', 1);
    toggleWishlist(product);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <Heart className="text-pink-500 fill-pink-500" size={32} />
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              Save your favorite items here. Start browsing our collections to find products you love!
            </p>
            <Link to="/products" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              <ShoppingBag size={20} /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                key={product.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border border-slate-200 dark:border-slate-700 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 z-10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{product.rating}</span>
                  </div>
                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₹{(product.price * (1 - (product.offer || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingCart size={18} /> Move to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

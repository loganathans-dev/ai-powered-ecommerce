import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
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
        


        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.offer > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{product.offer}%
            </span>
          )}
          {product.featured && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              HOT
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
          <button 
            onClick={() => addToCart(product, product.sizes[0], product.colors[0], 1)}
            className="px-5 py-2 bg-white text-slate-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-70 hover:text-slate-900 transition-all duration-300 shadow-md text-sm"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{product.brand}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.offer > 0 ? (
              <>
                <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{(product.price * (1 - product.offer / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

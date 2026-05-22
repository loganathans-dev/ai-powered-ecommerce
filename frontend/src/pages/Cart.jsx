import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, user } = useAppContext();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center py-20">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 100 ? 0 : 15;
  const grandTotal = cartTotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6">
            {cart.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/product/${item.id}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                      {item.name}
                    </Link>
                    <span className="font-bold text-slate-900 dark:text-white">₹{(item.price * (1 - (item.offer || 0) / 100)).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.brand}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">Size: {item.size}</span>
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-2">
                      Color: <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: item.color }} />
                    </span>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-semibold text-slate-900 dark:text-white text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>

            <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-300 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-green-500">Free</span>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white">₹{shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={20} />
            </button>

            <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
              {/* Mock payment icons */}
              <div className="w-10 h-6 bg-slate-200 rounded"></div>
              <div className="w-10 h-6 bg-slate-200 rounded"></div>
              <div className="w-10 h-6 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

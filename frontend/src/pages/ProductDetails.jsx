import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, Heart, HeartPlus, Minus, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, toggleWishlist, isInWishlist, user } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.getProduct(id)
      .then((p) => {
        setProduct(p);
        setMainImage(p.images?.[0] || '');
        setSelectedSize(p.sizes?.[0] || '');
        setSelectedColor(p.colors?.[0] || '');
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h2>
        <Link to="/home" className="text-indigo-600 hover:underline">Return to Home</Link>
      </div>
    );
  }
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-8 gap-2">
        <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <span>/</span>
        <Link to={`/${product.category}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-200">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-indigo-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">{product.brand}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-slate-300 dark:text-slate-600"} />
              ))}
            </div>
            <span className="text-slate-600 dark:text-slate-400">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="mb-8">
            {product.offer > 0 ? (
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{(product.price * (1 - product.offer / 100)).toFixed(2)}
                </span>
                <span className="text-xl text-slate-400 line-through mb-1">₹{product.price}</span>
                <span className="text-sm font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded mb-1.5">
                  Save {product.offer}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-8"></div>

          {/* Selections */}
          <div className="flex flex-col gap-6 mb-8">
            {/* Size */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-slate-900 dark:text-white">Select Size (US)</span>
                <button className="text-sm text-indigo-600 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl border flex items-center justify-center font-medium transition-colors ${selectedSize === size
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-600 dark:hover:border-indigo-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-3">Select Color</span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      if (product.images[index]) {
                        setMainImage(product.images[index]);
                      }
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                        ? 'border-indigo-600 scale-110 shadow-md'
                        : 'border-transparent shadow-sm hover:scale-105'
                      } ${color === '#ffffff' ? 'border-slate-200' : ''}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-3">Quantity</span>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-fit p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-semibold text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                if (!user) {
                  navigate(`/login?redirect=${location.pathname}`);
                  return;
                }
                toggleWishlist(product);
              }}
              className={`px-6 py-4 border-2 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${isWishlisted
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
              {isWishlisted ? (
                <Heart size={24} fill="currentColor" />
              ) : (
                <HeartPlus size={24} />
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-8 mt-auto">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Truck className="text-indigo-600 shrink-0" />
              <span className="text-sm">Free standard shipping over ₹100</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <ShieldCheck className="text-indigo-600 shrink-0" />
              <span className="text-sm">100% Secure Checkout</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

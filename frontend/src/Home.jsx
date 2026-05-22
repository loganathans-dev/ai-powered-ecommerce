import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, RotateCcw } from 'lucide-react';
import { api } from './services/api';
import ProductCard from './components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.getProducts({ featured: 'true' })
      .then((products) => setFeaturedProducts(products.slice(0, 4)))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2500&auto=format&fit=crop"
            alt="Hero Footwear"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Step Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Greatness.
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Discover the latest collections from top brands. Elevate your style and performance with our premium selection of footwear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products/men" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                Shop Men's <ArrowRight size={20} />
              </Link>
              <Link to="/products/women" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                Shop Women's
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
            <FeatureItem icon={Zap} title="Fast Delivery" desc="Free shipping on orders over $100" />
            <FeatureItem icon={Shield} title="Secure Payments" desc="100% secure payment gateways" className="md:pl-8" />
            <FeatureItem icon={RotateCcw} title="Easy Returns" desc="30-day return policy for any reason" className="md:pl-8" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trending Now</h2>
              <p className="text-slate-500 dark:text-slate-400">Our most popular styles this week</p>
            </div>
            <Link to="/products" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-8 md:mb-0 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale is Live!</h2>
            <p className="text-indigo-100 text-lg">Get up to 40% off on selected premium footwear. Limited time offer, don't miss out on these exclusive styles.</p>
          </div>
          <Link to="/products" className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors inline-flex items-center gap-2 shadow-xl shadow-black/10">
            Explore Offers <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="Men's"
              path="/products/men"
              imgUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
            />
            <CategoryCard
              title="Women's"
              path="/products/women"
              imgUrl="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
            />
            <CategoryCard
              title="Kids"
              path="/products/kids"
              imgUrl="https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc, className = "" }) => (
  <div className={`flex flex-col md:flex-row items-center md:items-start gap-4 pt-8 md:pt-0 ${className}`}>
    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
    </div>
  </div>
);

const CategoryCard = ({ title, path, imgUrl }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="group relative h-96 rounded-3xl overflow-hidden shadow-lg bg-slate-800"
  >
    <Link to={path} className="block w-full h-full">
      <img src={imgUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{title}</h3>
        <p className="text-slate-200 flex items-center gap-2 group-hover:gap-4 transition-all">
          Explore Collection <ArrowRight size={16} />
        </p>
      </div>
    </Link>
  </motion.div>
);

export default Home;

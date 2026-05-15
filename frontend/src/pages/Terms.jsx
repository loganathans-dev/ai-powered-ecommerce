import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Provision of Services</h2>
            <p className="leading-relaxed">
              You agree and acknowledge that ShoeShop is entitled to modify, improve or discontinue any of its services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Proprietary Rights</h2>
            <p className="leading-relaxed">
              You acknowledge and agree that ShoeShop may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties. ShoeShop authorizes you to view and make a single copy of portions of its content for offline, personal, non-commercial use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Return Policy</h2>
            <p className="leading-relaxed">
              Items returned within 30 days of their original shipment date in same as new condition will be eligible for a full refund or store credit. Refunds will be charged back to the original form of payment used for purchase. Customer is responsible for shipping charges when making returns and shipping/handling fees of original purchase is non-refundable.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;

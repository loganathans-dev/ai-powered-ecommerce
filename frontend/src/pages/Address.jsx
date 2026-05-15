import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Address = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    additionalPhone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('shippingAddress', JSON.stringify(formData));
    navigate('/payment');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      {/* Checkout Steps */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-indigo-600 z-0"></div>
        
        <Step active completed label="Cart" onClick={() => navigate('/cart')} />
        <Step active label="Address" />
        <Step label="Payment" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <MapPin size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shipping Address</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Additional Phone (Optional)" type="tel" name="additionalPhone" value={formData.additionalPhone} onChange={handleChange} />
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-2"></div>

          <Input label="Street Address" name="street" value={formData.street} onChange={handleChange} required />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Input label="State / Province" name="state" value={formData.state} onChange={handleChange} required />
            <Input label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleChange} required />
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <button 
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Cart
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              Continue to Payment <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Step = ({ active, completed, label, onClick }) => (
  <div className="relative z-10 flex flex-col items-center gap-2">
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
        completed ? 'bg-indigo-600 text-white' : 
        active ? 'bg-white dark:bg-slate-800 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 
        'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
      } ${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
    >
      {completed ? '✓' : ''}
    </button>
    <span className={`text-sm font-medium ${active || completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const Input = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    <input 
      type={type} 
      {...props} 
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white transition-all"
    />
  </div>
);

export default Address;

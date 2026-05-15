import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Smartphone, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, user } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 10000 ? 0 : 99;
  const grandTotal = cartTotal + tax + shipping;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const shippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress') || '{}');
    const addressStr = [
      shippingAddress.street,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.zip
    ].filter(Boolean).join(', ');

    try {
      await api.createOrder({
        customer: user?.name || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Guest',
        customerEmail: user?.email || shippingAddress.email || '',
        address: addressStr,
        total: grandTotal,
        paymentStatus: 'Paid',
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
      clearCart();
      sessionStorage.removeItem('shippingAddress');
      toast.success('Payment Successful! Order placed.');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      {/* Checkout Steps */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-indigo-600 z-0"></div>

        <Step completed label="Cart" onClick={() => navigate('/cart')} />
        <Step completed label="Address" onClick={() => navigate('/address')} />
        <Step active label="Payment" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Method</h1>
            <p className="text-slate-500 dark:text-slate-400">All transactions are secure and encrypted.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total to pay</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="flex flex-col gap-8">
          {/* Payment Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${paymentMethod === 'card'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300'
                }`}
            >
              <CreditCard size={24} />
              <span className="font-semibold text-lg">Credit Card</span>
              {paymentMethod === 'card' && <CheckCircle className="ml-auto text-indigo-600" size={20} />}
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${paymentMethod === 'upi'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300'
                }`}
            >
              <Smartphone size={24} />
              <span className="font-semibold text-lg">UPI App</span>
              {paymentMethod === 'upi' && <CheckCircle className="ml-auto text-indigo-600" size={20} />}
            </button>
          </div>

          {/* Form Fields */}
          {paymentMethod === 'card' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Input label="Card Number" placeholder="0000 0000 0000 0000" maxLength="19" required />
              <Input label="Name on Card" placeholder="John Doe" required />
              <div className="grid grid-cols-2 gap-6">
                <Input label="Expiry Date" placeholder="MM/YY" maxLength="5" required />
                <Input label="CVC" type="password" placeholder="123" maxLength="3" required />
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Input label="UPI ID" placeholder="username@bank" required />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You will receive a payment request on your UPI app. Please approve it to complete the order.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-8 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/address')}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={20} /> Pay ${grandTotal.toFixed(2)}
                </>
              )}
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
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${completed ? 'bg-indigo-600 text-white' :
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

export default Payment;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { loadRazorpayScript } from '../utils/razorpay';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, user } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 10000 ? 0 : 99;
  const grandTotal = cartTotal + tax + shipping;

  const getOrderPayload = () => {
    const shippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress') || '{}');
    const addressStr = [
      shippingAddress.street,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.zip,
    ]
      .filter(Boolean)
      .join(', ');

    return {
      customer:
        user?.name ||
        `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() ||
        'Guest',
      customerEmail: user?.email || shippingAddress.email || '',
      address: addressStr,
      total: grandTotal,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Check your internet connection.');
      }

      const { orderId, amount, currency, keyId } = await api.createRazorpayOrder(grandTotal);
      const orderPayload = getOrderPayload();

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'ShoeShop',
        description: 'Footwear order payment',
        order_id: orderId,
        prefill: {
          name: user?.name || orderPayload.customer,
          email: orderPayload.customerEmail,
          contact: user?.phone || '',
        },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ...orderPayload,
            });
            clearCart();
            sessionStorage.removeItem('shippingAddress');
            toast.success('Payment successful! Order placed.');
            navigate('/orders');
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Could not start payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-indigo-600 z-0" />
        <Step completed label="Cart" onClick={() => navigate('/cart')} />
        <Step completed label="Address" onClick={() => navigate('/address')} />
        <Step active label="Payment" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pay with Razorpay</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Secure checkout — cards, UPI, netbanking (test mode).
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total to pay</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ₹{grandTotal.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
          <strong>Test mode:</strong> Use Razorpay test keys. Try card{' '}
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">4111 1111 1111 1111</code>, any
          future expiry, any CVV. UPI: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">success@razorpay</code>.
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 mb-8">
          <CreditCard size={28} className="text-indigo-600" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Razorpay Secure Checkout</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You will be redirected to Razorpay to complete payment.
            </p>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
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
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} /> Pay ₹{grandTotal.toFixed(2)}
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
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
        completed
          ? 'bg-indigo-600 text-white'
          : active
            ? 'bg-white dark:bg-slate-800 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
            : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
      } ${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
    >
      {completed ? '✓' : ''}
    </button>
    <span
      className={`text-sm font-medium ${active || completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
    >
      {label}
    </span>
  </div>
);

export default Payment;
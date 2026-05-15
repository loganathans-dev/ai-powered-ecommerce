import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const MyOrder = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }
    api.getUserOrders(user.email)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        <p className="text-slate-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">When you place an order, it will show up here.</p>
          <Link to="/home" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order {order.id}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">₹{order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-xl">👟</div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const icons = {
    Delivered: CheckCircle,
    Processing: Clock,
    Pending: Package,
    Shipped: Package,
  };

  const Icon = icons[status] || Package;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

export default MyOrder;

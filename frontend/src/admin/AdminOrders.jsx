import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.updateOrderStatus(id, newStatus);
      setOrders(orders.map(order =>
        order.id === id ? updated : order
      ));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders Management</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage customer orders.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
          <Package size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Order ID</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Customer</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Address</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Product Name</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Total</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Payment</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Order Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">Loading orders...</td></tr>
              ) : orders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={order.address}>{order.address}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={order.productName}>{order.productName}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                      order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

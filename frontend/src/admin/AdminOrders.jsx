import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          <table className="w-full text-left border-collapse min-w-[1200px]">
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
                    <div className="flex items-center gap-2">
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
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Order Details <span className="text-indigo-600 dark:text-indigo-400 ml-2">#{selectedOrder.id}</span>
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-slate-500">Customer Details</h3>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedOrder.customer}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedOrder.customerEmail || 'No email provided'}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{selectedOrder.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-slate-500">Order Summary</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm"><span className="font-medium">Date:</span> {selectedOrder.date}</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mt-1"><span className="font-medium">Payment:</span> <span className={selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}>{selectedOrder.paymentStatus}</span></p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mt-1"><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-slate-500">Items Ordered</h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Product</th>
                      <th className="p-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">Qty</th>
                      <th className="p-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-sm text-slate-900 dark:text-white">{item.name}</td>
                          <td className="p-3 text-sm text-slate-600 dark:text-slate-400 text-center">{item.quantity}</td>
                          <td className="p-3 text-sm font-medium text-slate-900 dark:text-white text-right">₹{item.price.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3 text-sm text-slate-900 dark:text-white">{selectedOrder.productName}</td>
                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400 text-center">1</td>
                        <td className="p-3 text-sm font-medium text-slate-900 dark:text-white text-right">₹{selectedOrder.total.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td colSpan="2" className="p-3 text-right font-bold text-slate-900 dark:text-white">Total Amount:</td>
                      <td className="p-3 text-right font-bold text-indigo-600 dark:text-indigo-400">₹{selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;

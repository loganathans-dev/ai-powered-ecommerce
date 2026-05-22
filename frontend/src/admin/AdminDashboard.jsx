import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, ChevronDown, Package, AlertTriangle } from 'lucide-react';
import { mockOrders, mockCustomers } from '../data/mockData';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Use mock data instead of API call to show all orders
    setRecentOrders(mockOrders);
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  // Use mock data for stats
  const getStats = (filter) => {
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      revenue: '₹' + totalRevenue.toLocaleString('en-IN'),
      orders: mockOrders.length.toString(),
      customers: mockCustomers.length.toString(),
      totalProducts: products.length.toString()
    };
  };

  const stats = getStats(timeFilter);
  // Filter products with stock <= 10 (or assume 0/missing for mock data)
  // Since mock data doesn't have stock initially, we will pretend some are low stock.
  // In reality, we'll sort by stock.
  const lowStockProducts = products.filter(p => (p.stock || 0) < 5).slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        
        <div className="relative">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="appearance-none text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 pl-4 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="1year">Last 1 Year</option>
            <option value="all">All Time</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={stats.revenue} icon={IndianRupee} trend="+12.5%" />
        <StatCard title="Orders" value={stats.orders} icon={ShoppingBag} trend="+8.2%" />
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} trend="+5.0%" />
        <StatCard title="Customers" value={stats.customers} icon={Users} trend="+15.3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="text-slate-900 dark:text-white">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Products</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Nike Air Max 270</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">124 sales</p>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹18,600</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Adidas Ultraboost</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">89 sales</p>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹16,910</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Nike Air Force 1</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">76 sales</p>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹8,740</span>
              </div>
            </div>
          </div>
          
          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} /> Low Stock
              </h2>
              <Link to="/admin/products" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Manage</Link>
            </div>
            {lowStockProducts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-slate-100">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.brand}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-bold whitespace-nowrap">
                      {p.stock || 0} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">All products are well stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
        <Icon size={24} />
      </div>
      <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default AdminDashboard;

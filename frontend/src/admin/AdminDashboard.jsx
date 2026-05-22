import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, ChevronDown, Package, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    recentOrders: [],
    topProducts: [],
    totalUsers: 0
  });

  useEffect(() => {
    // Fetch real stats from the API
    api.getAdminStats(timeFilter)
      .then(data => {
        setStats(data);
        setRecentOrders(data.recentOrders || []);
      })
      .catch(console.error);
      
    api.getProducts().then(setProducts).catch(console.error);
  }, [timeFilter]);

  const formattedStats = {
    revenue: '₹' + (stats.revenue || 0).toLocaleString('en-IN'),
    orders: (stats.orders || 0).toString(),
    customers: (stats.customers || 0).toString(), // active buyers (users who placed orders)
    activeBuyers: (stats.activeBuyers || 0).toString(), // buyers who placed orders
    totalProducts: products.length.toString()
  };
  // Filter products with stock <= 10 (or assume 0/missing for mock data)
  // Since mock data doesn't have stock initially, we will pretend some are low stock.
  // In reality, we'll sort by stock.
  const lowStockProducts = products.filter(p => (p.stock || 0) < 5).slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor your store performance at a glance.</p>
        </div>
        
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
        <StatCard title="Total Revenue" value={formattedStats.revenue} icon={IndianRupee} trend={stats.revenueTrend} />
        <StatCard title="Orders" value={formattedStats.orders} icon={ShoppingBag} trend={stats.ordersTrend} />
        <StatCard title="Total Products" value={formattedStats.totalProducts} icon={Package} />
        <StatCard title="Customers" value={formattedStats.customers} icon={Users} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">₹{order.total.toFixed(2)}</td>
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
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((tp, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{tp.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{tp.quantity} sales</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₹{tp.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No sales data available yet.</p>
              )}
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

const StatCard = ({ title, value, icon: Icon, trend }) => {
  let trendColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
  let trendText = '0%';
  
  if (trend !== undefined && trend !== null) {
    if (trend > 0) {
      trendColor = 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
      trendText = `+${trend}%`;
    } else if (trend < 0) {
      trendColor = 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
      trendText = `${trend}%`;
    } else {
      trendText = '0%';
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Icon size={24} />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`text-sm font-medium px-2 py-1 rounded ${trendColor}`}>
            {trendText}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

export default AdminDashboard;

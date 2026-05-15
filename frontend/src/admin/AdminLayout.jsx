import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAppContext();

  // In a real app, this should protect the route.
  // For demo, we just show it.

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link to="/home" className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Shoeshop Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (pathname.startsWith(link.path) && link.path !== '/admin');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white font-medium'
                  }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50 w-full text-left font-medium">
            <Settings size={20} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

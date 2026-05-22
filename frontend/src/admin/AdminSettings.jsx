import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Store, Shield, Bell, Palette, Trash2, Save,
  Eye, EyeOff, Sun, Moon, Monitor, Check, AlertTriangle, X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const SETTINGS_KEY = 'admin_settings';

const getStoredSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch { return {}; }
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Section Wrapper ---
const Section = ({ icon: Icon, title, description, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </motion.div>
);

// --- Input Field ---
const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";

// --- Toggle Switch ---
const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const AdminSettings = () => {
  const { theme, toggleTheme } = useAppContext();
  const [saved, setSaved] = useState(false);

  // Store Info
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'ShoeShop',
    storeEmail: 'admin@shoeshop.com',
    storePhone: '+91 98765 43210',
    currency: 'INR',
    taxRate: '18',
    shippingFee: '99',
    freeShippingMin: '999',
  });

  // Admin Credentials
  const [adminCreds, setAdminCreds] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    dailyReport: true,
    emailAlerts: true,
  });

  // Danger Zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = getStoredSettings();
    if (stored.storeInfo) setStoreInfo(s => ({ ...s, ...stored.storeInfo }));
    if (stored.notifications) setNotifications(n => ({ ...n, ...stored.notifications }));
  }, []);

  const handleSaveStoreInfo = (e) => {
    e.preventDefault();
    const stored = getStoredSettings();
    saveSettings({ ...stored, storeInfo });
    toast.success('Store information saved!');
    flashSaved();
  };

  const handleSaveNotifications = () => {
    const stored = getStoredSettings();
    saveSettings({ ...stored, notifications });
    toast.success('Notification preferences saved!');
    flashSaved();
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!adminCreds.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (adminCreds.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (adminCreds.newPassword !== adminCreds.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // Simulated password change
    setAdminCreds({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password changed successfully!');
    flashSaved();
  };

  const handleClearAllData = () => {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    toast.success('All application data has been cleared');
    setShowDeleteConfirm(false);
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your store configuration and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full"
            >
              <Check size={14} /> Saved
            </motion.span>
          )}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
            <Settings size={24} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        {/* Store Information */}
        <Section icon={Store} title="Store Information" description="Basic details about your store." delay={0}>
          <form onSubmit={handleSaveStoreInfo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Store Name">
                <input
                  type="text"
                  value={storeInfo.storeName}
                  onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Contact Email">
                <input
                  type="email"
                  value={storeInfo.storeEmail}
                  onChange={(e) => setStoreInfo({ ...storeInfo, storeEmail: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  type="text"
                  value={storeInfo.storePhone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, storePhone: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Currency">
                <select
                  value={storeInfo.currency}
                  onChange={(e) => setStoreInfo({ ...storeInfo, currency: e.target.value })}
                  className={inputClass}
                >
                  <option value="INR">₹ INR – Indian Rupee</option>
                  <option value="USD">$ USD – US Dollar</option>
                  <option value="EUR">€ EUR – Euro</option>
                  <option value="GBP">£ GBP – British Pound</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Tax Rate (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={storeInfo.taxRate}
                  onChange={(e) => setStoreInfo({ ...storeInfo, taxRate: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Shipping Fee (₹)">
                <input
                  type="number"
                  min="0"
                  value={storeInfo.shippingFee}
                  onChange={(e) => setStoreInfo({ ...storeInfo, shippingFee: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Free Shipping Above (₹)">
                <input
                  type="number"
                  min="0"
                  value={storeInfo.freeShippingMin}
                  onChange={(e) => setStoreInfo({ ...storeInfo, freeShippingMin: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Appearance" description="Customize the look and feel." delay={0.08}>
          <div className="space-y-5">
            <Field label="Theme">
              <div className="flex gap-3 mt-1">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { if (theme !== value) toggleTheme(); }}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      theme === value
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                    {theme === value && <Check size={16} className="ml-1" />}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security" description="Change your admin password." delay={0.16}>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Field label="Current Password">
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={adminCreds.currentPassword}
                  onChange={(e) => setAdminCreds({ ...adminCreds, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="New Password">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={adminCreds.newPassword}
                  onChange={(e) => setAdminCreds({ ...adminCreds, newPassword: e.target.value })}
                  placeholder="Min 6 characters"
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm New Password">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={adminCreds.confirmPassword}
                  onChange={(e) => setAdminCreds({ ...adminCreds, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
              >
                <Shield size={16} /> Update Password
              </button>
            </div>
          </form>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications" description="Configure alert preferences." delay={0.24}>
          <div className="space-y-4">
            <Toggle
              label="New order alerts"
              checked={notifications.newOrder}
              onChange={(v) => setNotifications({ ...notifications, newOrder: v })}
            />
            <Toggle
              label="Low stock warnings"
              checked={notifications.lowStock}
              onChange={(v) => setNotifications({ ...notifications, lowStock: v })}
            />
            <Toggle
              label="New customer sign-up"
              checked={notifications.newCustomer}
              onChange={(v) => setNotifications({ ...notifications, newCustomer: v })}
            />
            <Toggle
              label="Daily summary report"
              checked={notifications.dailyReport}
              onChange={(v) => setNotifications({ ...notifications, dailyReport: v })}
            />
            <Toggle
              label="Email notifications"
              checked={notifications.emailAlerts}
              onChange={(v) => setNotifications({ ...notifications, emailAlerts: v })}
            />
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
              >
                <Save size={16} /> Save Preferences
              </button>
            </div>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section icon={AlertTriangle} title="Danger Zone" description="Irreversible actions — proceed with caution." delay={0.32}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Clear All Application Data</p>
                <p className="text-xs text-red-500 dark:text-red-400/70 mt-0.5">Removes settings, cart, and wishlist from local storage.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <Trash2 size={14} /> Clear Data
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Clear All Data?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              This will remove all settings, cart items, and wishlist data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
              >
                Clear Everything
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

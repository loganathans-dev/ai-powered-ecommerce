import React, { useState, useEffect } from 'react';
import { User, Heart, Settings, Edit2, Package, Clock, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mockUser } from '../data/mockData';

const Profile = () => {
  const { user, updateUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || mockUser.name, email: user?.email || mockUser.email, phone: user?.phone || mockUser.phone });
  const [addresses, setAddresses] = useState(user?.addresses?.length > 0 ? user.addresses : mockUser.addresses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: '', street: '', city: '', state: '', zip: '' });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'profile';
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.email) {
      toast.error('You must be logged in to delete your account');
      return;
    }
    if (!deletePassword) {
      toast.error('Enter your password to confirm deletion');
      return;
    }

    setDeletingAccount(true);
    try {
      await api.deleteAccount(user.email, deletePassword);
      toast.success('Your account has been deleted');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      api.getUserOrders(user.email).then(setUserOrders).catch(console.error);
    } else {
      setUserOrders([]);
    }
  }, [user?.email]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-28">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border-4 border-white dark:border-slate-800 shadow-lg">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{user?.name || mockUser.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email || mockUser.email}</p>
          </div>

          <nav className="flex flex-col gap-2">
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User}>Personal Info</TabButton>
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={Package}>My Orders</TabButton>
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings}>Account Settings</TabButton>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
              {!isEditingProfile ? (
                <button 
                  onClick={() => {
                    setProfileForm({ name: user?.name || mockUser.name, email: user?.email || mockUser.email, phone: user?.phone || mockUser.phone });
                    setIsEditingProfile(true);
                  }}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Edit2 size={16} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      updateUser(profileForm);
                      setIsEditingProfile(false);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Full Name</p>
                {isEditingProfile ? (
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="font-medium text-slate-900 dark:text-white text-lg">{user?.name || mockUser.name}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email Address</p>
                {isEditingProfile ? (
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="font-medium text-slate-900 dark:text-white text-lg">{user?.email || mockUser.email}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Phone Number</p>
                {isEditingProfile ? (
                  <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="font-medium text-slate-900 dark:text-white text-lg">{user?.phone || mockUser.phone}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-8"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Saved Addresses</h3>
              <button 
                onClick={() => {
                  if (showAddForm) {
                    setShowAddForm(false);
                    setEditingAddressId(null);
                    setNewAddress({ type: '', street: '', city: '', state: '', zip: '' });
                  } else {
                    setShowAddForm(true);
                  }
                }}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add Address'}
              </button>
            </div>

            {showAddForm && (
              <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold mb-4 text-slate-900 dark:text-white">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Address Type (e.g., Home, Work)" value={newAddress.type} onChange={e => setNewAddress({...newAddress, type: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="text" placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" placeholder="ZIP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (newAddress.type && newAddress.street && newAddress.city) {
                      if (editingAddressId) {
                        setAddresses(addresses.map(a => a.id === editingAddressId ? { ...newAddress, id: a.id, isDefault: a.isDefault } : a));
                      } else {
                        setAddresses([...addresses, { ...newAddress, id: Date.now().toString(), isDefault: addresses.length === 0 }]);
                      }
                      setNewAddress({ type: '', street: '', city: '', state: '', zip: '' });
                      setShowAddForm(false);
                      setEditingAddressId(null);
                    }
                  }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            )}

            {addresses && addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">{addr.type}</h4>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => {
                            setNewAddress(addr);
                            setEditingAddressId(addr.id);
                            setShowAddForm(true);
                          }}
                          className="text-slate-400 hover:text-indigo-500 p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          title="Edit Address"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remove Address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {addr.street}<br/>
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No saved addresses.</p>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Orders</h2>
            {userOrders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">When you place an order, it will show up here.</p>
                <Link to="/home" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {userOrders.map((order) => (
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
                        <p className="text-xl font-bold text-slate-900 dark:text-white">₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-xl">👟</div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Account Settings</h2>
            
            {!isChangingPassword ? (
              <div className="space-y-6 max-w-md">
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium text-slate-700 dark:text-slate-300"
                >
                  Change Password
                </button>
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors font-medium"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                    <h3 className="font-bold mb-2 text-red-700 dark:text-red-400">Are you absolutely sure?</h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                      This action cannot be undone. Your account will be permanently removed from the database.
                    </p>
                    <div className="mb-4">
                      <label className="block text-sm text-red-700 dark:text-red-300 mb-1">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex-1 disabled:opacity-60"
                      >
                        {deletingAccount ? 'Deleting...' : 'Yes, delete my account'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                        }}
                        disabled={deletingAccount}
                        className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-4 py-2 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-md bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Change Password</h3>
                {passwordError && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{passwordError}</div>}
                {passwordSuccess && <div className="mb-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">{passwordSuccess}</div>}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.currentPassword} 
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.newPassword} 
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirmPassword} 
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      if (!passwordForm.currentPassword) {
                        setPasswordError('Please enter your current password');
                        return;
                      }
                      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                        setPasswordError('New passwords do not match');
                        return;
                      }
                      if (passwordForm.newPassword.length < 6) {
                        setPasswordError('Password must be at least 6 characters');
                        return;
                      }
                      setPasswordError('');
                      // Mock successful change
                      setPasswordSuccess('Password successfully updated!');
                      setTimeout(() => {
                        setIsChangingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setPasswordSuccess('');
                      }, 2000);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                  >
                    Update Password
                  </button>
                  <button 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left w-full ${
      active 
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white font-medium'
    }`}
  >
    <Icon size={18} />
    {children}
  </button>
);

const StatusBadge = ({ status }) => {
  if (status === 'Delivered') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={14} /> Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
      <Clock size={14} /> {status}
    </span>
  );
};

export default Profile;

import { fileToBase64 } from '../utils/fileToBase64.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: isFormData
      ? { ...options.headers }
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const api = {
  health: () => request('/health'),

  getProducts: (params = {}) => request(`/products${buildQuery(params)}`),

  getProduct: (id) => request(`/products/${id}`),

  createProduct: (data) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id, data) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),

  uploadImage: (file) =>
    fileToBase64(file).then((data) =>
      request('/upload/image', {
        method: 'POST',
        body: JSON.stringify({
          data,
          mimeType: file.type,
          filename: file.name,
        }),
      })
    ),

  getOrders: () => request('/orders'),

  getUserOrders: (email) => request(`/orders/user/${encodeURIComponent(email)}`),

  createOrder: (data) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: (email) => request(`/auth/me${buildQuery({ email })}`),

  adminLogin: (username, password) =>
    request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getAdminStats: (period) => request(`/admin/stats${buildQuery({ period })}`),

  updateProfile: (data) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAccount: (email, password) =>
    request('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ email, password }),
    }),

  getRazorpayKey: () => request('/payments/key'),

  createRazorpayOrder: (amount) =>
    request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  verifyPayment: (data) =>
    request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

import { mockProducts, mockOrders, mockCustomers, mockUser } from '../data/mockData';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  health: async () => {
    await delay(200);
    return { status: 'ok' };
  },

  getProducts: async (params = {}) => {
    await delay(500);
    let products = [...mockProducts];

    if (params.category) {
      products = products.filter(p => p.category === params.category);
    }
    if (params.featured === 'true' || params.featured === true) {
      products = products.filter(p => p.featured === true);
    }

    return products;
  },

  getProduct: async (id) => {
    await delay(300);
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  createProduct: async (data) => {
    await delay(300);
    return { ...data, id: Date.now() };
  },

  updateProduct: async (id, data) => {
    await delay(300);
    return { id, ...data };
  },

  deleteProduct: async (id) => {
    await delay(300);
    return { success: true };
  },

  getOrders: async () => {
    await delay(500);
    return mockOrders;
  },

  getUserOrders: async (email) => {
    await delay(300);
    return mockOrders; // Simplified for mock
  },

  createOrder: async (data) => {
    await delay(500);
    return { ...data, id: "ORD-" + Math.floor(Math.random() * 100000) };
  },

  updateOrderStatus: async (id, status) => {
    await delay(300);
    return { id, status };
  },

  login: async (email, password) => {
    await delay(500);
    if (email === mockUser.email || (email && password)) { // simple mock accepts any if not mockUser
      return { user: mockUser, token: "mock-jwt-token" };
    }
    throw new Error("Invalid credentials");
  },

  signup: async (data) => {
    await delay(500);
    return { user: { ...data, addresses: [] }, token: "mock-jwt-token" };
  },

  adminLogin: async (username, password) => {
    await delay(500);
    if (username === 'admin' && password === 'admin') {
      return { user: { name: 'Admin', role: 'admin' }, token: "admin-token" };
    }
    // Allow any for testing if needed, or enforce 'admin'
    return { user: { name: 'Admin', role: 'admin' }, token: "admin-token" };
  },

  updateProfile: async (data) => {
    await delay(300);
    return data;
  },
};

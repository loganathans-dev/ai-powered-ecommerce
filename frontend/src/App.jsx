import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import ProductList from './pages/ProductList'
import ProductDetails from './pages/ProductDetails'

import Cart from './pages/Cart'
import Address from './pages/Address'
import Payment from './pages/Payment'
import MyOrder from './pages/MyOrder'
import Profile from './pages/Profile'
import Terms from './pages/Terms'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import ManageProducts from './admin/ManageProducts'
import AdminOrders from './admin/AdminOrders'
import AdminLogin from './admin/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Customer Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/products" element={<ProductList title="All Products" />} />
          <Route path="/mens" element={<ProductList category="mens" title="Men's Collection" />} />
          <Route path="/womens" element={<ProductList category="womens" title="Women's Collection" />} />
          <Route path="/kids" element={<ProductList category="kids" title="Kids Collection" />} />
          <Route path="/brands" element={<ProductList title="All Brands" />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Address /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orders" element={<MyOrder />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

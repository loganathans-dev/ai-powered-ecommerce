import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

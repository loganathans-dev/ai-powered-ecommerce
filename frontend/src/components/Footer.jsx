import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div>
            <Link to="/home" className="flex items-center gap-2 mb-6">
              <span className="text-3xl">👟</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShoeShop
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Step into style with the latest and greatest in footwear. We offer premium brands and exclusive collections.
            </p>
            <div className="flex gap-4">
              <SocialIcon label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </SocialIcon>
              <SocialIcon label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </SocialIcon>
              <SocialIcon label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <FooterLink to="/home">Home</FooterLink>
              <FooterLink to="/mens">Men's Collection</FooterLink>
              <FooterLink to="/womens">Women's Collection</FooterLink>
              <FooterLink to="/kids">Kids Collection</FooterLink>
              <FooterLink to="/brands">Top Brands</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Support</h3>
            <ul className="flex flex-col gap-3">
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/terms">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Shipping & Returns</FooterLink>
              <FooterLink to="/profile">My Account</FooterLink>
              <FooterLink to="/orders">Order Tracking</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-slate-500 dark:text-slate-400">
              <li className="flex gap-3">
                <MapPin className="text-indigo-600 shrink-0" />
                <span>42, Brigade Road, Bangalore<br/>Karnataka, 560001</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="text-indigo-600 shrink-0" />
                <span>+91 80 4567 8901</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-indigo-600 shrink-0" />
                <span>support@shoeshop.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} ShoeShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ label, children }) => (
  <a href="#" aria-label={label} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-colors">
    {children}
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
      {children}
    </Link>
  </li>
);

export default Footer;

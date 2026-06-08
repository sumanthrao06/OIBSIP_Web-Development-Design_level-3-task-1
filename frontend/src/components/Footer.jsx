import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-extrabold font-display text-white flex items-center gap-1.5">
              <span>🍕</span>
              <span>Slice<span className="text-rose-500">Craft</span></span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crafting premium, gourmet pizzas using artisanal dough and fresh, organic ingredients. Fully customized and delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Ordering</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Menu</Link>
              </li>
              <li>
                <Link to="/customizer" className="hover:text-white transition-colors">Pizza Customizer</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Basket</Link>
              </li>
            </ul>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Pizza Ranges</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Signature Collections</span>
              </li>
              <li>
                <span className="text-slate-400">Cheese Lovers Specialties</span>
              </li>
              <li>
                <span className="text-slate-400">Spicy Collection Range</span>
              </li>
            </ul>
          </div>

          {/* Operating details */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">SliceCraft HQ</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sector 62, Noida, Uttar Pradesh, India
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Support: support@slicecraft.com
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; 2026 SliceCraft Platform. All rights reserved.</p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors">Allergy Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

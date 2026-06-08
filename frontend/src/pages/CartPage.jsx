import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '../store/slices/cartSlice.js';
import api from '../services/api.js';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, tax, discount, grandTotal, coupon } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponLoading(true); setCouponError(null);
      const res = await api.post('/coupons/validate', { code: couponCode, orderAmount: subtotal });
      if (res.data.success) {
        dispatch(applyCoupon(res.data.coupon));
        setCouponCode('');
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    } finally { setCouponLoading(false); }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) return navigate('/login?redirect=/checkout');
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 space-y-6">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-black text-slate-700">Your basket is empty</h2>
        <p className="text-xs text-slate-400">Add some delicious pizzas to get started!</p>
        <button onClick={() => navigate('/')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-full transition-all">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-black tracking-tight">Your Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium flex gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded capitalize">{item.size}</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded capitalize">{item.crust?.replace('-',' ')}</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded capitalize">{item.sauce?.replace('-',' ')}</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded capitalize">{item.cheese}</span>
                    {item.vegToppings?.map(t => <span key={t} className="bg-green-50 text-green-600 px-2 py-0.5 rounded">{t}</span>)}
                    {item.nonVegToppings?.map(t => <span key={t} className="bg-red-50 text-red-600 px-2 py-0.5 rounded">{t}</span>)}
                    {item.extras?.map(t => <span key={t} className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded">{t}</span>)}
                  </div>
                  <p className="text-base font-extrabold text-slate-800 font-display">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="text-slate-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-full border border-slate-200">
                    <button onClick={() => item.quantity > 1 && dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium self-start space-y-5 lg:sticky lg:top-24">
          <h3 className="text-base font-bold text-slate-800">Order Summary</h3>

          {/* Coupon Input */}
          <div className="space-y-2">
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-600" /><span className="text-xs font-bold text-green-700">{coupon.code} applied</span></div>
                <button onClick={() => dispatch(removeCoupon())} className="text-[10px] font-bold text-red-500">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Promo Code" className="flex-1 bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none" />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 rounded-xl transition-all">{couponLoading ? '...' : 'Apply'}</button>
              </div>
            )}
            {couponError && <p className="text-[10px] font-bold text-red-500">{couponError}</p>}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">₹{subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-bold">-₹{discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Tax (5%)</span><span className="font-bold">₹{tax.toFixed(2)}</span></div>
            <div className="flex justify-between pt-3 border-t border-slate-100 text-base"><span className="font-extrabold text-slate-800">Total</span><span className="font-extrabold text-rose-600 font-display">₹{grandTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={handleCheckout} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

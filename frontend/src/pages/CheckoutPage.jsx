import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, Smartphone, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice.js';
import api from '../services/api.js';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard (Mock)', icon: CreditCard },
  { id: 'cod', label: 'Cash On Delivery', desc: 'Pay when delivered', icon: Banknote },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, tax, discount, grandTotal, coupon } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      street: user?.address || '',
      city: 'Hyderabad',
      zipCode: ''
    }
  });

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        items: items.map(item => ({
          pizza: item.pizza,
          name: item.name,
          size: item.size,
          crust: item.crust,
          sauce: item.sauce,
          cheese: item.cheese,
          vegToppings: item.vegToppings,
          nonVegToppings: item.nonVegToppings,
          extras: item.extras,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode
        },
        paymentMethod,
        couponCode: coupon?.code || null
      };

      const res = await api.post('/orders', orderData);
      if (res.data.success) {
        setOrderPlaced(res.data.order);
        dispatch(clearCart());
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Order Placed!</h2>
        <p className="text-sm text-slate-500">Your order <span className="font-bold text-slate-800">{orderPlaced.orderId}</span> has been placed successfully.</p>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Order ID</span><span className="font-bold">{orderPlaced.orderId}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Payment</span><span className="font-bold capitalize">{orderPlaced.paymentMethod === 'cod' ? 'Cash On Delivery' : orderPlaced.paymentMethod.toUpperCase()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><span className="font-bold text-green-600 capitalize">{orderPlaced.paymentStatus}</span></div>
          <div className="flex justify-between text-base pt-3 border-t border-slate-100"><span className="font-extrabold">Grand Total</span><span className="font-extrabold text-rose-600 font-display">₹{orderPlaced.grandTotal.toFixed(2)}</span></div>
        </div>
        <div className="flex items-center justify-center gap-3 pt-4">
          <button onClick={() => navigate(`/order/${orderPlaced._id}`)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-full transition-all">Track Order</button>
          <button onClick={() => navigate('/')} className="bg-white border border-slate-200 text-slate-700 font-bold text-sm px-6 py-3 rounded-full transition-all hover:bg-slate-50">Back to Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-black tracking-tight">Checkout</h1>

      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-5">
              <h3 className="text-base font-bold text-slate-800">Who are we delivering to?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" placeholder="First name is fine" reg={register('name', { required: 'Name is required' })} error={errors.name} />
                <Field label="Mobile" placeholder="So we can contact you" reg={register('phone', { required: 'Phone is required' })} error={errors.phone} />
                <Field label="Email Address" placeholder="To send your confirmation" reg={register('email', { required: 'Email is required' })} error={errors.email} className="sm:col-span-2" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-5">
              <h3 className="text-base font-bold text-slate-800">Where should we deliver it?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Street Address" placeholder="Full address" reg={register('street', { required: 'Address is required' })} error={errors.street} className="sm:col-span-2" />
                <Field label="City" placeholder="City" reg={register('city', { required: 'City is required' })} error={errors.city} />
                <Field label="Zip Code" placeholder="Pincode" reg={register('zipCode', { required: 'Zip code is required' })} error={errors.zipCode} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-5">
              <h3 className="text-base font-bold text-slate-800">How would you like to pay?</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${paymentMethod === pm.id ? 'border-rose-500 bg-rose-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === pm.id ? 'border-rose-600 bg-rose-600' : 'border-slate-300'}`}>
                      {paymentMethod === pm.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? 'text-rose-600' : 'text-slate-400'}`} />
                    <div>
                      <span className={`text-sm font-bold ${paymentMethod === pm.id ? 'text-rose-700' : 'text-slate-700'}`}>{pm.label}</span>
                      <p className="text-[10px] text-slate-400">{pm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Mock Card Details (No real charges)</p>
                  <input placeholder="Card Number: 4242 4242 4242 4242" className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY: 12/28" className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold outline-none" />
                    <input placeholder="CVV: 123" className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold outline-none" />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-3 text-center space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Mock UPI Payment</p>
                  <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl mx-auto flex items-center justify-center">
                    <span className="text-5xl">📱</span>
                  </div>
                  <p className="text-xs text-slate-500">Payment will be simulated on submission</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium self-start space-y-5 lg:sticky lg:top-24">
            <h3 className="text-base font-bold text-slate-800">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-xs border-b border-slate-50 pb-2">
                  <div><span className="font-bold text-slate-700">{item.name}</span><span className="text-slate-400 ml-1">×{item.quantity}</span></div>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm pt-2 border-t border-slate-100">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">₹{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-bold">-₹{discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">Tax (5%)</span><span className="font-bold">₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between pt-3 border-t border-slate-100 text-base"><span className="font-extrabold">Amount Payable</span><span className="font-extrabold text-rose-600 font-display">₹{grandTotal.toFixed(2)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Place Order — ₹{grandTotal.toFixed(2)}</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, placeholder, reg, error, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-slate-600">{label}</label>
      <input placeholder={placeholder} {...reg} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 px-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
      {error && <p className="text-[10px] font-bold text-red-500">{error.message}</p>}
    </div>
  );
}

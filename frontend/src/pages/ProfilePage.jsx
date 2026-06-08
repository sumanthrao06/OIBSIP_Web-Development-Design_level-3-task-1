import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Package, Heart, Loader2, Save, RotateCcw, Eye } from 'lucide-react';
import { updateUser } from '../store/slices/authSlice.js';
import api from '../services/api.js';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '', address: user?.address || '' }
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoading(true);
      api.get('/orders/my-orders').then(r => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false));
    }
    if (activeTab === 'favorites') {
      setLoading(true);
      api.get('/favorites').then(r => setFavorites(r.data.favorites)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [activeTab]);

  const onSaveProfile = async (data) => {
    try {
      setSaving(true);
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        dispatch(updateUser(res.data.user));
        setToast('Profile updated!');
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    } finally { setSaving(false); }
  };

  const handleReorder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/reorder`);
      setToast('Items added to basket!');
      setTimeout(() => { setToast(null); navigate('/cart'); }, 1500);
    } catch (err) {
      setToast(err.response?.data?.message || 'Reorder failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {toast && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl">🍕 {toast}</div>}

      <h1 className="text-3xl font-black tracking-tight">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors ${activeTab === t.id ? 'bg-white border border-b-0 border-slate-100 text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onSaveProfile)} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-premium space-y-6 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 font-bold rounded-full flex items-center justify-center text-2xl font-display">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="text-[9px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{user?.role}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Full Name</label>
              <input {...register('name')} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 px-4 text-sm font-semibold outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Phone</label>
              <input {...register('phone')} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 px-4 text-sm font-semibold outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Address</label>
              <textarea rows={2} {...register('address')} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 px-4 text-sm font-semibold outline-none transition-all" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-rose-600" /></div> :
           orders.length === 0 ? <p className="text-center text-sm text-slate-400 py-12">No orders found yet.</p> :
            orders.map(order => (
              <div key={order._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{order.orderId}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{order.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-400">{order.items.length} item(s) • ₹{order.grandTotal.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/order/${order._id}`)} className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Track
                  </button>
                  <button onClick={() => handleReorder(order._id)} className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Reorder
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-rose-600" /></div> :
           favorites.length === 0 ? <p className="text-center text-sm text-slate-400 py-12">No saved favorites yet. Customize a pizza and save it!</p> :
            favorites.map(fav => (
              <div key={fav._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{fav.name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{fav.configuration.size} • {fav.configuration.crust.replace('-',' ')} • ₹{fav.price}</p>
                  </div>
                  <span className="text-base font-extrabold text-rose-600 font-display">₹{fav.price}</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

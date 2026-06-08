import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Package, Users, DollarSign, TrendingUp, Pizza, Tag, Search, ChevronDown, Ban, Trash2, Eye, RefreshCw } from 'lucide-react';
import api from '../services/api.js';

const COLORS = ['#e11d48', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

const TABS = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'offers', label: 'Offers' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Users' },
];

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'pizzas') {
        const res = await api.get('/pizzas');
        setPizzas(res.data.pizzas);
      } else if (activeTab === 'offers') {
        const res = await api.get('/offers');
        setOffers(res.data.offers);
      } else if (activeTab === 'orders') {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (statusFilter) params.status = statusFilter;
        const res = await api.get('/orders', { params });
        setOrders(res.data.orders);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDeletePizza = async (id) => {
    if (!confirm('Delete this pizza?')) return;
    try { await api.delete(`/pizzas/${id}`); setPizzas(p => p.filter(x => x._id !== id)); showToast('Pizza deleted'); } catch { showToast('Delete failed'); }
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm('Delete this offer?')) return;
    try { await api.delete(`/offers/${id}`); setOffers(o => o.filter(x => x._id !== id)); showToast('Offer deleted'); } catch { showToast('Delete failed'); }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      showToast(`Order status updated to ${status.replace('_', ' ')}`);
    } catch (err) { showToast(err.response?.data?.message || 'Update failed'); }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/block`);
      setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u));
      showToast(res.data.message);
    } catch { showToast('Action failed'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await api.delete(`/admin/users/${userId}`); setUsers(u => u.filter(x => x._id !== userId)); showToast('User deleted'); } catch { showToast('Delete failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {toast && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your SliceCraft platform</p>
        </div>
        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">Admin Console</span>
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-0.5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setSearchQuery(''); setStatusFilter(''); }} className={`px-5 py-3 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors ${activeTab === t.id ? 'bg-white border border-b-0 border-slate-100 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>
      ) : (
        <>
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && stats && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
                  { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-50 text-purple-600' },
                  { label: 'Conversion', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium space-y-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
                    <div>
                      <p className="text-2xl font-extrabold font-display text-slate-800">{kpi.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales History Line Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Sales Trend (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={stats.salesHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Popular Pizzas Pie Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Popular Pizzas</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={stats.popularPizzas} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                        {stats.popularPizzas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Popular Toppings Bar Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium lg:col-span-2">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Popular Toppings</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.popularToppings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="count" fill="#e11d48" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PIZZAS TAB */}
          {activeTab === 'pizzas' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Name</th><th className="py-3 px-4">Category</th><th className="py-3 px-4">Small</th><th className="py-3 px-4">Medium</th><th className="py-3 px-4">Large</th><th className="py-3 px-4">Rating</th><th className="py-3 px-4">Actions</th>
                  </tr></thead>
                  <tbody>
                    {pizzas.map(p => (
                      <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-slate-700">{p.name}</td>
                        <td className="py-3 px-4"><span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded capitalize">{p.category.replace('-',' ')}</span></td>
                        <td className="py-3 px-4 text-xs font-bold">₹{p.sizePrices.small}</td>
                        <td className="py-3 px-4 text-xs font-bold">₹{p.sizePrices.medium}</td>
                        <td className="py-3 px-4 text-xs font-bold">₹{p.sizePrices.large}</td>
                        <td className="py-3 px-4 text-xs font-bold">{p.averageRating || '-'}</td>
                        <td className="py-3 px-4"><button onClick={() => handleDeletePizza(p._id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OFFERS TAB */}
          {activeTab === 'offers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map(offer => (
                <div key={offer._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{offer.title}</h4>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${offer.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{offer.isActive ? 'Active' : 'Expired'}</span>
                  </div>
                  <p className="text-xs text-slate-400">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">{offer.code}</span>
                    <button onClick={() => handleDeleteOffer(offer._id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadTabData()} placeholder="Search by order ID, name, email..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none" />
                </div>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); }} className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold outline-none">
                  <option value="">All Statuses</option>
                  {['placed','confirmed','preparing','baking','out_for_delivery','delivered'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
                <button onClick={loadTabData} className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Order ID</th><th className="py-3 px-4">Customer</th><th className="py-3 px-4">Items</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Update</th>
                  </tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-slate-700">{o.orderId}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{o.user?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-xs">{o.items.length} item(s)</td>
                        <td className="py-3 px-4 text-xs font-bold">₹{o.grandTotal.toFixed(0)}</td>
                        <td className="py-3 px-4"><span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{o.status.replace('_',' ')}</span></td>
                        <td className="py-3 px-4">
                          <select value={o.status} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-semibold outline-none">
                            {['placed','confirmed','preparing','baking','out_for_delivery','delivered'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No orders found.</p>}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Name</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Phone</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Actions</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-bold text-slate-700">{u.name}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{u.email}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{u.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <button onClick={() => handleToggleBlock(u._id)} title={u.isBlocked ? 'Unblock' : 'Block'} className="text-amber-500 hover:text-amber-700 transition-colors"><Ban className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No users found.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

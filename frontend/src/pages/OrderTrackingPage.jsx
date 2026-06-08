import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle2, Circle, Package, ChefHat, Flame, Truck, Home } from 'lucide-react';
import api from '../services/api.js';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package, color: 'rose' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'blue' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, color: 'amber' },
  { key: 'baking', label: 'Baking', icon: Flame, color: 'orange' },
  { key: 'out_for_delivery', label: 'Out For Delivery', icon: Truck, color: 'purple' },
  { key: 'delivered', label: 'Delivered', icon: Home, color: 'green' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;
  if (!order) return <div className="text-center py-32 text-slate-400">Order not found or not authorized.</div>;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Order Tracking</h1>
        <p className="text-sm text-slate-400">Order <span className="font-bold text-slate-700">{order.orderId}</span></p>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-premium">
        <div className="relative">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const timelineEntry = order.statusTimeline?.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex items-start gap-4 mb-8 last:mb-0">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'bg-rose-100 border-rose-500 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 ${index < currentStepIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                  )}
                </div>

                {/* Step Info */}
                <div className="pt-2 space-y-0.5">
                  <h4 className={`text-sm font-bold ${isCompleted ? 'text-green-700' : isCurrent ? 'text-rose-700' : 'text-slate-400'}`}>{step.label}</h4>
                  {timelineEntry && (
                    <p className="text-[10px] text-slate-400">{new Date(timelineEntry.timestamp).toLocaleString()}</p>
                  )}
                  {isCurrent && !isCompleted && currentStepIndex < STATUS_STEPS.length - 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                      In progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-4">
        <h3 className="text-base font-bold text-slate-800">Order Details</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0">
              <div>
                <span className="font-bold text-slate-700">{item.name}</span>
                <span className="text-slate-400 ml-1">×{item.quantity}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[9px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded capitalize">{item.size}</span>
                  <span className="text-[9px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded capitalize">{item.crust?.replace('-',' ')}</span>
                </div>
              </div>
              <span className="font-bold">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">₹{order.subtotal.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-bold">-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">Tax</span><span className="font-bold">₹{order.tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-base pt-2 border-t border-slate-100"><span className="font-extrabold">Grand Total</span><span className="font-extrabold text-rose-600 font-display">₹{order.grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-2">
        <h3 className="text-base font-bold text-slate-800">Delivery Address</h3>
        <p className="text-sm text-slate-600">{order.deliveryAddress.name}</p>
        <p className="text-xs text-slate-400">{order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.zipCode}</p>
        <p className="text-xs text-slate-400">{order.deliveryAddress.phone} • {order.deliveryAddress.email}</p>
      </div>
    </div>
  );
}

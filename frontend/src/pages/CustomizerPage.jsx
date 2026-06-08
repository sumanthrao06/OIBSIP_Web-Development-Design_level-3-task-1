import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Circle } from 'lucide-react';
import api from '../services/api.js';
import {
  initializeCustomizer, setSize, setCrust, setSauce, setCheese,
  toggleVegTopping, toggleNonVegTopping, toggleExtra
} from '../store/slices/customizerSlice.js';
import { addToCart } from '../store/slices/cartSlice.js';
import LivePizzaPreview from '../components/LivePizzaPreview.jsx';

const SIZES = [
  { id: 'small', label: 'Small', desc: '7 inch • Serves 1' },
  { id: 'medium', label: 'Medium', desc: '10 inch • Serves 2' },
  { id: 'large', label: 'Large', desc: '13 inch • Serves 3-4' },
];
const CRUSTS = [
  { id: 'thin', label: 'Thin Crust', price: 0 },
  { id: 'hand-tossed', label: 'Hand Tossed', price: 0 },
  { id: 'cheese-burst', label: 'Cheese Burst', price: 79 },
  { id: 'stuffed-crust', label: 'Stuffed Crust', price: 99 },
  { id: 'whole-wheat', label: 'Whole Wheat', price: 29 },
];
const SAUCES = [
  { id: 'tomato', label: 'Classic Tomato', price: 0 },
  { id: 'bbq', label: 'BBQ', price: 20 },
  { id: 'garlic-parmesan', label: 'Garlic Parmesan', price: 30 },
  { id: 'pesto', label: 'Pesto', price: 40 },
  { id: 'arrabbiata', label: 'Spicy Arrabbiata', price: 20 },
];
const CHEESES = [
  { id: 'mozzarella', label: 'Mozzarella', price: 0 },
  { id: 'cheddar', label: 'Cheddar', price: 30 },
  { id: 'parmesan', label: 'Parmesan', price: 40 },
  { id: 'vegan', label: 'Vegan Cheese', price: 40 },
];
const VEG_TOPPINGS = ['Onion','Tomato','Mushroom','Corn','Capsicum','Paneer','Olive','Jalapeno'];
const NON_VEG_TOPPINGS = ['Chicken','Pepperoni','Sausage','Bacon','Ham'];
const EXTRAS = [
  { id: 'Extra Cheese', label: 'Extra Cheese', price: 39 },
  { id: 'Double Cheese', label: 'Double Cheese', price: 59 },
  { id: 'Extra Sauce', label: 'Extra Sauce', price: 15 },
  { id: 'Stuffed Edge', label: 'Stuffed Edge', price: 49 },
];

function RadioOption({ selected, label, sublabel, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${selected ? 'border-rose-500 bg-rose-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'border-rose-600 bg-rose-600' : 'border-slate-300'}`}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <span className={`text-sm font-bold ${selected ? 'text-rose-700' : 'text-slate-700'}`}>{label}</span>
        {sublabel && <p className="text-[10px] text-slate-400">{sublabel}</p>}
      </div>
    </button>
  );
}

function CheckboxOption({ checked, label, sublabel, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${checked ? 'border-rose-500 bg-rose-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'border-rose-600 bg-rose-600' : 'border-slate-300'}`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <span className={`text-xs font-bold ${checked ? 'text-rose-700' : 'text-slate-600'}`}>{label}</span>
        {sublabel && <span className="text-[10px] text-slate-400 ml-1">{sublabel}</span>}
      </div>
    </button>
  );
}

export default function CustomizerPage() {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizzaId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customizer = useSelector(s => s.customizer);
  const [toast, setToast] = React.useState(null);

  useEffect(() => {
    const init = async () => {
      if (pizzaId) {
        try {
          const res = await api.get(`/pizzas/${pizzaId}`);
          dispatch(initializeCustomizer(res.data.pizza));
        } catch { dispatch(initializeCustomizer(null)); }
      } else {
        dispatch(initializeCustomizer(null));
      }
    };
    init();
  }, [pizzaId, dispatch]);

  const handleAddToCart = () => {
    const item = {
      pizza: customizer.basePizza?._id || null,
      name: customizer.name,
      size: customizer.size,
      crust: customizer.crust,
      sauce: customizer.sauce,
      cheese: customizer.cheese,
      vegToppings: customizer.vegToppings,
      nonVegToppings: customizer.nonVegToppings,
      extras: customizer.extras,
      quantity: 1,
      price: customizer.price
    };
    dispatch(addToCart(item));
    setToast('Custom pizza added to basket!');
    setTimeout(() => { setToast(null); navigate('/cart'); }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {toast && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl">🍕 {toast}</div>}

      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Pizza Customization Engine</h1>
        <p className="text-xs text-slate-400">Build your dream pizza step-by-step with real-time preview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Live Preview + Price */}
        <div className="lg:sticky lg:top-24 space-y-6 self-start">
          <LivePizzaPreview
            size={customizer.size}
            crust={customizer.crust}
            sauce={customizer.sauce}
            cheese={customizer.cheese}
            vegToppings={customizer.vegToppings}
            nonVegToppings={customizer.nonVegToppings}
            extras={customizer.extras}
          />
          {/* Dynamic Price */}
          <motion.div key={customizer.price} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Custom Price</p>
            <p className="text-4xl font-black font-display">₹{customizer.price}</p>
            <p className="text-xs text-slate-400">{customizer.name}</p>
          </motion.div>
          <button onClick={handleAddToCart} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Add Custom Pizza to Basket — ₹{customizer.price}
          </button>
        </div>

        {/* RIGHT: Steps */}
        <div className="space-y-8">
          {/* Step 1: Size */}
          <Section title="Step 1" subtitle="Choose Size">
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map(s => <RadioOption key={s.id} selected={customizer.size === s.id} label={s.label} sublabel={s.desc} onClick={() => dispatch(setSize(s.id))} />)}
            </div>
          </Section>

          {/* Step 2: Crust */}
          <Section title="Step 2" subtitle="Choose Crust">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRUSTS.map(c => <RadioOption key={c.id} selected={customizer.crust === c.id} label={c.label} sublabel={c.price > 0 ? `+₹${c.price}` : 'Included'} onClick={() => dispatch(setCrust(c.id))} />)}
            </div>
          </Section>

          {/* Step 3: Sauce */}
          <Section title="Step 3" subtitle="Choose Sauce">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAUCES.map(s => <RadioOption key={s.id} selected={customizer.sauce === s.id} label={s.label} sublabel={s.price > 0 ? `+₹${s.price}` : 'Included'} onClick={() => dispatch(setSauce(s.id))} />)}
            </div>
          </Section>

          {/* Step 4: Cheese */}
          <Section title="Step 4" subtitle="Choose Cheese">
            <div className="grid grid-cols-2 gap-3">
              {CHEESES.map(c => <RadioOption key={c.id} selected={customizer.cheese === c.id} label={c.label} sublabel={c.price > 0 ? `+₹${c.price}` : 'Included'} onClick={() => dispatch(setCheese(c.id))} />)}
            </div>
          </Section>

          {/* Step 5: Veg Toppings */}
          <Section title="Step 5" subtitle="Veg Toppings (₹25 each)">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VEG_TOPPINGS.map(t => <CheckboxOption key={t} checked={customizer.vegToppings.includes(t)} label={t} sublabel="+₹25" onClick={() => dispatch(toggleVegTopping(t))} />)}
            </div>
          </Section>

          {/* Step 6: Non-Veg Toppings */}
          <Section title="Step 6" subtitle="Non-Veg Toppings (₹45 each)">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NON_VEG_TOPPINGS.map(t => <CheckboxOption key={t} checked={customizer.nonVegToppings.includes(t)} label={t} sublabel="+₹45" onClick={() => dispatch(toggleNonVegTopping(t))} />)}
            </div>
          </Section>

          {/* Step 7: Extras */}
          <Section title="Step 7" subtitle="Extras & Add-ons">
            <div className="grid grid-cols-2 gap-2">
              {EXTRAS.map(e => <CheckboxOption key={e.id} checked={customizer.extras.includes(e.id)} label={e.label} sublabel={`+₹${e.price}`} onClick={() => dispatch(toggleExtra(e.id))} />)}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-4">
      <div>
        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{title}</span>
        <h3 className="text-base font-bold text-slate-800">{subtitle}</h3>
      </div>
      {children}
    </div>
  );
}

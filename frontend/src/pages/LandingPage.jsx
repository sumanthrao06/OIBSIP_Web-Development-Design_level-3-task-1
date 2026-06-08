import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShieldAlert, Heart, Flame, Leaf, Sparkles, Plus, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { addToCart } from '../store/slices/cartSlice.js';

const CATEGORIES = [
  { id: 'all', label: 'All Pizzas', icon: '🍕' },
  { id: 'cheese-lovers', label: 'Cheese Lovers', icon: '🧀' },
  { id: 'veg', label: 'Veggie Delights', icon: '🍃' },
  { id: 'non-veg', label: 'Meat Feasts', icon: '🍗' },
  { id: 'signature', label: 'Signature Special', icon: '✨' },
  { id: 'premium', label: 'Premium Gourmet', icon: '👑' },
  { id: 'spicy', label: 'Spicy Collection', icon: '🌶️' }
];

export default function LandingPage() {
  const [pizzas, setPizzas] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pizzaRes, offerRes] = await Promise.all([
          api.get('/pizzas'),
          api.get('/offers?activeOnly=true')
        ]);
        setPizzas(pizzaRes.data.pizzas);
        setOffers(offerRes.data.offers);
        setError(null);
      } catch (err) {
        console.error('Landing page loading failed:', err.message);
        setError('Unable to fetch menu data. Please verify database connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickAdd = (pizza) => {
    // Standard default configuration: medium, hand-tossed, tomato sauce, mozzarella cheese
    const defaultItem = {
      pizza: pizza._id,
      name: pizza.name,
      size: 'medium',
      crust: 'hand-tossed',
      sauce: 'tomato',
      cheese: 'mozzarella',
      vegToppings: pizza.ingredients.filter(i => ['Onion', 'Tomato', 'Mushroom', 'Corn', 'Capsicum', 'Paneer', 'Olive', 'Jalapeno'].includes(i)),
      nonVegToppings: pizza.ingredients.filter(i => ['Chicken', 'Pepperoni', 'Sausage', 'Bacon', 'Ham'].includes(i)),
      extras: [],
      quantity: 1,
      price: pizza.sizePrices.medium
    };

    dispatch(addToCart(defaultItem));
    showToast(`Added 1x ${pizza.name} (Medium) to basket!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredPizzas = selectedCategory === 'all' 
    ? pizzas 
    : pizzas.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-12 pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800">
          <span>🍕</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative bg-rose-50/50 rounded-[40px] px-8 py-12 md:py-20 max-w-7xl mx-auto overflow-hidden mt-6 flex flex-col md:flex-row items-center justify-between border border-rose-100/40">
        
        {/* Abstract Background Blurs */}
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-rose-300/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[10%] w-72 h-72 bg-amber-200/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-xl space-y-6 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Artisanal Pizza Craftsmanship
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-slate-900 leading-[1.05] tracking-tight">
            Original Recipes.<br />
            <span className="text-rose-600">Premium Taste.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md">
            Design your dream pizza shell-to-crust with our real-time interactive engine or order one of our signature chef creations.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate('/customizer')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Sliders className="w-4.5 h-4.5" />
              Build Custom Pizza
            </button>
            <a
              href="#menu"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm px-6 py-3.5 rounded-full transition-all"
            >
              Explore Menu
            </a>
          </div>
        </div>

        {/* Hero Pizza Rotating Image */}
        <div className="relative mt-12 md:mt-0 max-w-[280px] md:max-w-[360px] aspect-square flex items-center justify-center">
          <motion.img
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
            alt="Delicious Pizza Hero"
            className="w-[90%] h-[90%] object-cover rounded-full border-8 border-white shadow-2xl"
          />
        </div>
      </div>

      {/* Offers Section */}
      {offers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Exclusive Offers & Deals</h2>
              <p className="text-xs text-slate-400 mt-1">Unlock massive savings with our handpicked daily deals</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="group relative bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-full h-36 rounded-2xl overflow-hidden relative">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {offer.code}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{offer.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{offer.description}</p>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Min. order: Rs. {offer.minOrderValue}</span>
                  <button
                    onClick={() => {
                      if (offer.code === 'BOGO') {
                        navigate('/customizer');
                      } else {
                        // Apply code by copying it or navigating
                        showToast(`Promo Code ${offer.code} copied! Apply at checkout.`);
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-4 py-2 rounded-full transition-colors"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu / Pizzas Grid Section */}
      <div id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Our Premium Pizza Menu</h2>
          <p className="text-xs text-slate-400">Choose from our curated collections or build your own customized recipe.</p>
        </div>

        {/* Categories Carousel / Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-none justify-start md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading SliceCraft Menu...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-3xl text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-bold text-red-900">Database Connection Issue</h3>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            No pizzas found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPizzas.map((pizza) => (
              <div
                key={pizza._id}
                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium hover:-translate-y-1.5 hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Pizza Image & Badges */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Label */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-100 text-slate-800 font-bold text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase">
                      {pizza.category === 'veg' ? (
                        <>
                          <Leaf className="w-2.5 h-2.5 text-green-600 fill-green-600" />
                          <span className="text-green-600">Veg</span>
                        </>
                      ) : pizza.category === 'non-veg' ? (
                        <>
                          <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                          <span className="text-red-500">Non-Veg</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-2.5 h-2.5 text-purple-600 fill-purple-600" />
                          <span className="text-purple-600">{pizza.category.replace('-', ' ')}</span>
                        </>
                      )}
                    </div>

                    {pizza.isFeatured && (
                      <div className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Pizza Meta Info */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => navigate(`/pizza/${pizza._id}`)}
                        className="text-base font-extrabold text-slate-800 hover:text-rose-600 cursor-pointer transition-colors leading-tight"
                      >
                        {pizza.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-slate-700">{pizza.averageRating || '4.0'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                      {pizza.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400">Starts from</span>
                    <span className="text-base font-extrabold text-slate-800 font-display">
                      Rs. {pizza.sizePrices.small}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Customize Button */}
                    <button
                      onClick={() => navigate(`/customizer?pizzaId=${pizza._id}`)}
                      title="Customize toppings and size"
                      className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-full transition-colors"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {/* Quick Add */}
                    <button
                      onClick={() => handleQuickAdd(pizza)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to basket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

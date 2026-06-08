import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Sliders, Plus, ArrowLeft, Loader2, Info, Utensils, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { addToCart } from '../store/slices/cartSlice.js';

export default function PizzaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);

  const [pizza, setPizza] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pizzaRes, reviewRes] = await Promise.all([
          api.get(`/pizzas/${id}`),
          api.get(`/reviews/pizza/${id}`)
        ]);
        setPizza(pizzaRes.data.pizza);
        setReviews(reviewRes.data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleQuickAdd = () => {
    if (!pizza) return;
    const item = {
      pizza: pizza._id, name: pizza.name, size: 'medium', crust: 'hand-tossed', sauce: 'tomato', cheese: 'mozzarella',
      vegToppings: pizza.ingredients.filter(i => ['Onion','Tomato','Mushroom','Corn','Capsicum','Paneer','Olive','Jalapeno'].includes(i)),
      nonVegToppings: pizza.ingredients.filter(i => ['Chicken','Pepperoni','Sausage','Bacon','Ham'].includes(i)),
      extras: [], quantity: 1, price: pizza.sizePrices.medium
    };
    dispatch(addToCart(item));
    setToast(`Added ${pizza.name} to basket!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login?redirect=/pizza/' + id);
    try {
      setSubmitting(true);
      await api.post('/reviews', { pizzaId: id, ...reviewForm });
      const reviewRes = await api.get(`/reviews/pizza/${id}`);
      setReviews(reviewRes.data.reviews);
      setReviewForm({ rating: 5, comment: '' });
      setToast('Review submitted!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to submit review');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;
  if (!pizza) return <div className="text-center py-32 text-slate-400">Pizza not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {toast && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl">🍕 {toast}</div>}

      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-[32px] overflow-hidden bg-slate-100 shadow-premium">
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-rose-50 text-rose-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">{pizza.category.replace('-',' ')}</span>
              {pizza.isFeatured && <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">Featured</span>}
            </div>
            <h1 className="text-3xl font-black tracking-tight">{pizza.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700">{pizza.averageRating || '4.0'}</span>
              <span className="text-xs text-slate-400">({pizza.ratingsCount || 0} reviews)</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">{pizza.description}</p>

          {/* Pricing */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Size & Pricing</h3>
            <div className="grid grid-cols-3 gap-3">
              {['small','medium','large'].map(sz => (
                <div key={sz} className="text-center bg-white border border-slate-200 rounded-xl py-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{sz}</span>
                  <p className="text-lg font-extrabold text-slate-800 font-display">₹{pizza.sizePrices[sz]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {pizza.ingredients.map(ing => (
                <span key={ing} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">{ing}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => navigate(`/customizer?pizzaId=${pizza._id}`)} className="flex-1 bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
              <Sliders className="w-4 h-4" /> Customize
            </button>
            <button onClick={handleQuickAdd} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md">
              <Plus className="w-4 h-4" /> Add to Basket
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tabs: Nutrition / Reviews */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b border-slate-100">
          {['description','nutrition','reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-slate-500">
            <p>{pizza.description}</p>
            <p className="mt-4">Ingredients: {pizza.ingredients.join(', ')}</p>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Calories', value: pizza.nutritionalDetails.calories, unit: 'kcal', icon: Flame, color: 'text-orange-500' },
              { label: 'Protein', value: pizza.nutritionalDetails.protein, unit: 'g', icon: Info, color: 'text-blue-500' },
              { label: 'Carbs', value: pizza.nutritionalDetails.carbs, unit: 'g', icon: Utensils, color: 'text-green-500' },
              { label: 'Fat', value: pizza.nutritionalDetails.fat, unit: 'g', icon: Info, color: 'text-yellow-500' },
            ].map(n => (
              <div key={n.label} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-premium space-y-2">
                <n.icon className={`w-6 h-6 mx-auto ${n.color}`} />
                <p className="text-2xl font-extrabold font-display text-slate-800">{n.value}<span className="text-xs text-slate-400 ml-0.5">{n.unit}</span></p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{n.label}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Leave a Review</h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500">Rating:</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm(p => ({...p, rating: s}))}>
                      <Star className={`w-5 h-5 transition-colors ${s <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                value={reviewForm.comment}
                onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))}
                placeholder="Share your experience..."
                className="w-full bg-white border border-slate-200 focus:border-rose-500 rounded-xl py-3 px-4 text-sm outline-none transition-all placeholder:text-slate-400"
              />
              <button type="submit" disabled={submitting || !reviewForm.comment.trim()} className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            {/* Review List */}
            {reviews.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-100 text-rose-600 font-bold rounded-full flex items-center justify-center text-xs">{r.user?.name?.charAt(0) || '?'}</div>
                        <span className="text-sm font-bold text-slate-700">{r.user?.name || 'User'}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array(5).fill(0).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{r.comment}</p>
                    <p className="text-[10px] text-slate-300">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

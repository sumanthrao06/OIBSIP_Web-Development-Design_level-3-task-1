import { createSlice } from '@reduxjs/toolkit';

const cachedCartItems = localStorage.getItem('cartItems') 
  ? JSON.parse(localStorage.getItem('cartItems')) 
  : [];

const initialState = {
  items: cachedCartItems,
  coupon: null,
  subtotal: 0,
  tax: 0,
  discount: 0,
  grandTotal: 0
};

// Helper to calculate cart totals
const recalculateTotals = (state) => {
  let sub = 0;
  state.items.forEach(item => {
    sub += item.price * item.quantity;
  });
  state.subtotal = sub;

  if (state.coupon) {
    if (state.coupon.discountType === 'percentage') {
      state.discount = Math.round((sub * state.coupon.discountValue) / 100 * 100) / 100;
    } else {
      state.discount = state.coupon.discountValue;
    }
  } else {
    state.discount = 0;
  }

  // 5% Tax rate
  state.tax = Math.round((sub - state.discount) * 0.05 * 100) / 100;
  state.grandTotal = Math.max(0, Math.round((sub - state.discount + state.tax) * 100) / 100);
};

// Helper to check if two configurations match
const isSameConfiguration = (item1, item2) => {
  if (item1.pizza !== item2.pizza) return false;
  if (item1.size !== item2.size) return false;
  if (item1.crust !== item2.crust) return false;
  if (item1.sauce !== item2.sauce) return false;
  if (item1.cheese !== item2.cheese) return false;

  const compareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, index) => val === sorted2[index]);
  };

  return (
    compareArrays(item1.vegToppings, item2.vegToppings) &&
    compareArrays(item1.nonVegToppings, item2.nonVegToppings) &&
    compareArrays(item1.extras, item2.extras)
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      // Find if same pizza and config exists
      const existingItemIndex = state.items.findIndex(item => isSameConfiguration(item, newItem));

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += newItem.quantity || 1;
      } else {
        // Generate a random temporary client side id if not present
        const itemWithId = {
          ...newItem,
          id: newItem.id || `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        state.items.push(itemWithId);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
      recalculateTotals(state);
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      recalculateTotals(state);
    },
    updateQuantity(state, action) {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      recalculateTotals(state);
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
      recalculateTotals(state);
    },
    removeCoupon(state) {
      state.coupon = null;
      recalculateTotals(state);
    },
    syncCart(state, action) {
      state.items = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      recalculateTotals(state);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.subtotal = 0;
      state.tax = 0;
      state.discount = 0;
      state.grandTotal = 0;
      localStorage.removeItem('cartItems');
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  syncCart,
  clearCart
} = cartSlice.actions;

// Auto-run total recalculation on initial load
const reducer = cartSlice.reducer;
export default (state, action) => {
  const nextState = reducer(state, action);
  if (action.type.startsWith('cart/')) {
    // Totals are already updated in reducers
  } else if (!state) {
    // Initial load, calculate totals once
    const tempState = { ...nextState };
    recalculateTotals(tempState);
    return tempState;
  }
  return nextState;
};

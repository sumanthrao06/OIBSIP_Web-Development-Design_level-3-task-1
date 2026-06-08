import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basePizza: null,
  name: 'Custom Pizza',
  size: 'medium',
  crust: 'hand-tossed',
  sauce: 'tomato',
  cheese: 'mozzarella',
  vegToppings: [],
  nonVegToppings: [],
  extras: [],
  price: 249
};

// Pricing config factors
const CRUST_PRICES = {
  'thin': 0,
  'hand-tossed': 0,
  'cheese-burst': 79,
  'stuffed-crust': 99,
  'whole-wheat': 29
};

const SAUCE_PRICES = {
  'tomato': 0,
  'bbq': 20,
  'garlic-parmesan': 30,
  'pesto': 40,
  'arrabbiata': 20
};

const CHEESE_PRICES = {
  'mozzarella': 0,
  'cheddar': 30,
  'parmesan': 40,
  'vegan': 40
};

const VEG_TOPPING_PRICE = 25;
const NON_VEG_TOPPING_PRICE = 45;

const EXTRA_PRICES = {
  'Extra Cheese': 39,
  'Double Cheese': 59,
  'Extra Sauce': 15,
  'Stuffed Edge': 49
};

const computePrice = (state) => {
  let basePrice = 249; // Default medium custom price if starting from scratch

  if (state.basePizza) {
    basePrice = state.basePizza.sizePrices[state.size] || basePrice;
  } else {
    // Scratch customization base prices
    if (state.size === 'small') basePrice = 149;
    if (state.size === 'medium') basePrice = 249;
    if (state.size === 'large') basePrice = 349;
  }

  const crustCost = CRUST_PRICES[state.crust] || 0;
  const sauceCost = SAUCE_PRICES[state.sauce] || 0;
  const cheeseCost = CHEESE_PRICES[state.cheese] || 0;
  const vegCost = state.vegToppings.length * VEG_TOPPING_PRICE;
  const nonVegCost = state.nonVegToppings.length * NON_VEG_TOPPING_PRICE;
  
  let extrasCost = 0;
  state.extras.forEach(extra => {
    extrasCost += EXTRA_PRICES[extra] || 0;
  });

  state.price = basePrice + crustCost + sauceCost + cheeseCost + vegCost + nonVegCost + extrasCost;
};

const customizerSlice = createSlice({
  name: 'customizer',
  initialState,
  reducers: {
    initializeCustomizer(state, action) {
      const pizza = action.payload;
      if (pizza) {
        state.basePizza = pizza;
        state.name = pizza.name;
        state.size = 'medium';
        state.crust = 'hand-tossed';
        
        // Match base pizza ingredients if possible, else defaults
        state.sauce = 'tomato';
        state.cheese = 'mozzarella';
        
        // Map ingredients to toppings if they exist
        state.vegToppings = [];
        state.nonVegToppings = [];
        state.extras = [];
        
        // Parse base ingredients into customizer states
        const vegOptions = ['Onion', 'Tomato', 'Mushroom', 'Corn', 'Capsicum', 'Paneer', 'Olive', 'Jalapeno'];
        const meatOptions = ['Chicken', 'Pepperoni', 'Sausage', 'Bacon', 'Ham'];
        
        if (pizza.ingredients) {
          pizza.ingredients.forEach(ing => {
            if (vegOptions.includes(ing)) {
              state.vegToppings.push(ing);
            } else if (meatOptions.includes(ing)) {
              state.nonVegToppings.push(ing);
            }
          });
        }
      } else {
        // Start from scratch
        state.basePizza = null;
        state.name = 'Custom Pizza Build';
        state.size = 'medium';
        state.crust = 'hand-tossed';
        state.sauce = 'tomato';
        state.cheese = 'mozzarella';
        state.vegToppings = [];
        state.nonVegToppings = [];
        state.extras = [];
      }
      computePrice(state);
    },
    setSize(state, action) {
      state.size = action.payload;
      computePrice(state);
    },
    setCrust(state, action) {
      state.crust = action.payload;
      computePrice(state);
    },
    setSauce(state, action) {
      state.sauce = action.payload;
      computePrice(state);
    },
    setCheese(state, action) {
      state.cheese = action.payload;
      computePrice(state);
    },
    toggleVegTopping(state, action) {
      const topping = action.payload;
      const index = state.vegToppings.indexOf(topping);
      if (index > -1) {
        state.vegToppings.splice(index, 1);
      } else {
        state.vegToppings.push(topping);
      }
      computePrice(state);
    },
    toggleNonVegTopping(state, action) {
      const topping = action.payload;
      const index = state.nonVegToppings.indexOf(topping);
      if (index > -1) {
        state.nonVegToppings.splice(index, 1);
      } else {
        state.nonVegToppings.push(topping);
      }
      computePrice(state);
    },
    toggleExtra(state, action) {
      const extra = action.payload;
      const index = state.extras.indexOf(extra);
      if (index > -1) {
        state.extras.splice(index, 1);
      } else {
        state.extras.push(extra);
      }
      computePrice(state);
    },
    resetCustomizer(state) {
      return {
        ...initialState,
        id: `custom_${Date.now()}`
      };
    }
  }
});

export const {
  initializeCustomizer,
  setSize,
  setCrust,
  setSauce,
  setCheese,
  toggleVegTopping,
  toggleNonVegTopping,
  toggleExtra,
  resetCustomizer
} = customizerSlice.actions;

export default customizerSlice.reducer;

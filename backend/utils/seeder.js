import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Pizza from '../models/Pizza.js';
import Offer from '../models/Offer.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Favorite from '../models/Favorite.js';

dotenv.config();

// Define 25 Pizzas
const pizzas = [
  // Cheese Lovers
  {
    name: 'Margherita Premium',
    description: 'Classic Margherita with premium organic marinara sauce, fresh shredded mozzarella, fresh basil, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
    category: 'cheese-lovers',
    sizePrices: { small: 199, medium: 349, large: 499 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Fresh Basil', 'Olive Oil'],
    nutritionalDetails: { calories: 250, protein: 11, carbs: 28, fat: 10 },
    isFeatured: true
  },
  {
    name: 'Double Cheese Margherita',
    description: 'The favorite Margherita pizza loaded with extra mozzarella cheese on our signature hand-tossed crust.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    category: 'cheese-lovers',
    sizePrices: { small: 249, medium: 419, large: 599 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Double Cheese'],
    nutritionalDetails: { calories: 310, protein: 14, carbs: 30, fat: 15 },
    isFeatured: false
  },
  {
    name: 'Quattro Formaggi',
    description: 'Four cheese pizza loaded with rich Mozzarella, sharp Cheddar, salty Parmesan, and creamy Blue cheese over a garlic parmesan sauce.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'cheese-lovers',
    sizePrices: { small: 299, medium: 499, large: 699 },
    ingredients: ['Garlic Parmesan', 'Mozzarella', 'Cheddar', 'Parmesan', 'Blue Cheese'],
    nutritionalDetails: { calories: 340, protein: 16, carbs: 29, fat: 18 },
    isFeatured: true
  },
  {
    name: 'Cheddar Burst Classic',
    description: 'Gooey melted cheddar cheese crust base topped with standard mozzarella, tomato sauce, and mild herbs.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    category: 'cheese-lovers',
    sizePrices: { small: 269, medium: 449, large: 629 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Cheddar'],
    nutritionalDetails: { calories: 320, protein: 13, carbs: 32, fat: 16 }
  },

  // Veg
  {
    name: 'Farmhouse Pizza',
    description: 'Delightful combination of onion, capsicum, tomato, and grilled mushroom. A healthy veggie punch!',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    sizePrices: { small: 229, medium: 399, large: 569 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Onion', 'Capsicum', 'Tomato', 'Mushroom'],
    nutritionalDetails: { calories: 210, protein: 8, carbs: 26, fat: 8 },
    isFeatured: true
  },
  {
    name: 'Peppy Paneer',
    description: 'Chunky paneer, crisp capsicum, and spicy red pepper flakes topped with hot arrabbiata sauce and mozzarella.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    sizePrices: { small: 249, medium: 429, large: 599 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Paneer', 'Capsicum', 'Jalapeno'],
    nutritionalDetails: { calories: 280, protein: 12, carbs: 27, fat: 13 }
  },
  {
    name: 'Veggie Paradise',
    description: 'A colorful medley of golden corn, black olives, sliced jalapenos, onions, and red capsicum on classic marinara.',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    sizePrices: { small: 219, medium: 379, large: 549 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Corn', 'Olive', 'Jalapeno', 'Onion'],
    nutritionalDetails: { calories: 195, protein: 7, carbs: 28, fat: 7 }
  },
  {
    name: 'Garden Delight',
    description: 'Simple and delicious fresh tomatoes, onions, capsicum, and baby sweet corn with mozzarella.',
    image: 'https://images.unsplash.com/photo-1528137871230-7010a22f280a?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    sizePrices: { small: 199, medium: 339, large: 479 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Tomato', 'Onion', 'Capsicum', 'Corn'],
    nutritionalDetails: { calories: 180, protein: 6, carbs: 27, fat: 6 }
  },

  // Non-Veg
  {
    name: 'Pepperoni Supreme',
    description: 'Loaded with double spicy pepperoni slices and extra mozzarella cheese on a crispy crust.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    sizePrices: { small: 299, medium: 499, large: 699 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Pepperoni'],
    nutritionalDetails: { calories: 330, protein: 15, carbs: 25, fat: 19 },
    isFeatured: true
  },
  {
    name: 'Chicken Tikka Pizza',
    description: 'Tender chicken tikka chunks, sliced onions, capsicum, and fresh coriander over a tangy pizza sauce.',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    sizePrices: { small: 279, medium: 469, large: 659 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Chicken', 'Onion', 'Capsicum'],
    nutritionalDetails: { calories: 290, protein: 18, carbs: 26, fat: 12 },
    isFeatured: false
  },
  {
    name: 'Chicken Golden Delight',
    description: 'Mouthwatering double chicken toppings of spiced grilled chicken, chicken sausage, corn, and double cheese.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    sizePrices: { small: 289, medium: 489, large: 689 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Chicken', 'Sausage', 'Corn'],
    nutritionalDetails: { calories: 310, protein: 19, carbs: 28, fat: 14 }
  },
  {
    name: 'Ham & Olive Classic',
    description: 'Savoury smoked ham cubes, sliced black olives, mushrooms, and rich mozzarella cheese on tomato sauce.',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    sizePrices: { small: 259, medium: 439, large: 619 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Ham', 'Olive', 'Mushroom'],
    nutritionalDetails: { calories: 270, protein: 14, carbs: 26, fat: 12 }
  },

  // Signature
  {
    name: 'Paneer Makhani Signature',
    description: 'Cottage cheese (paneer) marinated in rich butter makhani gravy, onions, capsicum, and fresh cream swirls.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    category: 'signature',
    sizePrices: { small: 269, medium: 459, large: 639 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Paneer', 'Onion', 'Capsicum', 'Makhani Swirl'],
    nutritionalDetails: { calories: 320, protein: 13, carbs: 30, fat: 16 },
    isFeatured: true
  },
  {
    name: 'BBQ Chicken Blast',
    description: 'Grilled sweet BBQ chicken chunks, sliced red onions, and sweet corn drizzled with extra smoky BBQ sauce.',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    category: 'signature',
    sizePrices: { small: 279, medium: 479, large: 679 },
    ingredients: ['BBQ', 'Mozzarella', 'Chicken', 'Onion', 'Corn'],
    nutritionalDetails: { calories: 295, protein: 17, carbs: 32, fat: 11 }
  },
  {
    name: 'Chicken Bacon Ranch',
    description: 'Creamy ranch base topped with roasted chicken breast, crispy bacon bits, tomatoes, onions, and garlic flakes.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    category: 'signature',
    sizePrices: { small: 299, medium: 499, large: 699 },
    ingredients: ['Garlic Parmesan', 'Mozzarella', 'Chicken', 'Bacon', 'Tomato', 'Onion'],
    nutritionalDetails: { calories: 340, protein: 18, carbs: 25, fat: 18 }
  },

  // Premium
  {
    name: 'Ultimate Veggie Feast',
    description: 'Loaded with capsicum, onion, mushroom, sweet corn, black olives, jalapenos, and paneer cubes for the ultimate bite.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    sizePrices: { small: 279, medium: 469, large: 649 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Onion', 'Capsicum', 'Mushroom', 'Corn', 'Olive', 'Jalapeno', 'Paneer'],
    nutritionalDetails: { calories: 230, protein: 10, carbs: 29, fat: 9 },
    isFeatured: true
  },
  {
    name: 'Garlic Parmesan Veggie',
    description: 'Gourmet white garlic parmesan sauce, fresh spinach leaves, artichokes, mushrooms, and grilled onions.',
    image: 'https://images.unsplash.com/photo-1594007654729-407ededc4963?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    sizePrices: { small: 269, medium: 449, large: 629 },
    ingredients: ['Garlic Parmesan', 'Mozzarella', 'Mushroom', 'Onion', 'Spinach'],
    nutritionalDetails: { calories: 240, protein: 9, carbs: 26, fat: 12 }
  },
  {
    name: 'Non-Veg Supreme',
    description: 'The ultimate non-veg feast: grilled chicken tikka, spicy pepperoni, smoked sausage, onions, and olives.',
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    sizePrices: { small: 329, medium: 549, large: 779 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Chicken', 'Pepperoni', 'Sausage', 'Onion', 'Olive'],
    nutritionalDetails: { calories: 360, protein: 21, carbs: 26, fat: 20 },
    isFeatured: true
  },
  {
    name: 'Meat Lovers Feast',
    description: 'Loaded with every meat option: chicken, pepperoni, sausage, crispy bacon, and smoked ham.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    sizePrices: { small: 349, medium: 579, large: 799 },
    ingredients: ['Classic Tomato', 'Mozzarella', 'Chicken', 'Pepperoni', 'Sausage', 'Bacon', 'Ham'],
    nutritionalDetails: { calories: 395, protein: 23, carbs: 25, fat: 23 }
  },
  {
    name: 'Pesto Chicken Classic',
    description: 'A base of creamy basil pesto sauce topped with roasted chicken strips, cherry tomatoes, and shaved parmesan.',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    sizePrices: { small: 289, medium: 489, large: 689 },
    ingredients: ['Pesto', 'Mozzarella', 'Chicken', 'Tomato', 'Parmesan'],
    nutritionalDetails: { calories: 290, protein: 17, carbs: 24, fat: 14 }
  },

  // Spicy
  {
    name: 'Spicy Triple Tango',
    description: 'Fiery arrabbiata sauce with onions, jalapeños, and red paprika flakes for that spicy kick.',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    sizePrices: { small: 219, medium: 369, large: 519 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Onion', 'Jalapeno', 'Paprika'],
    nutritionalDetails: { calories: 190, protein: 7, carbs: 27, fat: 6 },
    isFeatured: true
  },
  {
    name: 'Fiery Jalapeno Pepper',
    description: 'Spiced capsicum, sliced jalapenos, red chilies, and onions on a classic spicy sauce base.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    sizePrices: { small: 209, medium: 359, large: 499 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Jalapeno', 'Capsicum', 'Onion'],
    nutritionalDetails: { calories: 185, protein: 7, carbs: 28, fat: 6 }
  },
  {
    name: 'Spicy Chicken Sausage',
    description: 'Chicken sausage crumbles, hot green chilies, onions, and jalapeños over arrabbiata sauce.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    sizePrices: { small: 259, medium: 439, large: 619 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Sausage', 'Onion', 'Jalapeno'],
    nutritionalDetails: { calories: 280, protein: 15, carbs: 26, fat: 12 }
  },
  {
    name: 'Spicy Salami Firehouse',
    description: 'Spicy arrabbiata base topped with salami chunks, red onions, hot red chilies, and extra cheese.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    sizePrices: { small: 299, medium: 499, large: 699 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Salami', 'Onion', 'Red Chili'],
    nutritionalDetails: { calories: 315, protein: 16, carbs: 27, fat: 15 }
  },
  {
    name: 'Spicy Arrabbiata Veggie',
    description: 'Rich tomato arrabbiata base, sweet corn, mushrooms, black olives, onions, and jalapeño peppers.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    sizePrices: { small: 229, medium: 389, large: 549 },
    ingredients: ['Spicy Arrabbiata', 'Mozzarella', 'Corn', 'Mushroom', 'Olive', 'Onion', 'Jalapeno'],
    nutritionalDetails: { calories: 205, protein: 8, carbs: 29, fat: 7 }
  }
];

// Define 10 Offers
const offers = [
  {
    title: 'Buy One Get One (BOGO) Free',
    description: 'Order any medium or large pizza and get a second one of equal or lesser value absolutely free! Code: BOGO',
    code: 'BOGO',
    discountType: 'bogo',
    discountValue: 0,
    minOrderValue: 349,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  },
  {
    title: 'Family Feast Combo',
    description: 'Get a Flat Rs. 150 off on minimum purchase of Rs. 600. Perfect for family pizza nights!',
    code: 'FAMILY150',
    discountType: 'fixed',
    discountValue: 150,
    minOrderValue: 600,
    image: 'https://images.unsplash.com/photo-1594007654729-407ededc4963?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Weekend Saver Special',
    description: 'Weekend Pizza Party! Get 25% off on your total bill. Minimum order of Rs. 500.',
    code: 'WEEKEND25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 500,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Flat 100 Off',
    description: 'Get Flat Rs. 100 Off on orders above Rs. 400. Coupon Code: CRAFT100',
    code: 'CRAFT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 400,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Welcome Discount',
    description: 'New to SliceCraft? Enjoy a massive 50% off on your first order! Valid up to Rs. 200 discount.',
    code: 'WELCOME50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 250,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Spicy Lovers Combo Deal',
    description: 'Love it hot? Get Rs. 75 off on any pizza from our Spicy Collection category. Min order Rs. 350.',
    code: 'SPICY75',
    discountType: 'fixed',
    discountValue: 75,
    minOrderValue: 350,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Mega Party Discount',
    description: 'Hosting a party? Get 30% Off on orders above Rs. 1200. Max discount Rs. 400.',
    code: 'PARTY30',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 1200,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Midweek Madness',
    description: 'Beat the Wednesday blues! Get Flat Rs. 80 Off on orders above Rs. 300.',
    code: 'MIDWEEK80',
    discountType: 'fixed',
    discountValue: 80,
    minOrderValue: 300,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Cheese Lovers Treat',
    description: 'Get 15% off on our Cheese Lovers category pizzas. Cheese burst and loaded with mozzarella.',
    code: 'CHEESE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 300,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Late Night Cravings',
    description: 'Get Flat Rs. 50 off on orders placed between 10 PM and 2 AM. Min order Rs. 299.',
    code: 'NIGHT50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 299,
    image: 'https://images.unsplash.com/photo-1528137871230-7010a22f280a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

// Define standard Coupons
const coupons = [
  { code: 'WELCOME50', discountType: 'percentage', discountValue: 50, minOrderAmount: 250, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: 'CRAFT100', discountType: 'fixed', discountValue: 100, minOrderAmount: 400, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: 'FAMILY150', discountType: 'fixed', discountValue: 150, minOrderAmount: 600, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: 'SLICE30', discountType: 'percentage', discountValue: 30, minOrderAmount: 500, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true }
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing collections
    console.log('Clearing database collections...');
    await User.deleteMany();
    await Pizza.deleteMany();
    await Offer.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Favorite.deleteMany();

    // Create Admin and test users
    console.log('Seeding Users...');
    const adminUser = new User({
      name: 'Admin Manager',
      email: 'admin@slicecraft.com',
      password: 'Admin@123', // Will be hashed in pre-save hook
      role: 'admin',
      phone: '9999999999',
      address: 'SliceCraft HQ, Sector 62, Noida, UP',
      isVerified: true
    });
    await adminUser.save();

    const customerUser = new User({
      name: 'Suman Kumar',
      email: 'suman@slicecraft.com',
      password: 'Password@123',
      role: 'user',
      phone: '9876543210',
      address: 'Rani Vihar, HMT Officers Colony, Hyderabad, Telangana',
      isVerified: true
    });
    await customerUser.save();

    const testUser = new User({
      name: 'John Doe',
      email: 'user@slicecraft.com',
      password: 'User@123',
      role: 'user',
      phone: '9000000000',
      address: 'Apt 4B, Baker Street, Hyderabad',
      isVerified: true
    });
    await testUser.save();

    // Seed Pizzas
    console.log('Seeding Pizzas...');
    const seededPizzas = await Pizza.insertMany(pizzas);

    // Seed Offers
    console.log('Seeding Offers...');
    await Offer.insertMany(offers);

    // Seed Coupons
    console.log('Seeding Coupons...');
    await Coupon.insertMany(coupons);

    // Seed Reviews for some featured pizzas
    console.log('Seeding Reviews...');
    const reviews = [
      { user: customerUser._id, pizza: seededPizzas[0]._id, rating: 5, comment: 'Hands down the best Margherita I have ever tasted! Extremely fresh crust.' },
      { user: testUser._id, pizza: seededPizzas[0]._id, rating: 4, comment: 'Very clean taste, the basil is super aromatic. Could use a little more sauce.' },
      { user: customerUser._id, pizza: seededPizzas[4]._id, rating: 5, comment: 'Perfect veggie loaded option! Healthy and yummy.' },
      { user: testUser._id, pizza: seededPizzas[8]._id, rating: 5, comment: 'Pepperoni Supreme was amazing! Generous pepperoni toppings and nice crust.' },
      { user: customerUser._id, pizza: seededPizzas[12]._id, rating: 4, comment: 'Felt very gourmet. Love the butter makhani swirl on top!' }
    ];
    
    // We insert reviews one-by-one so the save hooks/ratings calculations trigger
    for (const review of reviews) {
      const rev = new Review(review);
      await rev.save();
    }

    // Seed a mock order
    console.log('Seeding a mock order...');
    const mockOrder = new Order({
      orderId: 'SC-100293',
      user: customerUser._id,
      items: [
        {
          pizza: seededPizzas[0]._id,
          name: 'Margherita Premium',
          size: 'medium',
          crust: 'hand-tossed',
          sauce: 'tomato',
          cheese: 'mozzarella',
          vegToppings: ['Tomato', 'Olive'],
          nonVegToppings: [],
          extras: ['Extra Cheese'],
          quantity: 2,
          price: 399 // Base 349 + 50 toppings/extras
        }
      ],
      subtotal: 798,
      tax: 39.9,
      discount: 100,
      grandTotal: 737.9,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      status: 'delivered',
      deliveryAddress: {
        name: 'Suman Kumar',
        phone: '9876543210',
        email: 'suman@slicecraft.com',
        street: 'Rani Vihar, HMT Officers Colony',
        city: 'Hyderabad',
        zipCode: '500050'
      },
      statusTimeline: [
        { status: 'placed', timestamp: new Date(Date.now() - 3600000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 3000000) },
        { status: 'preparing', timestamp: new Date(Date.now() - 2400000) },
        { status: 'baking', timestamp: new Date(Date.now() - 1800000) },
        { status: 'out_for_delivery', timestamp: new Date(Date.now() - 1200000) },
        { status: 'delivered', timestamp: new Date(Date.now() - 600000) }
      ]
    });
    await mockOrder.save();

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();

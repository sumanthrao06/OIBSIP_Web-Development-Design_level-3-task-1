import User from '../models/User.js';
import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';

// @desc    Get dashboard analytics statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core KPIs
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? Math.round(revenueResult[0].total) : 0;

    // Conversion rate: users who placed at least one order / total users
    const usersWithOrders = await Order.distinct('user');
    const conversionRate = totalUsers > 0 
      ? Math.round((usersWithOrders.length / totalUsers) * 100) 
      : 0;

    // 2. Popular Pizzas (Pie Chart data)
    const popularPizzasResult = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          value: { $sum: '$items.quantity' }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ]);
    const popularPizzas = popularPizzasResult.map(item => ({
      name: item._id,
      value: item.value
    }));

    // If empty, add standard mock fallbacks for chart preview
    if (popularPizzas.length === 0) {
      popularPizzas.push(
        { name: 'Margherita Premium', value: 10 },
        { name: 'Pepperoni Supreme', value: 8 },
        { name: 'Farmhouse Pizza', value: 6 }
      );
    }

    // 3. Popular Toppings (Bar Chart data)
    const allOrdersForToppings = await Order.find({}, 'items');
    const toppingCounts = {};
    
    allOrdersForToppings.forEach(order => {
      order.items.forEach(item => {
        // Count veg toppings
        if (item.vegToppings) {
          item.vegToppings.forEach(t => {
            toppingCounts[t] = (toppingCounts[t] || 0) + item.quantity;
          });
        }
        // Count non-veg toppings
        if (item.nonVegToppings) {
          item.nonVegToppings.forEach(t => {
            toppingCounts[t] = (toppingCounts[t] || 0) + item.quantity;
          });
        }
        // Count extras as toppings
        if (item.extras) {
          item.extras.forEach(t => {
            toppingCounts[t] = (toppingCounts[t] || 0) + item.quantity;
          });
        }
      });
    });

    const popularToppings = Object.keys(toppingCounts)
      .map(name => ({ name, count: toppingCounts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Fallbacks if empty
    if (popularToppings.length === 0) {
      popularToppings.push(
        { name: 'Mozzarella', count: 15 },
        { name: 'Pepperoni', count: 12 },
        { name: 'Onion', count: 10 },
        { name: 'Mushroom', count: 8 },
        { name: 'Olive', count: 7 }
      );
    }

    // 4. Monthly/Daily Sales History (Line Chart data)
    // We group orders from the past 7 days for granular trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistoryResult = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const salesHistory = salesHistoryResult.map(item => ({
      date: item._id,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    // Fallbacks if empty
    if (salesHistory.length === 0) {
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        salesHistory.push({
          date: dateStr,
          revenue: 0,
          orders: 0
        });
      }
    }

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalUsers,
        conversionRate,
        popularPizzas,
        popularToppings,
        salesHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock status of a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an administrator account' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User has been successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete an administrator account' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

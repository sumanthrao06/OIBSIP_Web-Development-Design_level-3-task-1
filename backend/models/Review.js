import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: [true, 'Review must belong to a pizza']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true
  }
}, {
  timestamps: true
});

// Avoid duplicate reviews from same user for same pizza
reviewSchema.index({ user: 1, pizza: 1 }, { unique: true });

// Recalculate average rating of the pizza
reviewSchema.statics.calculateAverageRating = async function (pizzaId) {
  const stats = await this.aggregate([
    { $match: { pizza: pizzaId } },
    {
      $group: {
        _id: '$pizza',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Pizza').findByIdAndUpdate(pizzaId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingsCount: stats[0].ratingsCount
    });
  } else {
    await mongoose.model('Pizza').findByIdAndUpdate(pizzaId, {
      averageRating: 0,
      ratingsCount: 0
    });
  }
};

// Call calculateAverageRating after saving review
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.pizza);
});

// Call calculateAverageRating after updating or deleting review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.pizza);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

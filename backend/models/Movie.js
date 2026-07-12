const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: [{
    type: String,
    enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String
  }],
  releaseYear: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  trailer: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

MovieSchema.methods.calculateRating = async function() {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { movie: this._id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (result.length > 0) {
    this.rating = Math.round(result[0].avgRating * 10) / 10;
    this.totalReviews = result[0].count;
  } else {
    this.rating = 0;
    this.totalReviews = 0;
  }
  await this.save();
};

module.exports = mongoose.model('Movie', MovieSchema);
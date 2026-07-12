const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isSpoiler: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
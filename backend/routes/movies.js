const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get all movies with filters
router.get('/', async (req, res) => {
  try {
    const { genre, search, sort, year, page = 1, limit = 20 } = req.query;
    let query = {};

    if (genre) {
      query.genre = genre;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (year) {
      query.releaseYear = parseInt(year);
    }

    let sortOption = {};
    switch(sort) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'recent':
        sortOption = { releaseYear: -1 };
        break;
      case 'oldest':
        sortOption = { releaseYear: 1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { title: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('addedBy', 'name'),
      Movie.countDocuments(query)
    ]);

    res.json({
      movies,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('addedBy', 'name avatar');
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Increment views
    movie.views += 1;
    await movie.save();

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add movie (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const movie = new Movie({
      ...req.body,
      addedBy: req.user._id
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update movie (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete movie (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await Review.deleteMany({ movie: req.params.id });

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie statistics
router.get('/stats/genres', async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
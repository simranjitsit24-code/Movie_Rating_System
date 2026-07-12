const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ============ CORS ============
const allowedOrigins = [
  'https://movie-rating-frontend.onrender.com',
  'https://movie-rating-backend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MODELS ============
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}, { timestamps: true });

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  director: { type: String, required: true },
  cast: [{ type: String }],
  releaseYear: { type: Number, required: true },
  duration: { type: Number, required: true },
  poster: { type: String, default: '' },
  trailer: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Movie = mongoose.model('Movie', MovieSchema);
const Review = mongoose.model('Review', ReviewSchema);

// ============ MONGODB CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_rating';

// Connection options for production
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('✅ MongoDB Connected Successfully');
    
    // Check if movies exist, if not seed them
    const count = await Movie.countDocuments();
    if (count === 0) {
      await seedMovies();
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// ============ SEED MOVIES FUNCTION ============
const seedMovies = async () => {
  console.log('📝 Seeding movies...');
  
  const movies = [
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology. His tragic past may doom the project and his team to disaster.',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
      releaseYear: 2010,
      duration: 148,
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 4.8,
      totalReviews: 2500
    },
    {
      title: 'The Dark Knight',
      description: 'When the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      genre: ['Action', 'Crime', 'Drama'],
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
      releaseYear: 2008,
      duration: 152,
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: 4.9,
      totalReviews: 3200
    },
    {
      title: 'Interstellar',
      description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
      releaseYear: 2014,
      duration: 169,
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      rating: 4.7,
      totalReviews: 2800
    },
    {
      title: 'The Shawshank Redemption',
      description: 'Two imprisoned men bond over the years, finding solace and redemption through acts of common decency.',
      genre: ['Drama'],
      director: 'Frank Darabont',
      cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
      releaseYear: 1994,
      duration: 142,
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      rating: 4.9,
      totalReviews: 3000
    },
    {
      title: 'The Godfather',
      description: 'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.',
      genre: ['Crime', 'Drama'],
      director: 'Francis Ford Coppola',
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Robert Duvall'],
      releaseYear: 1972,
      duration: 175,
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      rating: 4.9,
      totalReviews: 2800
    }
  ];

  try {
    await Movie.insertMany(movies);
    console.log(`✅ Seeded ${movies.length} movies!`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// Connect to database
connectDB();

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus[dbState] || 'unknown',
    uptime: process.uptime()
  });
});

// ============ ROOT ============
app.get('/', (req, res) => {
  res.json({
    message: 'Movie Rating API',
    status: 'running',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      movies: '/api/movies, /api/movies/:id',
      reviews: '/api/reviews/movie/:movieId',
      health: '/health'
    }
  });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password // For development - use bcrypt in production
    });
    await user.save();

    const token = Buffer.from(user._id.toString()).toString('base64');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(user._id.toString()).toString('base64');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ MOVIE ROUTES ============
app.get('/api/movies', async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = {};

    if (genre) query.genre = genre;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'recent') sortOption = { createdAt: -1 };
    else sortOption = { title: 1 };

    const movies = await Movie.find(query).sort(sortOption);
    res.json({ movies });
  } catch (error) {
    console.error('Movies Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Movie Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/stats/genres', async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    console.error('Genres Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ FAVORITES ============
app.post('/api/movies/:id/favorite', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const movieId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = user.favorites.indexOf(movieId);
    const isFavorite = index === -1;

    if (isFavorite) {
      user.favorites.push(movieId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ success: true, isFavorite });
  } catch (error) {
    console.error('Favorite Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId).populate('favorites');
    res.json({ favorites: user?.favorites || [] });
  } catch (error) {
    console.error('Favorites Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id/favorite/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ isFavorite: false });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ isFavorite: false });
    }

    const isFavorite = user.favorites.includes(req.params.id);
    res.json({ isFavorite });
  } catch (error) {
    res.json({ isFavorite: false });
  }
});

// ============ REVIEW ROUTES ============
app.post('/api/reviews', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const { movieId, rating, review } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!review || review.trim().length < 3) {
      return res.status(400).json({ error: 'Review must be at least 3 characters' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const existing = await Review.findOne({ movie: movieId, user: userId });
    if (existing) {
      return res.status(400).json({ error: 'You already reviewed this movie' });
    }

    const newReview = new Review({
      movie: movieId,
      user: userId,
      rating,
      review: review.trim()
    });

    await newReview.save();

    const allReviews = await Review.find({ movie: movieId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    movie.rating = Math.round(avgRating * 10) / 10;
    movie.totalReviews = allReviews.length;
    await movie.save();

    const populatedReview = await Review.findById(newReview._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Review Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const index = review.likes.indexOf(userId);
    if (index > -1) {
      review.likes.splice(index, 1);
    } else {
      review.likes.push(userId);
    }

    await review.save();
    res.json({ likes: review.likes.length });
  } catch (error) {
    console.error('Like Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🎬 Movies: http://localhost:${PORT}/api/movies`);
});

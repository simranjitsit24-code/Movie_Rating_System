const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ============ CORS ============
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
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

// ============ CONNECT DB ============
mongoose.connect('mongodb://localhost:27017/movie_rating')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ============ SEED DATA ============
// This will create sample movies if none exist
const seedMovies = async () => {
  const count = await Movie.countDocuments();
  if (count > 0) return;

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
      description: "A team of explorers travel through a wormhole in space to ensure humanity's survival. Time behaves differently in this distant galaxy.",
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
    },
    {
      title: 'Pulp Fiction',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
      genre: ['Crime', 'Drama'],
      director: 'Quentin Tarantino',
      cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman', 'Bruce Willis'],
      releaseYear: 1994,
      duration: 154,
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      rating: 4.7,
      totalReviews: 2400
    },
    {
      title: 'Forrest Gump',
      description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
      genre: ['Drama', 'Romance'],
      director: 'Robert Zemeckis',
      cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise', 'Sally Field'],
      releaseYear: 1994,
      duration: 142,
      poster: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
      rating: 4.8,
      totalReviews: 2600
    },
    {
      title: 'The Matrix',
      description: 'A computer programmer discovers reality is a simulation created by machines, and joins a rebellion to break free.',
      genre: ['Sci-Fi', 'Action'],
      director: 'The Wachowskis',
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
      releaseYear: 1999,
      duration: 136,
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      rating: 4.7,
      totalReviews: 2200
    },
    {
      title: 'The Lord of the Rings: Fellowship',
      description: 'A meek Hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.',
      genre: ['Adventure', 'Fantasy'],
      director: 'Peter Jackson',
      cast: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen', 'Sean Astin'],
      releaseYear: 2001,
      duration: 178,
      poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      rating: 4.8,
      totalReviews: 2700
    },
    {
      title: 'Gladiator',
      description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      genre: ['Action', 'Drama'],
      director: 'Ridley Scott',
      cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen', 'Oliver Reed'],
      releaseYear: 2000,
      duration: 155,
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nR2DniLpT.jpg',
      rating: 4.7,
      totalReviews: 2300
    },
    {
      title: 'The Social Network',
      description: 'Harvard student Mark Zuckerberg creates Facebook, but is later sued by two brothers who claimed he stole their idea.',
      genre: ['Biography', 'Drama'],
      director: 'David Fincher',
      cast: ['Jesse Eisenberg', 'Andrew Garfield', 'Justin Timberlake', 'Armie Hammer'],
      releaseYear: 2010,
      duration: 120,
      poster: 'https://image.tmdb.org/t/p/w500/okVW4SPYgVLl0fB5G07uVQAKpBl.jpg',
      rating: 4.5,
      totalReviews: 1900
    },
    {
      title: 'The Wolf of Wall Street',
      description: 'Based on the true story of Jordan Belfort, from his rise as a wealthy stockbroker to his fall involving crime and corruption.',
      genre: ['Biography', 'Comedy', 'Crime'],
      director: 'Martin Scorsese',
      cast: ['Leonardo DiCaprio', 'Margot Robbie', 'Jonah Hill', 'Matthew McConaughey'],
      releaseYear: 2013,
      duration: 180,
      poster: 'https://image.tmdb.org/t/p/w500/vWzKjQ2eBpD8cT4elcR2yfFkP.jpg',
      rating: 4.6,
      totalReviews: 2100
    },
    {
      title: 'Avengers: Endgame',
      description: 'After the devastating events of Infinity War, the Avengers assemble to reverse Thanos\' actions and restore balance to the universe.',
      genre: ['Action', 'Adventure', 'Sci-Fi'],
      director: 'Russo Brothers',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Scarlett Johansson'],
      releaseYear: 2019,
      duration: 181,
      poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3gz.jpg',
      rating: 4.7,
      totalReviews: 3500
    },
    {
      title: 'Joker',
      description: 'A failed stand-up comedian is driven insane and turns to a life of crime in Gotham City, becoming an iconic psychopathic criminal.',
      genre: ['Crime', 'Drama', 'Thriller'],
      director: 'Todd Phillips',
      cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz', 'Frances Conroy'],
      releaseYear: 2019,
      duration: 122,
      poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
      rating: 4.6,
      totalReviews: 2900
    },
    {
      title: 'Parasite',
      description: 'A poor family cons their way into becoming servants of a rich family, but their deception is threatened with exposure.',
      genre: ['Comedy', 'Drama', 'Thriller'],
      director: 'Bong Joon-ho',
      cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
      releaseYear: 2019,
      duration: 132,
      poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      rating: 4.8,
      totalReviews: 3100
    }
  ];

  await Movie.insertMany(movies);
  console.log(`✅ Seeded ${movies.length} movies!`);
};

seedMovies();

// ============ ROUTES ============

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Movie Rating API',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      movies: '/api/movies, /api/movies/:id',
      favorites: '/api/movies/:id/favorite, /api/user/favorites'
    }
  });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = new User({ name, email: email.toLowerCase(), password });
    await user.save();

    const token = Buffer.from(user._id.toString()).toString('base64');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b35&color=fff&size=100`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = Buffer.from(user._id.toString()).toString('base64');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b35&color=fff&size=100`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) {
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
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else sortOption = { title: 1 };

    const movies = await Movie.find(query).sort(sortOption);
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

// ============ FAVORITES ROUTES ============

app.post('/api/movies/:id/favorite', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const userId = Buffer.from(token, 'base64').toString();
    const movieId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

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
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId).populate('favorites');
    
    res.json({ favorites: user?.favorites || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id/favorite/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ isFavorite: false });

    const userId = Buffer.from(token, 'base64').toString();
    const user = await User.findById(userId);
    
    if (!user) return res.json({ isFavorite: false });

    const isFavorite = user.favorites.includes(req.params.id);
    res.json({ isFavorite });
  } catch (error) {
    res.json({ isFavorite: false });
  }
});

// ============ REVIEW ROUTES ============

// Add review - Fixed version
app.post('/api/reviews', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = Buffer.from(token, 'base64').toString();
    const { movieId, rating, review } = req.body;

    // Validate
    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!review || review.trim().length < 3) {
      return res.status(400).json({ error: 'Review must be at least 3 characters' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ movie: movieId, user: userId });
    if (existing) {
      return res.status(400).json({ error: 'You already reviewed this movie' });
    }

    // Create review
    const newReview = new Review({
      movie: movieId,
      user: userId,
      rating: rating,
      review: review.trim()
    });

    await newReview.save();

    // Update movie rating
    const allReviews = await Review.find({ movie: movieId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    movie.rating = Math.round(avgRating * 10) / 10;
    movie.totalReviews = allReviews.length;
    await movie.save();

    // Populate user data
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

// Get reviews for a movie
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

// Like a review
app.post('/api/reviews/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
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

// ============ START ============
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🎬 Movies: http://localhost:${PORT}/api/movies`);
});
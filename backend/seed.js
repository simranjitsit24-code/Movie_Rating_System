const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie_rating')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

// Movie Schema
const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: [String],
  director: String,
  cast: [String],
  releaseYear: Number,
  duration: Number,
  poster: String,
  rating: Number,
  totalReviews: Number
});

const Movie = mongoose.model('Movie', MovieSchema);

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

// Seed function
const seed = async () => {
  try {
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('✅ Cleared existing movies');

    // Insert new movies
    await Movie.insertMany(movies);
    console.log(`✅ Added ${movies.length} movies!`);

    // Show count
    const count = await Movie.countDocuments();
    console.log(`📊 Total movies: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seed();
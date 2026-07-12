import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ type }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [genres, setGenres] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const search = queryParams.get('search');
    if (search) setSearchTerm(search);
    
    const sort = queryParams.get('sort');
    if (sort) setSortBy(sort);
    
    if (type === 'favorites' && isAuthenticated) {
      fetchFavorites();
    } else {
      fetchMovies();
    }
    fetchGenres();
  }, [searchTerm, selectedGenre, sortBy, type, isAuthenticated]);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (sortBy) params.append('sort', sortBy);
      
      const response = await axios.get(`/api/movies?${params.toString()}`);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user/favorites');
      setMovies(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/movies/stats/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleFavoriteToggle = (movieId) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie._id === movieId 
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  if (loading) {
    return (
      <div className="movie-list-container">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h1>
          {type === 'favorites' ? '❤️ My Favorites' : '🎬 Movies'}
        </h1>
        <p>
          {type === 'favorites' 
            ? `${movies.length} movies in your favorites`
            : `Discover and rate movies from our collection (${movies.length} movies)`}
        </p>
      </div>

      {type !== 'favorites' && (
        <div className="movie-list-controls">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch /> Search
            </button>
          </form>

          <div className="filter-controls">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre._id} value={genre._id}>
                    {genre._id} ({genre.count})
                  </option>
                ))}
              </select>
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard 
              key={movie._id} 
              movie={movie} 
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            {type === 'favorites' ? '❤️' : '🎬'}
          </div>
          <h3>
            {type === 'favorites' 
              ? 'No favorites yet' 
              : 'No movies found'}
          </h3>
          <p>
            {type === 'favorites' 
              ? 'Start adding movies to your favorites by clicking the heart icon' 
              : 'Try adjusting your search or filter criteria'}
          </p>
        </div>
      )}
    </div>
  );
}

export default MovieList;
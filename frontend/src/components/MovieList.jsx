import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaFilter } from 'react-icons/fa';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sort: 'recent',
    year: ''
  });
  const [genres, setGenres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    const sortParam = params.get('sort') || 'recent';
    
    setFilters(prev => ({
      ...prev,
      search: searchParam,
      sort: sortParam
    }));
    
    fetchGenres();
  }, [location]);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/movies/stats/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.year) params.append('year', filters.year);
      
      const response = await axios.get(`/api/movies?${params}`);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half" />);
    }
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }
    return stars;
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="movie-list">
      <div className="movie-list-header">
        <h1>All Movies</h1>
        <div className="filters">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={filters.genre} 
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g._id} value={g._id}>{g._id} ({g.count})</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={filters.sort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="filter-group">
            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              min="1900"
              max="2024"
            />
          </div>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="no-movies">No movies found</div>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} renderStars={renderStars} />
          ))}
        </div>
      )}
    </div>
  );
}

function MovieCard({ movie, renderStars }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <div className="movie-card-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-card-rating-badge">
          <FaStar className="star-icon" />
          <span>{movie.rating?.toFixed(1) || 0}</span>
        </div>
      </div>
      <div className="movie-card-info">
        <h4>{movie.title}</h4>
        <div className="movie-card-meta">
          <span>{movie.releaseYear}</span>
          <span>{movie.genre?.[0]}</span>
          <span>{movie.duration}m</span>
        </div>
        <div className="movie-card-stars">
          {renderStars(movie.rating || 0)}
          <span className="review-count">({movie.totalReviews})</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieList;
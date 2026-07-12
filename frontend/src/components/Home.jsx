import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPlay } from 'react-icons/fa';
import './Home.css';

function Home() {
  const [topRated, setTopRated] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      const allMovies = response.data.movies || [];
      
      const top = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 6);
      setTopRated(top);
      
      const latest = [...allMovies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      setLatestMovies(latest);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>🎬 Rate & Review Movies</h1>
          <p>Discover the best movies rated by our community</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Movies</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.5</span>
              <span className="stat-label">Avg Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rated Movies */}
      <div className="section">
        <div className="section-header">
          <h2>⭐ Top Rated Movies</h2>
          <Link to="/movies?sort=rating" className="show-all">View All</Link>
        </div>
        <div className="movie-grid">
          {topRated.map(movie => (
            <MovieCard key={movie._id} movie={movie} renderStars={renderStars} />
          ))}
        </div>
      </div>

      {/* Latest Movies */}
      <div className="section">
        <div className="section-header">
          <h2>🎬 Latest Movies</h2>
          <Link to="/movies" className="show-all">View All</Link>
        </div>
        <div className="movie-grid">
          {latestMovies.map(movie => (
            <MovieCard key={movie._id} movie={movie} renderStars={renderStars} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, renderStars }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <div className="movie-card-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-card-overlay">
          <FaPlay className="play-icon" />
        </div>
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

export default Home;
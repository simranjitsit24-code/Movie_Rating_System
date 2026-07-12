import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './MovieCard.css';

function MovieCard({ movie, onFavoriteToggle }) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isAuthenticated && movie?._id) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, movie?._id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/api/movies/${movie._id}/favorite/status`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/movies/${movie._id}/favorite`);
      setIsFavorite(response.data.isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(movie._id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

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

  const getPosterUrl = () => {
    if (imageError || !movie.poster) {
      return 'https://via.placeholder.com/300x450?text=No+Poster';
    }
    return movie.poster;
  };

  if (!movie) return null;

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`} className="movie-card-link">
        <div className="movie-card-poster">
          <img 
            src={getPosterUrl()} 
            alt={movie.title || 'Movie'} 
            onError={() => setImageError(true)}
          />
          <div className="movie-card-overlay">
            <FaPlay className="play-icon" />
            <span className="view-details">View Details</span>
          </div>
          <div className="movie-card-rating-badge">
            <FaStar className="star-icon" />
            <span>{movie.rating?.toFixed(1) || '0'}</span>
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={loading}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="movie-card-info">
          <h4>{movie.title || 'Untitled'}</h4>
          <div className="movie-card-meta">
            <span>{movie.releaseYear || 'N/A'}</span>
            <span>•</span>
            <span>{movie.genre?.[0] || 'Unknown'}</span>
          </div>
          <div className="movie-card-stars">
            {renderStars(movie.rating || 0)}
            <span className="review-count">({movie.totalReviews || 0})</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, 
  FaCalendar, FaClock, FaUser, FaThumbsUp, FaShare, FaPlay
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ CORRECT: Get auth from useAuth hook
  const { user, isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch movie details and reviews
  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setError('Failed to load movie details');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/movie/${id}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}/favorite/status`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/movies/${id}/favorite`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!userReview.trim() || userReview.trim().length < 3) {
      setError('Please write a review (minimum 3 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/reviews', {
        movieId: id,
        rating: userRating,
        review: userReview.trim()
      });
      
      setSuccess('Review submitted successfully!');
      setUserRating(0);
      setUserReview('');
      setShowReviewForm(false);
      
      // Refresh data
      await fetchMovieDetails();
      await fetchReviews();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Submit review error:', error);
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/reviews/${reviewId}/like`);
      await fetchReviews();
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  // Render stars function
  const renderStars = (rating, size = 'medium') => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={`star filled ${size}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={`star half ${size}`} />);
    }
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`star empty ${size}`} />);
    }
    return stars;
  };

  // Rating selector stars
  const renderRatingStars = () => {
    return (
      <div className="rating-selector">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`rating-star ${star <= userRating ? 'active' : ''}`}
            onClick={() => setUserRating(star)}
            onMouseEnter={() => setUserRating(star)}
            style={{ cursor: 'pointer' }}
          />
        ))}
        <span className="rating-label">{userRating > 0 ? `${userRating}/5` : 'Click to rate'}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="error-container">
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/movies')} className="back-btn">Back to Movies</button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>❌ Movie not found</h2>
        <button onClick={() => navigate('/movies')} className="back-btn">Back to Movies</button>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      {/* Movie Header */}
      <div className="movie-details-header">
        <div className="movie-poster">
          <img 
            src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title} 
          />
          {movie.rating > 0 && (
            <div className="movie-rating-badge">
              <FaStar className="badge-icon" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="movie-info">
          <h1>{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="meta-item">
              <FaCalendar /> {movie.releaseYear}
            </span>
            <span className="meta-item">
              <FaClock /> {movie.duration} min
            </span>
            <span className="meta-item">
              <FaUser /> {movie.director}
            </span>
          </div>

          <div className="movie-genres">
            {movie.genre?.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>

          <div className="movie-rating-display">
            <div className="rating-stars-large">
              {renderStars(movie.rating || 0, 'large')}
            </div>
            <span className="rating-number">{movie.rating?.toFixed(1) || '0'}</span>
            <span className="rating-count">({movie.totalReviews || 0} reviews)</span>
          </div>

          <p className="movie-description">{movie.description}</p>

          <div className="movie-cast">
            <h4>Cast:</h4>
            <div className="cast-list">
              {movie.cast?.map((actor, index) => (
                <span key={index} className="cast-item">{actor}</span>
              ))}
            </div>
          </div>

          <div className="movie-actions">
            <button 
              className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
            
            {!showReviewForm ? (
              <button 
                className="action-btn review-btn"
                onClick={() => isAuthenticated ? setShowReviewForm(true) : navigate('/login')}
              >
                Write a Review
              </button>
            ) : (
              <button 
                className="action-btn cancel-btn"
                onClick={() => {
                  setShowReviewForm(false);
                  setError('');
                  setUserRating(0);
                  setUserReview('');
                }}
              >
                Cancel Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <h3>Write Your Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Your Rating *</label>
              {renderRatingStars()}
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your thoughts about this movie... (minimum 3 characters)"
                rows="4"
                disabled={submitting}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this movie!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-user">
                    <img 
                      src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=ff6b35&color=fff&size=40`} 
                      alt={review.user?.name} 
                    />
                    <div>
                      <span className="user-name">{review.user?.name || 'Anonymous'}</span>
                      <div className="review-stars">
                        {renderStars(review.rating, 'small')}
                      </div>
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-text">{review.review}</p>
                <div className="review-actions">
                  <button 
                    className={`like-btn ${review.likes?.includes(user?._id) ? 'liked' : ''}`}
                    onClick={() => handleLikeReview(review._id)}
                  >
                    <FaThumbsUp /> {review.likes?.length || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
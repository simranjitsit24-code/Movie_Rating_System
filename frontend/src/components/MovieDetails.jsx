
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaCalendar, FaClock, FaUser, FaShare } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './MovieDetails.css';
// Add this import at the top
import ReviewForm from './ReviewForm';

// Replace the review form section with this:

{/* Review Form */}
{isAuthenticated && (
  <ReviewForm 
    movieId={id} 
    onReviewAdded={(newReview) => {
      setReviews([newReview, ...reviews]);
      fetchMovieDetails();
    }}
  />
)}

{/* Reviews List */}
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
                <span className="review-username">{review.user?.name || 'Anonymous'}</span>
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
              className={`like-btn ${review.liked ? 'liked' : ''}`}
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
function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/reviews', {
        movieId: id,
        rating: userRating,
        review: userReview
      });
      
      setUserRating(0);
      setUserReview('');
      setShowReviewForm(false);
      fetchMovieDetails();
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review');
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
      const response = await axios.post(`/api/reviews/${reviewId}/like`);
      fetchReviews();
    } catch (error) {
      console.error('Error liking review:', error);
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

  const renderRatingStars = (rating, setRating) => {
    return (
      <div className="rating-selector">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`rating-star ${star <= rating ? 'active' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <div className="movie-details-header">
        <div className="movie-poster">
          <img src={movie.poster} alt={movie.title} />
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
            {movie.genre?.map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
          <div className="movie-rating-display">
            <div className="rating-stars-large">
              {renderStars(movie.rating || 0)}
            </div>
            <span className="rating-number">{movie.rating?.toFixed(1) || 0}</span>
            <span className="rating-count">({movie.totalReviews} reviews)</span>
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
            {!showReviewForm ? (
              <button 
                className="review-btn"
                onClick={() => isAuthenticated ? setShowReviewForm(true) : navigate('/login')}
              >
                Write a Review
              </button>
            ) : (
              <button 
                className="review-btn cancel"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
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
              <label>Your Rating</label>
              {renderRatingStars(userRating, setUserRating)}
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                required
                minLength="10"
                maxLength="1000"
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="no-reviews">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-user">
                    <img src={review.user?.avatar} alt={review.user?.name} />
                    <span className="user-name">{review.user?.name}</span>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="review-text">{review.review}</p>
                <div className="review-actions">
                  <button 
                    className="like-btn"
                    onClick={() => handleLikeReview(review._id)}
                  >
                    <FaHeart className={review.likes?.includes(user?._id) ? 'liked' : ''} />
                    <span>{review.likes?.length || 0}</span>
                  </button>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
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
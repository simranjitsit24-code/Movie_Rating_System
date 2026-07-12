import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ReviewForm.css';

function ReviewForm({ movieId, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (rating === 0) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    if (!review.trim() || review.trim().length < 3) {
      setError('Please write a review (minimum 3 characters)');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/reviews', {
        movieId: movieId,
        rating: rating,
        review: review.trim()
      });

      setSuccess('Review submitted successfully!');
      setRating(0);
      setReview('');
      
      if (onReviewAdded) {
        onReviewAdded(response.data.review);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Submit Review Error:', error);
      setError(error.response?.data?.error || 'Failed to submit review');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form-container">
        <p className="login-prompt">Please login to leave a review</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
            <span className="rating-label">{rating > 0 ? `${rating}/5` : 'Select rating'}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows="4"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          type="submit" 
          className="submit-review-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaStar, FaFilm } from 'react-icons/fa';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/user/${user?._id}`);
      setUserReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/auth/profile', { name, bio });
      setIsEditing(false);
      // Refresh user data
      const response = await axios.get('/api/auth/me');
      // Update context user
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user?.avatar} alt={user?.name} />
        </div>
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength="200"
                />
              </div>
              <div className="edit-actions">
                <button type="submit" disabled={loading}>
                  <FaSave /> {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1>{user?.name}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-bio">{user?.bio || 'No bio yet'}</p>
              <div className="profile-stats">
                <div className="stat">
                  <FaStar className="stat-icon" />
                  <span className="stat-number">{userReviews.length}</span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat">
                  <FaFilm className="stat-icon" />
                  <span className="stat-number">10</span>
                  <span className="stat-label">Movies Rated</span>
                </div>
              </div>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="user-reviews">
        <h2>My Reviews</h2>
        {userReviews.length === 0 ? (
          <div className="no-reviews">You haven't reviewed any movies yet</div>
        ) : (
          <div className="reviews-grid">
            {userReviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-movie">
                  <img src={review.movie?.poster} alt={review.movie?.title} />
                  <div className="review-movie-info">
                    <h4>{review.movie?.title}</h4>
                    <div className="review-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.review}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
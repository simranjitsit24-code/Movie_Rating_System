import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFilm, 
  FaUser, 
  FaCalendar, 
  FaClock, 
  FaTags, 
  FaInfoCircle,
  FaImage,
  FaPlus,
  FaTimes,
  FaUpload
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AddMovie.css';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

function AddMovie() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [castMembers, setCastMembers] = useState([]);
  const [castInput, setCastInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    director: '',
    releaseYear: '',
    duration: '',
    poster: '',
    trailer: ''
  });

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="add-movie-container">
        <div className="error-page">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  const handleAddCast = () => {
    if (castInput.trim() && !castMembers.includes(castInput.trim())) {
      setCastMembers([...castMembers, castInput.trim()]);
      setCastInput('');
    }
  };

  const handleRemoveCast = (cast) => {
    setCastMembers(castMembers.filter(c => c !== cast));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCast();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a movie title');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a movie description');
      setLoading(false);
      return;
    }

    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
      setLoading(false);
      return;
    }

    if (!formData.director.trim()) {
      setError('Please enter the director name');
      setLoading(false);
      return;
    }

    if (!formData.releaseYear) {
      setError('Please enter the release year');
      setLoading(false);
      return;
    }

    if (!formData.duration) {
      setError('Please enter the duration');
      setLoading(false);
      return;
    }

    try {
      const movieData = {
        ...formData,
        genre: selectedGenres,
        cast: castMembers,
        releaseYear: parseInt(formData.releaseYear),
        duration: parseInt(formData.duration)
      };

      await axios.post('/api/movies', movieData);
      
      setSuccess('Movie added successfully!');
      setFormData({
        title: '',
        description: '',
        director: '',
        releaseYear: '',
        duration: '',
        poster: '',
        trailer: ''
      });
      setSelectedGenres([]);
      setCastMembers([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/movies');
      }, 2000);
    } catch (error) {
      console.error('Error adding movie:', error);
      setError(error.response?.data?.error || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-container">
      <div className="add-movie-header">
        <h1>
          <FaFilm className="header-icon" />
          Add New Movie
        </h1>
        <p>Add a new movie to the collection</p>
      </div>

      <div className="add-movie-card">
        <form onSubmit={handleSubmit} className="add-movie-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              <FaFilm className="input-icon" />
              Movie Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter movie title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              <FaInfoCircle className="input-icon" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter movie description"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={loading}
              rows="5"
              className="form-textarea"
            />
          </div>

          {/* Director & Year */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="director">
                <FaUser className="input-icon" />
                Director
              </label>
              <input
                id="director"
                type="text"
                name="director"
                placeholder="Director name"
                value={formData.director}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="releaseYear">
                <FaCalendar className="input-icon" />
                Release Year
              </label>
              <input
                id="releaseYear"
                type="number"
                name="releaseYear"
                placeholder="2024"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
                disabled={loading}
                min="1900"
                max="2100"
                className="form-input"
              />
            </div>
          </div>

          {/* Duration & Poster */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">
                <FaClock className="input-icon" />
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                name="duration"
                placeholder="120"
                value={formData.duration}
                onChange={handleInputChange}
                required
                disabled={loading}
                min="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="poster">
                <FaImage className="input-icon" />
                Poster URL
              </label>
              <input
                id="poster"
                type="url"
                name="poster"
                placeholder="https://example.com/poster.jpg"
                value={formData.poster}
                onChange={handleInputChange}
                disabled={loading}
                className="form-input"
              />
            </div>
          </div>

          {/* Trailer */}
          <div className="form-group">
            <label htmlFor="trailer">
              <FaUpload className="input-icon" />
              Trailer URL
            </label>
            <input
              id="trailer"
              type="url"
              name="trailer"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.trailer}
              onChange={handleInputChange}
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Genres */}
          <div className="form-group">
            <label>
              <FaTags className="input-icon" />
              Genres
            </label>
            <div className="genres-grid">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  className={`genre-chip ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                  onClick={() => handleGenreToggle(genre)}
                  disabled={loading}
                >
                  {genre}
                </button>
              ))}
            </div>
            {selectedGenres.length > 0 && (
              <div className="selected-genres">
                Selected: {selectedGenres.join(', ')}
              </div>
            )}
          </div>

          {/* Cast */}
          <div className="form-group">
            <label>Cast</label>
            <div className="cast-input-wrapper">
              <input
                type="text"
                placeholder="Enter cast member name"
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="form-input"
              />
              <button
                type="button"
                onClick={handleAddCast}
                className="add-cast-btn"
                disabled={!castInput.trim() || loading}
              >
                <FaPlus /> Add
              </button>
            </div>
            {castMembers.length > 0 && (
              <div className="cast-list">
                {castMembers.map((cast, index) => (
                  <div key={index} className="cast-tag">
                    {cast}
                    <button
                      type="button"
                      onClick={() => handleRemoveCast(cast)}
                      className="remove-cast-btn"
                      disabled={loading}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="error-message">
              <FaTimes className="error-icon" />
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              <FaFilm className="success-icon" />
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding Movie...' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMovie;
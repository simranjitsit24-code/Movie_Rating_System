import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBell, FaUser, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">🎬 MovieRating</h1>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="navbar-right">
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          {user?.role === 'admin' && (
            <Link to="/add-movie" className="nav-link">Add Movie</Link>
          )}
        </div>

        <div className="navbar-user">
          {user ? (
            <div className="user-dropdown">
              <div 
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={user.avatar} alt={user.name} />
                <span className="user-name">{user.name}</span>
                <FaChevronDown className="dropdown-icon" />
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    <FaUser /> Profile
                  </Link>
                  <button onClick={() => {
                    setShowDropdown(false);
                    logout();
                    navigate('/login');
                  }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaFilm, 
  FaStar, 
  FaHeart, 
  FaUser, 
  FaSignOutAlt,
  FaPlusCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaFilm, label: 'Movies', path: '/movies' },
    { icon: FaStar, label: 'Top Rated', path: '/movies?sort=rating' },
    { icon: FaHeart, label: 'Favorites', path: '/favorites' },
  ];

  const adminItems = [
    { icon: FaPlusCircle, label: 'Add Movie', path: '/add-movie' },
  ];

  const items = user?.role === 'admin' ? [...menuItems, ...adminItems] : menuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">MovieRating</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path.includes('?') && location.pathname === '/movies');
          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <Link to="/profile" className="sidebar-item">
          <FaUser className="sidebar-icon" />
          <span className="sidebar-label">Profile</span>
        </Link>
        <button className="sidebar-item logout-btn" onClick={logout}>
          <FaSignOutAlt className="sidebar-icon" />
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
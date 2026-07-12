import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import AddMovie from './components/AddMovie';
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';
import axios from 'axios';

// Set API URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

console.log('🔗 API URL:', API_URL); // ✅ Check this in browser console
// Private Route Component - Only accessible when logged in
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component - Only accessible by admin users
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

// Main Layout Component with Sidebar and Navbar
function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// Auth Layout (No Sidebar)
function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <main className="auth-content">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Sidebar */}
        <Route 
          path="/login" 
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } 
        />
        
        {/* Main Routes - With Sidebar */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/movies" 
          element={
            <MainLayout>
              <MovieList />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/movies/:id" 
          element={
            <MainLayout>
              <MovieDetails />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/add-movie" 
          element={
            <AdminRoute>
              <MainLayout>
                <AddMovie />
              </MainLayout>
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/favorites" 
          element={
            <PrivateRoute>
              <MainLayout>
                <MovieList type="favorites" />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/watchlist" 
          element={
            <PrivateRoute>
              <MainLayout>
                <MovieList type="watchlist" />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        {/* 404 - Not Found */}
        <Route 
          path="*" 
          element={
            <MainLayout>
              <div className="not-found">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <a href="/" className="back-home-btn">Go Back Home</a>
              </div>
            </MainLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: '#666', percentage: 0 };
    
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    
    const total = 6;
    const percentage = (score / total) * 100;
    
    let label, color;
    if (score === 0) { label = 'Very Weak'; color = '#ff4444'; }
    else if (score === 1) { label = 'Weak'; color = '#ff6b6b'; }
    else if (score === 2) { label = 'Fair'; color = '#ffa94d'; }
    else if (score === 3) { label = 'Good'; color = '#51cf66'; }
    else if (score === 4) { label = 'Strong'; color = '#40c057'; }
    else { label = 'Very Strong'; color = '#2b8a3e'; }
    
    return { score, label, color, percentage };
  };

  // Validate password requirements
  const validatePassword = (pass) => {
    return [
      { test: pass.length >= 8, label: 'At least 8 characters' },
      { test: /[a-z]/.test(pass), label: 'Lowercase letter' },
      { test: /[A-Z]/.test(pass), label: 'Uppercase letter' },
      { test: /[0-9]/.test(pass), label: 'Number' },
      { test: /[^a-zA-Z0-9]/.test(pass), label: 'Special character' },
    ];
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordRequirements = validatePassword(password);
  const isPasswordValid = passwordRequirements.every(req => req.test);
  const doPasswordsMatch = password === confirmPassword && password !== '';
  const isFormValid = name.trim() && email.trim() && isPasswordValid && doPasswordsMatch && acceptTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Submitting registration form...');
      const result = await register(name, email, password);
      
      if (result.success) {
        console.log('✅ Registration successful, navigating to home...');
        navigate('/');
      } else {
        console.error('❌ Registration failed:', result.error);
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our movie community today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className={name ? 'filled' : ''}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={email ? 'filled' : ''}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className={password ? 'filled' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${passwordStrength.percentage}%`, 
                    backgroundColor: passwordStrength.color
                  }}
                />
              </div>
              <div className="strength-info">
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
                <span className="strength-score">
                  {passwordStrength.score}/6
                </span>
              </div>
              <div className="strength-requirements">
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className={`requirement-item ${req.test ? 'met' : ''}`}
                  >
                    {req.test ? <FaCheck /> : <FaTimes />}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className={confirmPassword ? 'filled' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPassword && (
              <div className={`password-match ${doPasswordsMatch ? 'match' : 'mismatch'}`}>
                {doPasswordsMatch ? (
                  <><FaCheck /> Passwords match</>
                ) : (
                  <><FaTimes /> Passwords do not match</>
                )}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
              />
              <span>I accept the Terms and Conditions</span>
            </label>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
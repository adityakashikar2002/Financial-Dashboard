import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import Logo from '../../assets/icons/signin.jpg'; // Adjust the path to your logo
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <div className="illustration-wrapper">
          {/* <svg viewBox="0 0 500 500" className="auth-illustration">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="250" cy="250" r="240" fill="url(#gradient1)" opacity="0.1" />
            <path fill="#6366f1" opacity="0.2" d="M100,400 Q250,450 400,400 L400,500 L100,500 Z" />
            <path fill="#4f46e5" d="M150,150 Q250,50 350,150 L350,350 Q250,450 150,350 Z" />
            <path fill="#8b5cf6" d="M200,200 Q250,150 300,200 L300,300 Q250,350 200,300 Z" />
            <path fill="#a78bfa" d="M225,225 Q250,200 275,225 L275,275 Q250,300 225,275 Z" />
            <circle cx="250" cy="250" r="40" fill="#ffffff" />
            <path fill="#4f46e5" d="M120,120 L150,150 L120,180 Z" opacity="0.7" />
            <path fill="#4f46e5" d="M380,120 L350,150 L380,180 Z" opacity="0.7" />
            <path fill="#4f46e5" d="M120,320 L150,350 L120,380 Z" opacity="0.7" />
            <path fill="#4f46e5" d="M380,320 L350,350 L380,380 Z" opacity="0.7" />
          </svg> */}
          <img src={Logo} alt="Sign-in" className="signin-logo" />
        </div>
        <div className="illustration-content">
          <h2>Money Matters</h2>
          <p>Take control of your finances with our powerful tools and insights.</p>
        </div>
      </div>
      
      <div className="login-form-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-wrapper">
              <svg className="logo-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M15.5,11c0.83,0,1.5-0.67,1.5-1.5S16.33,8,15.5,8S14,8.67,14,9.5S14.67,11,15.5,11z M8.5,11c0.83,0,1.5-0.67,1.5-1.5S9.33,8,8.5,8S7,8.67,7,9.5S7.67,11,8.5,11z M12,17.5c-2.03,0-3.8-1.11-4.75-2.75C7.06,14.5,6.5,14.5,6.5,14.5c0.38,3.39,3.26,6,6.5,6s6.12-2.61,6.5-6c0,0-0.56,0-0.75,0.75C15.8,16.39,14.03,17.5,12,17.5z" />
              </svg>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your account</p>
          </div>
          
          {error && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2,2,6.5,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M12,20A8,8,0,0,1,4,12A8,8,0,0,1,12,4A8,8,0,0,1,20,12A8,8,0,0,1,12,20Z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="primary-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#">Contact administrator</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
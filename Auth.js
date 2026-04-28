import React, { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (isLogin) {
      // LOGIN: Check if user exists
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          name: user.name
        }));
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      // SIGNUP: Check if email already exists
      if (users.find(u => u.email === email)) {
        setError('Email already exists. Please login.');
        return;
      }

      // Create new user
      const newUser = {
        email,
        password,
        name,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Initialize user data
      localStorage.setItem(`expenses_${email}`, JSON.stringify([]));
      localStorage.setItem(`savings_${email}`, JSON.stringify([]));
      localStorage.setItem(`goal_${email}`, '0');

      setSuccess('Account created successfully! Please login.');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
        setPassword('');
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">💰</div>
        <div className="auth-title">Finance Tracker</div>

        <div className="auth-toggle">
          <button
            className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button
            className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <span className="auth-input-icon">📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <span className="auth-input-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? '🔓 Login' : '📝 Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;